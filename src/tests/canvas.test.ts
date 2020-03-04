import * as jest from 'jest';
import { createCanvas, copyCanvas, copyAndResizeCanvas } from '../utils/canvas';

describe('Canvas', () => {
    it('should create canvas and return it and context', () => {
        const { canvas, context } = createCanvas();
        expect(canvas).not.toBeNull();
        expect(context).not.toBeNull();
    });

    it('should copy canvas', async() => {
        const { canvas, context } = createCanvas();

        context.strokeStyle = 'black';
        context.moveTo(0, 0)
        context.lineTo(10, 10);
        context.stroke();

        const { canvas: copy } = await copyCanvas(canvas);

        expect(canvas.toDataURL('image/png')).toEqual(copy.toDataURL('image/png'));
    });

    it('should resize canvas', async() => {
        const { canvas, } = createCanvas({ width: 200, height: 400 });

        const size = { width: 70, height: 80 };

        const { canvas: result} = await copyAndResizeCanvas(canvas, size);

        expect(result.width).toEqual(size.width);
        expect(result.height).toEqual(size.height);
    });
});
