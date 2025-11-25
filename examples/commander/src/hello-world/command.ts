import { Command, Executable } from '@bleed-believer/commander';

@Command({
    name: 'hello-world',
    path: 'hello-world',
    info: 'A simple command for demo purpose.'
})
export class HelloWorldCommand implements Executable {
    async start(): Promise<void> {
        console.log('Hello World :)');
    }
}