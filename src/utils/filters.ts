import { createCanvasWithImage } from "./canvas";
import { makeImageFromCanvas } from "./image";
import convolution from "./convolution";

export type FilterFx = (thumb: HTMLImageElement) => Promise<string>;
export type ImageFilterBundle = {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    data: ImageData;
}

export type IFilter = {
    id: number;
    title: string;
    applyFilter: FilterFx;
};

const getImageData = async(thumb: HTMLImageElement): Promise<ImageFilterBundle> => {
    const { canvas, context } = await createCanvasWithImage(thumb.src);
    const data = context.getImageData(0, 0, canvas.width, canvas.height);
    return { canvas, context, data };
};

const makeImage = async({ canvas, context, data }: ImageFilterBundle): Promise<HTMLImageElement> => {
    canvas.width = data.width;
    canvas.height = data.height;

    context.putImageData(data, 0, 0);

    return await makeImageFromCanvas(canvas);
};

type FilterCreator = (processing: (thumb: ImageFilterBundle) => ImageFilterBundle) => FilterFx;

const createFilter: FilterCreator = (processing) => {
    return (thumb: HTMLImageElement) => {
        return getImageData(thumb).then(processing).then(makeImage).then(image => image.src);
    };
}

const red: FilterFx = createFilter((bundle) => {
    const { data: { data } } = bundle;

    for (let i = 0; i < data.length; i += 4) {
        data[i + 1] = 0;
        data[i + 2] = 0;
    }

    return bundle;
});

const blue: FilterFx = createFilter((bundle) => {
    const { data: { data } } = bundle;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 0;
        data[i + 1] = 0;
    }

    return bundle;
});

const green: FilterFx = createFilter((bundle) => {
    const { data: { data } } = bundle;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 0;
        data[i + 2] = 0;
    }

    return bundle;
});

const grayscale: FilterFx = createFilter((bundle) => {
    const { data: { data } } = bundle;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = data[i + 1] = data[i + 2] = .2126 * r + .7152 * g + .0722 * b;
    }

    return bundle;
});

const invert: FilterFx = createFilter(bundle => {
    const { data: { data } } = bundle;

    for (let i = 0; i < data.length; i += 4) {
        for (let j = 0; j < 3; ++j) {
            data[i + j] = 255 - data[i + j];
        }
    }

    return bundle;
});

const mirror: FilterFx = createFilter(bundle => {
    const { data } = bundle;
    const { width, height, data: pixels } = data;
    const tmp = [];

    for (let h = 0; h < height; h++) {
        const offset = h * width * 4;
        const middle = width * 4 / 2;

        for (let w = 0; w < middle; w++) {
            const pos = w * 4;
            const pixel = pos + offset;
            const lastPixel = width - pos - 4 + offset;

            tmp[0] = pixels[pixel];
            tmp[1] = pixels[pixel + 1];
            tmp[2] = pixels[pixel + 2];
            tmp[3] = pixels[pixel + 3];

            pixels[pixel] = pixels[lastPixel];
            pixels[pixel + 1] = pixels[lastPixel + 1];
            pixels[pixel + 2] = pixels[lastPixel + 2];
            pixels[pixel + 3] = pixels[lastPixel + 3];

            pixels[lastPixel] = tmp[0];
            pixels[lastPixel + 1] = tmp[1];
            pixels[lastPixel + 2] = tmp[2];
            pixels[lastPixel + 3] = tmp[3];
        }
    }

    return bundle;
});

const sharpen: FilterFx = createFilter(bundle => convolution(bundle, [
    0, -.2,  0,
  -.2, 1.8, -0.2,
    0, -.2,  0,
]));

const thresholding: FilterFx = createFilter(bundle => {
    const { data: { data } } = bundle;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const v = .2126 * r + .7152 * g + .0722 * b;
        const threshold = 128;

        data[i] = data[i + 1] = data[i + 2] = v > threshold ? 255 : 0;
    }

    return bundle;
});

const highpass: FilterFx = createFilter(bundle => convolution(bundle, [
    -1, -1, -1,
    -1,  8, -1,
    -1, -1, -1,
]));

const saturation: FilterFx = createFilter(bundle => {
    const { data: { data } } = bundle;

    const level = 2.9;
    const RW = .3086;
    const RG = .6084;
    const RB = .0820;

    const R = [
        [ (1 - level) * RW + level, (1 - level) * RW,         (1 - level) * RW ], // R
        [ (1 - level) * RG,         (1 - level) * RG + level, (1 - level) * RG ], // G
        [ (1 - level) * RB,         (1 - level) * RB,         (1 - level) * RB + level ] // B
    ];

    for (let i = 0; i < R.length; ++i) {
        R[i][i] += level;
    }

    for (let i = 0; i < data.length; i += 4) {
        for (let j = 0; j < R.length; ++j) {
            data[i + j] = R[0][j] * data[i] + R[1][j] * data[i + j] + R[2][j] * data[i + j];
        }
    }

    return bundle;
});

export default [
    { id: 0, title: 'Red', applyFilter: red },
    { id: 1, title: 'Green', applyFilter: green },
    { id: 2, title: 'Blue', applyFilter: blue },
    { id: 3, title: 'Grayscale', applyFilter: grayscale },
    { id: 4, title: 'Invert', applyFilter: invert },
    { id: 5, title: 'Mirror', applyFilter: mirror },
    { id: 6, title: 'Sharpen', applyFilter: sharpen },
    { id: 7, title: 'Thresholding BW', applyFilter: thresholding },
    { id: 8, title: 'Highpass', applyFilter: highpass },
    { id: 9, title: 'Saturation', applyFilter: saturation },
] as IFilter[];
