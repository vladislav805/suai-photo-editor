import * as React from 'react';
import './App.scss';
import Panel from '../Panel';
import Canvas from '../Canvas';
import StatusBar, { StatusController } from '../StatusBar';
import AsideBlock from '../AsideBlock';
import History from '../History';
import Range from '../Range';
import { IHistoryEntry, HistoryType } from '../../types/history';
import { mdiCursorDefaultOutline, mdiFolderOpenOutline, mdiContentSave, mdiBrightness4, mdiContrastBox, mdiImageFilterVintage, mdiRedo, mdiUndo, mdiMagnifyMinusOutline, mdiMagnifyPlusOutline, mdiSquareOutline, mdiFormatRotate90, mdiRelativeScale, mdiBlur, mdiInvertColors, mdiPaletteOutline, mdiAlphaS, mdiInvertColorsOff, mdiImageFilterTiltShift, mdiCrop, mdiLeadPencil } from '@mdi/js';
import { Tool } from '../../types/tools';
import { readFile, openChoosePhotoDialog } from '../../utils/files';
import { createCanvasWithImage, saveCanvas } from '../../utils/canvas';
import { ImageSize } from '../../types/image';
import Connector from '../../utils/connector';
import ToolWindow, { OnPreviewWillChange, OnPreviewWillReset, CallbackWithImageCanvas, OnApplyTool } from '../ToolWindow';
import { makeImage } from '../../utils/image';

interface IAppState {
    // File
    file?: File;

    // Image
    image?: HTMLImageElement;

    // Image size
    imageSize?: ImageSize;

    scale?: number;

    // Current history state
    historyIndex: number;

    // History
    history: IHistoryEntry[];

    // Active tool
    activeTool: Tool;
}

// const THUMBNAIL_SIZE = 200;
const SCALE_MIN = .25;
const SCALE_MAX = 2.5;
const SCALE_STEP = .01;

export default class App extends React.Component<{}, IAppState> {
    state: IAppState = {
        scale: 1,
        historyIndex: 0,
        history: [],
        activeTool: Tool.NONE
    };

    constructor(props: {}) {
        super(props);
    }

    componentDidUpdate(_prevProps: {}, prevState: IAppState) {
        if (this.state.scale !== prevState.scale) {
            StatusController.getInstance().temporary(`Scale to ${~~(this.state.scale * 100)}%`)
        }
    }

    /**
     * Open dialog for choose file
     */
    private open = async() => {
        const file = await openChoosePhotoDialog()
        const image = new Image();

        if (!file.type.includes('image')) {
            alert('Not a image');
            return;
        }

        image.src = await readFile(file);
        image.onload = () => this.renderImage();

        this.setState({ file, image });
        this.resetHistory();
    };

    /**
     * Reset history
     */
    private resetHistory = () => this.setState({ history: [], historyIndex: 0 });

    /**
     * Open image and render some canvases
     */
    private renderImage = async() => {
        const { naturalWidth, naturalHeight, src } = this.state.image;

        this.setState({
            history: [
                ...this.state.history,
                {
                    id: 0,
                    type: HistoryType.OPEN,
                    uri: src,
                    image: await makeImage(src)
                }],
            imageSize: {
                width: naturalWidth,
                height: naturalHeight
            }
        });
    };

    private onPreviewReady = (image: HTMLImageElement) => {
        this.setState(state => {
            const history = [...state.history];
            history[state.historyIndex].image = image;
            return { history, image };
        });
    };

    private save = async() => {
        const uri = this.state.history[this.state.historyIndex].uri;
        const { canvas } = await createCanvasWithImage(uri);

        const name = this.state.file.name;
        const lastDot = name.lastIndexOf('.');

        // TODO type and quality
        saveCanvas(canvas, name.substring(0, lastDot), 'image/jpeg');
    };

    private setDeltaScale = (delta: number) => this.setScale(this.state.scale + delta * .03);
    private setScale = (scale: number) => {
        scale = Math.min(Math.max(scale, SCALE_MIN), SCALE_MAX);
        this.setState({ scale });
    };
    private scaleIn = () => this.setDeltaScale(1);
    private scaleOut = () => this.setDeltaScale(-1);
    private scaleReset = () => this.setScale(1);
    private scaleFit = () => {
        Connector.getInstance().fire('zoom', { fit: true });
    };

    private onEntryClick = (id: number) => this.setState({ historyIndex: id });
    private onUndo = () => this.onEntryClick(this.state.historyIndex - 1);
    private onRedo = () => this.onEntryClick(this.state.historyIndex + 1);

    private setTool = (activeTool: number) => this.setState({ activeTool });

    private createCallback = async function<T>(callback: CallbackWithImageCanvas<T>, sourceImage = this.state.image): Promise<T> {
        return callback(sourceImage, await createCanvasWithImage(this.state.image.src)) as Promise<T>;
    }

    private onPreviewWillChange: OnPreviewWillChange = (callback: CallbackWithImageCanvas<void>) => this.createCallback(callback);

    private onPreviewWillReset: OnPreviewWillReset = (callback: CallbackWithImageCanvas<void>) => this.createCallback(callback)

    private onApplyTool: OnApplyTool = async(callback: CallbackWithImageCanvas<HTMLImageElement>) => {
        console.log('app.on_apply_tool')
        const image = await this.createCallback<HTMLImageElement>(callback, this.state.history[this.state.historyIndex].image);
        const history = [...this.state.history];
        history.length = this.state.historyIndex + 1;
        history.push({ id: history.length, type: +this.state.activeTool, uri: image.src, image });

        this.setState({
            history,
            historyIndex: history.length - 1,
            activeTool: Tool.NONE,
        });
    };

    render() {
        const disabled = !this.state.image;
        return (
            <div className="app">
                <Panel
                    name="file"
                    type="horizontal"
                    items={[
                        { label: 'Open', icon: mdiFolderOpenOutline, onClick: this.open },
                        { label: 'Save', icon: mdiContentSave, onClick: this.save, disabled },
                    ]} />
                <Panel
                    name="tools"
                    type="vertical"
                    active={this.state.activeTool}
                    items={[
                        { icon: mdiCursorDefaultOutline, label: 'None', onClick: this.setTool, disabled, tag: Tool.NONE },
                        { icon: mdiBrightness4, label: 'Brightness', onClick: this.setTool, disabled, tag: Tool.BRIGHTNESS },
                        { icon: mdiContrastBox, label: 'Contrast', onClick: this.setTool, disabled, tag: Tool.CONTRAST },
                        { icon: mdiBlur, label: 'Blur', onClick: this.setTool, disabled, tag: Tool.BLUR },
                        { icon: mdiInvertColorsOff, label: 'Grayscale', onClick: this.setTool, disabled, tag: Tool.GRAYSCALE },
                        { icon: mdiImageFilterTiltShift, label: 'Hue rotate', onClick: this.setTool, disabled, tag: Tool.HUE_ROTATE },
                        { icon: mdiInvertColors, label: 'Invert', onClick: this.setTool, disabled, tag: Tool.INVERT  },
                        { icon: mdiPaletteOutline, label: 'Saturate', onClick: this.setTool, disabled, tag: Tool.SATURATE  },
                        { icon: mdiAlphaS, label: 'Sepia', onClick: this.setTool, disabled, tag: Tool.SEPIA },
                        { icon: mdiCrop, label: 'Crop', onClick: this.setTool, disabled, tag: Tool.CROP },
                        { icon: mdiLeadPencil, label: 'Paint', onClick: this.setTool, disabled, tag: Tool.PAINT },
                        { icon: mdiFormatRotate90, label: 'Rotate to 90 deg', onClick: this.setTool, disabled, tag: Tool.ROTATE },
                        { icon: mdiImageFilterVintage, label: 'Filters', onClick: this.setTool, disabled, tag: Tool.FILTER },
                    ]} />
                <Panel
                    name="status"
                    type="horizontal"
                    items={[
                        <StatusBar key="status" />,
                    ]} />
                <div className="panel--aside">
                    <AsideBlock
                        title="Navigation">
                        <Panel
                            name="history"
                            type="horizontal"
                            items={[
                                { label: 'Zoom out', icon: mdiMagnifyMinusOutline, onClick: this.scaleOut, disabled },
                                { label: 'Reset', icon: mdiSquareOutline, onClick: this.scaleReset, disabled },
                                { label: 'Fit', icon: mdiRelativeScale, onClick: this.scaleFit, disabled },
                                { label: 'Zoom in', icon: mdiMagnifyPlusOutline, onClick: this.scaleIn, disabled },
                                { text: `${~~(this.state.scale * 100)}%`}
                            ]}
                        />
                        <Range
                            className="scale-range"
                            min={SCALE_MIN}
                            max={SCALE_MAX}
                            step={SCALE_STEP}
                            value={this.state.scale}
                            onChange={this.setScale} />
                    </AsideBlock>
                    <ToolWindow
                        tool={this.state.activeTool}
                        onPreviewWillChange={this.onPreviewWillChange}
                        onPreviewWillReset={this.onPreviewWillReset}
                        onApplyTool={this.onApplyTool} />
                    <AsideBlock
                        title="History">
                        <Panel
                            name="history"
                            type="horizontal"
                            items={[
                                { label: 'Undo', icon: mdiUndo, onClick: this.onUndo, disabled: this.state.historyIndex - 1 < 0 },
                                { label: 'Redo', icon: mdiRedo, onClick: this.onRedo, disabled: this.state.historyIndex + 1 >= this.state.history.length },
                            ]}
                        />
                        <History
                            entries={this.state.history}
                            current={this.state.historyIndex}
                            onEntryClick={this.onEntryClick} />
                    </AsideBlock>
                </div>
                {this.state.history.length ? (
                    <Canvas
                        imageUri={this.state.history[this.state.historyIndex].uri}
                        imageSize={this.state.imageSize}
                        scale={this.state.scale}
                        onChangeScale={this.setScale}
                        onPreviewReady={this.onPreviewReady} />
                ) : <div className="panel--image" />}
            </div>
        );
    }
}
