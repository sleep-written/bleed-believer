export interface Args {
    main: string[];
    find(name: string): string[] | null;
}