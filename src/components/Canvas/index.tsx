import * as React from 'react';
import './Canvas.scss';
import { StatusController } from '../StatusBar';
import Connector from '../../utils/connector';
import { saveAs } from 'file-saver';

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

    private connector: Connector;

    private image: HTMLImageElement;
    private wrap: HTMLDivElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(props: ICanvasProps) {
        super(props);

        this.connector = Connector.getInstance();

        this.connector.on('save', this.onSave);
    }

    private setWrap = (node: HTMLDivElement) => this.wrap = node;
    private setCanvas = (node: HTMLCanvasElement) => this.canvas = node;

    componentDidMount() {
        if (!this.canvas) {
            return;
        }

        Connector.getInstance().on('zoom', this.connectorZoomEventListener);

        window.addEventListener('resize', this.resetScale);
    }

    componentWillUnmount() {
        Connector.getInstance().remove('zoom', this.connectorZoomEventListener);

        window.removeEventListener('resize', this.resetScale);
    }

    private connectorZoomEventListener = ({ delta }: { delta: number}) => {
        if (delta !== 0) {
            this.setScale(this.state.scale + delta * .03);
        } else {
            this.resetScale();
        }
    };

    // from file https://gist.github.com/felixzapata/3684117
    private loadImage = () => {
        this.canvas.width = this.image.naturalWidth;
        this.canvas.height = this.image.naturalHeight;

        this.ctx = this.canvas.getContext('2d');

        this.ctx.drawImage(this.image, 0, 0);
        this.resetScale();
    };

    private getDefaultScale = () => {
        const { offsetWidth, offsetHeight } = this.wrap;
        const { width, height } = this.canvas;

        let scale = 1;

        if (offsetHeight >= height && offsetWidth >= width) {
            scale = 1;
        } else {
            if (width < height) {
                scale = offsetHeight / height * .95;
            } else {
                scale = offsetWidth / width * .95;
            }
        }

        return scale;
    };

    private resetScale = () => {
        this.setScale(this.getDefaultScale());
    };

    private setScale = (scale: number) => {
        scale = Math.max(scale, .01);
        this.setState({ scale });

        StatusController.getInstance().temporary(`Scale: ${~~(scale * 100)}%`);
    };

    private onWheel = (event: React.WheelEvent) => {
        if (event.ctrlKey) {
            event.preventDefault();

            this.setScale(this.state.scale - event.deltaY * .01);
        }

        if (event.shiftKey) {
            event.preventDefault();

            this.wrap.scrollBy(event.deltaY > 0 ? 15 : -15, 0);
        }
    };

    private onSave = ({ name }: { name: string }) => {
        this.canvas.toBlob(blob => saveAs(blob, name));
    };

    render() {
        if (this.image !== this.props.image) {
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
                    width={0}
                    height={0}
                    ref={this.setCanvas} />
            </div>
        );
    }
}
