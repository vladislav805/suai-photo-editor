import { ImageSize, ImageType } from '../types/image';
import { saveAs } from 'file-saver';
import { makeImage } from './image';

export type CanvasWithContext = {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
};

export const createCanvas = (size?: ImageSize): CanvasWithContext => {
    const canvas = document.createElement('canvas');

    if (size) {
        canvas.width = size.width;
        canvas.height = size.height;
    }

    const context = canvas.getContext('2d');

    return { canvas, context };
};

export const createCanvasWithImage = async(imageUri: string): Promise<CanvasWithContext> => makeImage(imageUri).then((image) => {
    const { canvas, context } = createCanvas({ width: image.naturalWidth, height: image.naturalHeight });

    context.drawImage(image, 0, 0);

    return { canvas, context }
});

export const copyCanvas = async(source: HTMLCanvasElement): Promise<CanvasWithContext> => new Promise<CanvasWithContext>(resolve => {
    const { width, height } = source;
    const { canvas, context } = createCanvas({ width, height });

    context.drawImage(source, 0, 0);

    resolve({ canvas, context });
});

export const copyAndResizeCanvas = async(source: HTMLCanvasElement, { width, height }: ImageSize): Promise<CanvasWithContext> => new Promise<CanvasWithContext>(resolve => {
    const { canvas, context } = createCanvas({ width, height });

    context.drawImage(source, 0, 0, source.width, source.height, 0, 0, width, height);

    resolve({ canvas, context });
});

export const saveCanvas = async(canvas: HTMLCanvasElement, filename: string, type: ImageType = 'image/jpeg', quality = 90) => new Promise<void>(resolve => canvas.toBlob(blob => resolve(saveAs(blob, filename)), type, quality));

export const getDataUriByCanvas = async(canvas: HTMLCanvasElement, type: ImageType = 'image/jpeg', quality = 90): Promise<string> => new Promise<string>(resolve => resolve(canvas.toDataURL(type, quality)));
