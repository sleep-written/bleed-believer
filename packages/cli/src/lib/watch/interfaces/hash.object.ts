export interface HashObject {
    update(byte: Buffer): HashObject;
    digest(encoding: 'hex'): string;
}