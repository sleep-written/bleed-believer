import type { DirentObject } from './dirent.object.js'

export interface TSConfigObject {
    getSourceCode(): AsyncGenerator<DirentObject>;
}