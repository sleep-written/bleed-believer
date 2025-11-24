export interface TranspilerInject {
    logger?: {
        info(...args: any[]): void;
        error(...args: any[]): void;
    };

    process?: {
        once(
            name: 'SIGINT',
            callback: () => void
        ): void;
    }

    chalk?: {
        blue: (...args: any[]) => string;
        greenBright: (...args: any[]) => string;
    }

    rm(
        path: string,
        options: {
            force: true
        }
    ): Promise<void>;
}