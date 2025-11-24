export interface DirentObject {
    name: string;
    parentPath: string;
    isFile(): boolean;
}