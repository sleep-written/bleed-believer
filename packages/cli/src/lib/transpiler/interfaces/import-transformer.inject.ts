export interface ImportTransformerInject {
    process?: {
        cwd(): string;
    }

    access?(path: string): void;
}