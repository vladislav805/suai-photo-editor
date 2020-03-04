export enum HistoryType {
    OPEN,
    CROP,
    ROTATE,
    BRIGHTNESS,
    CONTRAST,
    BLUR,
    GRAYSCALE,
    HUE_ROTATE,
    INVERT,
    SATURATE,
    SEPIA,
    FILTER
}

export type IHistoryEntryData = Record<string, string | number | boolean>;

export interface IHistoryEntry {
    id: number;
    type: HistoryType;
    data?: IHistoryEntryData;
    image: HTMLImageElement;
    uri: string;
}
