import { ImageFilterBundle } from './filters';
import { createCanvas } from './canvas';

const inRange = (val: number, min: number, max: number): boolean => val >= min && val < max;

export default (image: ImageFilterBundle, weights: number[]) => {
    const pixels = image.data;

    const side = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);
    const src = pixels.data;
    const { context: temporaryCtx } = createCanvas(pixels);
    const outputData = temporaryCtx.createImageData(pixels.width, pixels.height);

    for (let y = 0; y < pixels.height; y++) {
        for (let x = 0; x < pixels.width; x++) {
            const dstOff = (y * pixels.width + x) * 4;
            let sumReds = 0;
            let sumGreens = 0;
            let sumBlues = 0;

            for (let kernelY = 0; kernelY < side; ++kernelY) {
                for (let kernelX = 0; kernelX < side; ++kernelX) {
                    const currentKernelY = y + kernelY - halfSide;
                    const currentKernelX = x + kernelX - halfSide;

                    if (inRange(currentKernelY, 0, pixels.height) && inRange(currentKernelX, 0, pixels.width)) {
                        const offset = (currentKernelY * pixels.width + currentKernelX) * 4;
                        const weight = weights[kernelY * side + kernelX];

                        sumReds += src[offset] * weight
                        sumGreens += src[offset + 1] * weight
                        sumBlues += src[offset + 2] * weight
                    }
                }
            }

            outputData.data[dstOff] = sumReds;
            outputData.data[dstOff + 1] = sumGreens;
            outputData.data[dstOff + 2] = sumBlues;
            outputData.data[dstOff + 3] = 255;
        }
    }
    image.data = outputData;
    return image;
}
