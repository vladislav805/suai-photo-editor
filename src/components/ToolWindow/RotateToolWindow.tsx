import * as React from 'react';
import { IToolWindowChildProps } from '.';
import Range from '../Range';
import { makeImageFromCanvas } from '../../utils/image';

type IRotateToolWindowProps = IToolWindowChildProps;

enum RotateDegree {
    DEG_0 = 0,
    DEG_90 = 1,
    DEG_180 = 2,
    DEG_270 = 3,
}
interface IRotateToolWindowState {
    deg: RotateDegree;
}

export default class RotateToolWindow extends React.Component<IRotateToolWindowProps, IRotateToolWindowState> {
    state = {
        deg: RotateDegree.DEG_0
    };

    componentWillUnmount() {
        this.resetPreview();
    }

    componentDidUpdate(prevProps: IToolWindowChildProps) {
        if (!prevProps.save && this.props.save) {
            this.props.onApplyTool((image, { canvas }) => {
                const isChangedOrientation = this.state.deg === RotateDegree.DEG_90 || this.state.deg === RotateDegree.DEG_270;

                if (isChangedOrientation) {
                    const tmp = canvas.width;
                    canvas.width = canvas.height;
                    canvas.height = tmp;
                }

                const context = canvas.getContext('2d');

                let x = 0;
                let y = 0;

                switch (this.state.deg) {
                    case RotateDegree.DEG_90: { y = -canvas.width; break; }
                    case RotateDegree.DEG_180: { x = -canvas.width; y = -canvas.height; break; }
                    case RotateDegree.DEG_270: { x = -canvas.height; break; }
                }

                context.save();
                context.rotate(Math.PI / 180 * this.state.deg * 90);
                context.translate(x, y);
                context.drawImage(image, 0, 0);
                context.restore();

                const res = makeImageFromCanvas(canvas);
                this.resetPreview();
                return res;
            });
        }
    }

    private resetPreview = () => this.props.onPreviewWillReset(image => {
        image.style.transform = '';
    });

    private onChange = (deg: number) => this.setState({ deg }, () => {
        this.props.onPreviewWillChange(image => {
            image.style.transform = `rotate(${deg * 90}deg)`;
        });
    });

    render() {
        return (
            <Range
                min={0}
                max={3}
                step={1}
                value={this.state.deg}
                onChange={this.onChange} />
        );
    }
}
