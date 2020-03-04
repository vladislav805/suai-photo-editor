import * as React from 'react';
import './Canvas.scss';
import { ImageSize } from '../../types/image';
import Connector from '../../utils/connector';

export interface ICanvasProps {
    // Image URI
    imageUri?: string;

    // Image size
    imageSize?: ImageSize;

    // Scale of preivew
    scale?: number;

    // Callback when scale changed
    onChangeScale?: (scale: number) => void;
}

export interface ICanvasState {}

export default class Canvas extends React.Component<ICanvasProps, ICanvasState> {
    state: ICanvasState = {};

    private wrap: HTMLDivElement;
    private image: HTMLImageElement;

    constructor(props: ICanvasProps) {
        super(props);
    }

    componentDidMount() {
        Connector.getInstance().on('zoom', this.connectorZoomFit);
    }

    componentWillUnmount() {
        Connector.getInstance().remove('zoom', this.connectorZoomFit);
    }

    private connectorZoomFit = (args: Record<string, string | boolean | number>) => {
        if (args.fit) {
            this.props.onChangeScale?.(this.getDefaultScale());
        }
    };

    private setWrap = (node: HTMLDivElement) => this.wrap = node;
    private setImage = (node: HTMLImageElement) => this.image = node;

    private getDefaultScale = () => {
        const { offsetWidth: wW, offsetHeight: wH } = this.wrap;
        const { naturalWidth: iW, naturalHeight: iH } = this.image;

        let scale = 1;

        if (wH >= iH && wW >= iW) {
            scale = 1;
        } else {
            if (iW < iH) {
                scale = wH / iH * .95;
            } else {
                scale = wW / iW * .95;
            }
        }

        return scale;
    };

    private onWheel = (event: React.WheelEvent) => {
        if (event.ctrlKey) {
            event.preventDefault();

            this.props.onChangeScale?.(this.props.scale - event.deltaY * .01);
        }

        if (event.shiftKey) {
            event.preventDefault();

            this.wrap.scrollBy(Math.sign(event.deltaY) * 15, 0);
        }
    };

    render() {
        const { imageUri, imageSize, scale } = this.props;
        const { width, height } = imageSize;

        return (
            <div
                onWheel={this.onWheel}
                className="panel--image"
                ref={this.setWrap}>
                <img
                    src={imageUri}
                    alt="Preview"
                    className="canvas"
                    ref={this.setImage}
                    style={{
                        width: width * scale,
                        height: height * scale,
                    }} />
            </div>
        );
    }
}
