import RangeToolWindow, { IRangeValues } from './RangeToolWindow';

const fuzzyRange: IRangeValues = {
    min: 0,
    max: 1,
    step: .01,
    defaultValue: 0,
};

const doubleFuzzyRange: IRangeValues = {
    ...fuzzyRange,
    max: 2,
    defaultValue: 1,
};

export class BrightnessToolWindow extends RangeToolWindow {
    protected getRanges = () => doubleFuzzyRange;
    protected getFilterName = () => 'brightness';
}

export class ContrastToolWindow extends RangeToolWindow {
    protected getRanges = () => doubleFuzzyRange;
    protected getFilterName = () => 'contrast';
}

export class BlurToolWindow extends RangeToolWindow {
    protected getRanges = () => ({
        min: 0,
        max: 50,
        step: 1,
        defaultValue: 0,
    });

    protected getFilterName = () => '';
    protected getFilterString = () => `blur(${this.state.value}px)`;
}

export class GrayscaleToolWindow extends RangeToolWindow {
    protected getRanges = () => fuzzyRange;
    protected getFilterName = () => 'grayscale';
}

export class HueRotateToolWindow extends RangeToolWindow {
    protected getRanges = () => ({
        min: 0,
        max: 360,
        step: 1,
        defaultValue: 0,
    });
    protected getFilterName = () => '';
    protected getFilterString = () => `hue-rotate(${this.state.value}deg)`;
}

export class InvertToolWindow extends RangeToolWindow {
    protected getRanges = () => fuzzyRange;
    protected getFilterName = () => 'invert';
}

export class SaturateToolWindow extends RangeToolWindow {
    protected getRanges = () => doubleFuzzyRange;
    protected getFilterName = () => 'saturate';
}

export class SepiaToolWindow extends RangeToolWindow {
    protected getRanges = () => fuzzyRange;
    protected getFilterName = () => 'sepia';
}
