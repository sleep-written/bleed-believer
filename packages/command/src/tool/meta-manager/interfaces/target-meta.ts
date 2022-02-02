import { Metadata } from './metadata';

export interface TargetMeta {
    __meta__?: Record<symbol, Metadata>;
}
