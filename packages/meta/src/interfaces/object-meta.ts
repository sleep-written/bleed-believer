import { Meta } from './meta';

export interface ObjectMeta {
    __meta__?: Record<symbol, Meta>;
}
