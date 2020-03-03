import * as React from 'react';
import './App.scss';
import Panel from '../Panel';
import Canvas from '../Canvas';
import StatusBar from '../StatusBar';
import AsideBlock from '../AsideBlock';
import History from '../History';
import { IHistoryEntry, HistoryType } from '../../types/history';
import { mdiFolderOpenOutline, mdiContentSave, mdiBrightness4, mdiContrastBox, mdiImageFilterVintage, mdiRedo, mdiUndo, mdiMagnifyMinusOutline, mdiMagnifyPlusOutline, mdiSquareOutline, mdiFormatRotate90 } from '@mdi/js';
import { Tool } from '../../types/tools';
import { readFile, openChoosePhotoDialog } from '../../utils/files';
import { createCanvasWithImage, saveCanvas } from '../../utils/canvas';
import { ImageSize } from '../../types/image';

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
    private renderImage = () => {
        const { naturalWidth, naturalHeight, src } = this.state.image;

        this.setState({
            history: [...this.state.history, { id: 0, type: HistoryType.OPEN, uri: src }],
            imageSize: { width: naturalWidth, height: naturalHeight }
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
    private setScale = (scale: number) => this.setState({ scale });
    private scaleIn = () => this.setDeltaScale(1);
    private scaleOut = () => this.setDeltaScale(-1);
    private scaleReset = () => this.setScale(1);

    private onEntryClick = (id: number) => this.setState({ historyIndex: id });
    private onUndo = () => this.onEntryClick(this.state.historyIndex - 1);
    private onRedo = () => this.onEntryClick(this.state.historyIndex + 1);

    private onChangeScale = (scale: number) => this.setState({ scale });

    private noop = () => {
        // todo
    };

    render() {
        const disabled = !this.state.image;
        return (
            <div className="app">
                <Panel
                    name="file"
                    type="horizontal"
                    buttons={[
                        { label: 'Open', icon: mdiFolderOpenOutline, onClick: this.open },
                        { label: 'Save', icon: mdiContentSave, onClick: this.save, disabled },
                    ]} />
                <Panel
                    name="tools"
                    type="vertical"
                    buttons={[
                        { icon: mdiBrightness4, label: 'Brightness', onClick: this.noop, disabled },
                        { icon: mdiContrastBox, label: 'Contrast', onClick: this.noop, disabled },
//                        { icon: mdiCrop, label: 'Crop', onClick: this.noop, disabled },
                        { icon: mdiFormatRotate90, label: 'Rotate to 90 deg', onClick: this.noop, disabled },
                        { icon: mdiImageFilterVintage, label: 'Filters', onClick: this.noop, disabled }
                    ]} />
                <Panel
                    name="status"
                    type="horizontal"
                    buttons={[
                        <StatusBar key="status" />
                    ]} />
                <div className="panel--aside">
                    <AsideBlock
                        title="Navigation">
                        <Panel
                            name="history"
                            type="horizontal"
                            buttons={[
                                { label: 'Zoom in', icon: mdiMagnifyPlusOutline, onClick: this.scaleIn, disabled },
                                { label: 'Zoom out', icon: mdiMagnifyMinusOutline, onClick: this.scaleOut, disabled },
                                { label: 'Reset', icon: mdiSquareOutline, onClick: this.scaleReset, disabled },
                            ]}
                        />
                    </AsideBlock>
                    <AsideBlock
                        title="History">
                        <Panel
                            name="history"
                            type="horizontal"
                            buttons={[
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
                {this.state.history.length && (
                    <Canvas
                        imageUri={this.state.history[this.state.historyIndex].uri}
                        imageSize={this.state.imageSize}
                        scale={this.state.scale}
                        onChangeScale={this.onChangeScale} />
                )}
            </div>
        );
    }
}
