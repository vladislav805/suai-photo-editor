import * as React from 'react';
import { IToolWindowChildProps } from '.';
import Range from '../Range';
import { makeImageFromCanvas } from '../../utils/image';

interface IRangeToolWindowState {
    value: number;
}

export type IRangeToolWindowProps = IToolWindowChildProps;

export type IRangeValues = {
    min: number;
    max: number;
    step: number;
    defaultValue: number;
}

export default abstract class RangeToolWindow extends React.Component<IRangeToolWindowProps, IRangeToolWindowState> {
    protected ranges: IRangeValues = null;

    state: IRangeToolWindowState = {
        value: 1
    };

    constructor(props: IRangeToolWindowProps) {
        super(props);

        // this.state = { value: this.ranges.defaultValue };
    }

    componentDidMount() {
        this.ranges = this.getRanges();
        this.setState({
            value: this.ranges.defaultValue
        });
    }

    componentWillUnmount() {
        this.resetPreview();
    }

    componentDidUpdate(prevProps: IToolWindowChildProps) {
        if (!prevProps.save && this.props.save) {
            this.props.onApplyTool((image, { canvas, context }) => {
                context.filter = this.getFilterString();
                context.drawImage(image, 0, 0);

                const result = makeImageFromCanvas(canvas);
                this.resetPreview();
                return result;
            });
        }
    }

    protected abstract getRanges: () => IRangeValues;
    protected abstract getFilterName: () => string;

    protected getFilterString = (value = this.state.value) => `${this.getFilterName()}(${value})`;

    private onChange = (value: number) => {
        this.setState({ value }, () => {
            this.props.onPreviewWillChange(image => {
                image.style.filter = this.getFilterString();
            });
        });
    };

    private resetPreview = () => {
        this.props.onPreviewWillReset(image => {
            image.style.filter = this.getFilterString(this.ranges.defaultValue);
        });
    };

    render() {
        const { min, max, step } = this.ranges || {};
        return (
            <Range
                min={min}
                max={max}
                step={step}
                value={this?.state?.value}
                onChange={this.onChange} />
        );
    }
}
