import { ImageSize } from './image';

export enum HistoryType {
    OPEN,
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
    dimens: ImageSize;
}
