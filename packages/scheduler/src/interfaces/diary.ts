import type { DiaryItem } from './diary-item.js';

export interface Diary {
    [K: string]: DiaryItem[];    
}