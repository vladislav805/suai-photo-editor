import { getDataUriByCanvas } from "./canvas";

type Img = HTMLImageElement;

export const makeImage = async(uri: string): Promise<Img> => new Promise<Img>(resolve => {
    const image = new Image();
    image.src = uri;
    image.onload = () => resolve(image);
});

export const makeImageFromCanvas = async(canvas: HTMLCanvasElement): Promise<Img> => getDataUriByCanvas(canvas, 'image/png').then(uri => makeImage(uri));
