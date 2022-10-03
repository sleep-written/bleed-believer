import type { SizeSuffix } from './size-suffix.js';

export interface Size {
    value: number;
    suffix?: SizeSuffix;
}