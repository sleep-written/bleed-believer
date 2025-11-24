export interface DirentObject {
    isFile(): boolean;
    name: string;
    parentPath: string;
}