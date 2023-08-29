import type { Argv, Executable } from '@bleed-believer/commander';
import type { Response } from 'express';
import type { Server } from 'http';

import { Command, GetArgv } from '@bleed-believer/commander';
import { AppRouting } from './controllers/app.routing.js';
import { Espresso } from '@bleed-believer/espresso';
import { resolve } from 'path';
import express from 'express';
import npmlog from 'npmlog';
import { dataSource } from '@/data-source.js';


@Command({
    name: 'Web Server',
    path: 'server'
})
export class ServerCommand implements Executable {
    static readonly clientPath = resolve('../client/dist/client');

    @GetArgv()
    declare argv: Argv;

    get port(): number {
        const raw = this.argv.flags['--port'];
        const num = parseInt(raw?.at(0) ?? 'null');
        if (!isNaN(num)) {
            return Math.abs(Math.trunc(num));
        } else {
            return 8080;
        }
    }

    async start(): Promise<void> {
        // Initialize connection
        npmlog.info('server', 'Connecting to DB...');
        await dataSource.initialize();

        // Create the web server
        npmlog.info('server', 'Preparing Web Server...');
        const app = express();
        app.use(express.json({ type: 'application/json' }));
        app.use(express.static(ServerCommand.clientPath));
        app.use(express.urlencoded({ extended: true }));

        // Attach controllers
        const esp = new Espresso(app, { verbose: true, lowercase: true });
        esp.onError(this.onError.bind(this));
        esp.inject(AppRouting);

        // Deploy the web server
        const server = app.listen(this.port, '0.0.0.0', this.listen.bind(this));

        // Await for SIGINT
        await new Promise<void>(resolve => this.onSIGINT(server, resolve));
    }

    onError(err: any, _: any, res: Response): void {
        res.json({
            status: err?.status,
            message: err?.message ?? 'unknown exception'
        });
    }

    onSIGINT(server: Server, resolve: () => void): void {
        process.on('SIGINT', () => {
            server.close();
            console.log();
            npmlog.info('server', 'Closing server instance...');
            resolve();
        });
    }

    listen(): void {
        npmlog.info('server', `Web Server is ready in port ${this.port}.-`);
    }
}