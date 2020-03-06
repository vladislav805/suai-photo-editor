import * as React from 'react';
import Range from '../Range';
import { IToolWindowChildProps } from '.';

export type IPaintToolWindowProps = IToolWindowChildProps & {

}

export interface IPaintToolWindowState {
    size: number;
    color: string;
}

export default class PaintToolWindow extends React.Component<IPaintToolWindowProps, IPaintToolWindowState> {
    state: IPaintToolWindowState = {
        size: 3,
        color: '#ff0000',
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
        const color = event.target.value;
        this.setState({ color });
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private onChangeSize = (size: number) => {
        this.setState({ size });
    };

    render() {
        return (
            <div className="paint">
                <label className="paint-color">
                    <input type="color" onChange={this.onChangeColor} value={this.state.color} />
                </label>
                <Range min={1} step={1} max={100} value={this.state.size} onChange={this.onChangeSize} />
            </div>
        );
    }
}