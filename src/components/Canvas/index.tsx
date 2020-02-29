import * as React from 'react';
import './Canvas.scss';
import { StatusController } from '../StatusBar';

export interface ICanvasProps {
    image?: HTMLImageElement;
}

export interface ICanvasState {
    scale: number;
}

const CANVAS_SCALE_NOT_DEFINED = -1;

export default class Canvas extends React.Component<ICanvasProps, ICanvasState> {
    state: ICanvasState = {
        scale: CANVAS_SCALE_NOT_DEFINED,
    };

    private image: HTMLImageElement;
    private wrap: HTMLDivElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private setWrap = (node: HTMLDivElement) => this.wrap = node;
    private setCanvas = (node: HTMLCanvasElement) => this.canvas = node;

    componentDidMount() {
        if (!this.canvas) {
            return;
        }

        window.addEventListener('resize', this.rescale);
    }

    // from file https://gist.github.com/felixzapata/3684117
    private loadImage = () => {
        this.canvas.width = this.image.naturalWidth;
        this.canvas.height = this.image.naturalHeight;

        this.ctx = this.canvas.getContext('2d');

        this.ctx.drawImage(this.image, 0, 0);
        this.rescale();
    };

    private rescale = () => {
        if (this.state.scale === CANVAS_SCALE_NOT_DEFINED) {
            const { offsetWidth, offsetHeight } = this.wrap;
            const { width, height } = this.canvas;

            let scale = 1;

            if (width < height) {
                scale = offsetHeight / height * .95;
            } else {
                scale = offsetWidth / width * .95;
            }

            this.setState({ scale });
        }
    };

    private onWheel = (event: React.WheelEvent) => {
        if (event.ctrlKey) {
            event.preventDefault();

            const direction = event.deltaY;
            const scale = Math.max(this.state.scale - direction * .01, .01);

            this.setState({ scale });

            StatusController.getInstance().temporary(`Scale: ${~~(scale * 100)}%`);
        }
    };

    render() {
        if (!this.image && this.props.image) {
            this.image = this.props.image;
            setTimeout(this.loadImage, 200);
        }

        return (
            <div
                onWheel={this.onWheel}
                className="panel--image"
                ref={this.setWrap}>
                <canvas
                    className="canvas"
                    style={this.canvas && {
                        width: this.canvas.width * this.state.scale,
                        height: this.canvas.height * this.state.scale,
                    }}
                    ref={this.setCanvas} />
            </div>
        );
    }
}
