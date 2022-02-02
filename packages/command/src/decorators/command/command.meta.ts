import { Metadata } from '../../tool/meta-manager';

export interface CommandMeta extends Metadata {
    main: string[];
    name: string;
    info: string;
}
