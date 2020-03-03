import * as React from 'react';
import './Range.scss';

export interface IRangeProps {
    value: number;
    onChange?: (value: number) => void;
    min?: number;
    step?: number;
    max?: number;
    className?: string;
}

export default class Range extends React.Component<IRangeProps> {
    private onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange && this.props.onChange(+event.target.value);
    };

    render() {
        return (
            <div className={`range ${this.props.className || ''}`}>
                <input
                    className={`range-ruler`}
                    type="range"
                    min={this.props.min || 0}
                    max={this.props.max || 1}
                    step={this.props.step || 0.1}
                    value={this.props.value}
                    onChange={this.onChangeValue} />
            </div>
        );
    }
}
