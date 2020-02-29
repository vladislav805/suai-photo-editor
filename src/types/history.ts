export enum HistoryType {
    OPEN,
    APPLY_FILTER,
    CROP,
    SET_BRIGHTNESS,
    SET_CONTRAST,
}

export type IHistoryEntryData = Record<string, string | number>;

export interface IHistoryEntry {
    id: number;
    type: HistoryType;
    data?: IHistoryEntryData;
}
