import * as React from 'react';
import './App.scss';
import Panel from '../Panel';
import Canvas from '../Canvas';
import StatusBar, { StatusController } from '../StatusBar';
import AsideBlock from '../AsideBlock';
import History from '../History';
import Connector from '../../utils/connector';
import { IHistoryEntry, HistoryType } from '../../types/history';
import { mdiFolderOpenOutline, mdiContentSave, mdiBrightness4, mdiContrastBox, mdiImageFilterVintage, mdiRedo, mdiUndo, mdiMagnifyMinusOutline, mdiMagnifyPlusOutline, mdiSquareOutline, mdiCrop, mdiFormatRotate90 } from '@mdi/js';

interface IAppState {
    file?: File;
    image?: HTMLImageElement;
    // canvas for thumbnails for preview of filter?
    historyIndex: number,
    history: IHistoryEntry[];
}

export default class App extends React.Component<{}, IAppState> {
    state: IAppState = {
        historyIndex: 1,
        history: [
            { id: 0, type: HistoryType.OPEN },
            { id: 1, type: HistoryType.CROP },
            { id: 2, type: HistoryType.SET_BRIGHTNESS, data: { value: 30 } },
            { id: 3, type: HistoryType.APPLY_FILTER, data: { filterId: 'Test' } },
            { id: 4, type: HistoryType.SET_CONTRAST, data: { value: -1 } },
        ]
    };

    private connector: Connector;

    constructor(props: {}) {
        super(props);
        this.connector = Connector.getInstance();
    }

    private open = () => {
        const sc = StatusController.getInstance();

        sc.set('Select file...');
        const elem = document.createElement('input');
        elem.type = 'file';
        elem.accept = 'image/*';

        elem.onchange = () => {
            const image = new Image();
            const file = elem.files[0];

            sc.set('Loading...');

            if (/image.*/.test(file.type)) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = evt => {
                    if (evt.target.readyState === FileReader.DONE) {
                        image.src = evt.target.result as string;
                        this.setState({ file, image, history: [] });
                        sc.set('Done');
                    }
                }
            } else {
                sc.set('Error: not image');
            }
        };
        elem.click();
    };

    private save = () => this.connector.fire('save', { name: this.state.file.name });
    private zoomIn = () => this.connector.fire('zoom', { delta: 1 });
    private zoomOut = () => this.connector.fire('zoom', { delta: -1 });
    private zoomReset = () => this.connector.fire('zoom', { delta: 0 });

    private onEntryClick = (id: number) => this.setState({ historyIndex: id });
    private onUndo = () => this.onEntryClick(this.state.historyIndex - 1);
    private onRedo = () => this.onEntryClick(this.state.historyIndex + 1);

    private noop = () => {
        // todo
    };

    render() {
        return (
            <div className="app">
                <Panel
                    name="file"
                    type="horizontal"
                    buttons={[
                        { label: 'Open', icon: mdiFolderOpenOutline, onClick: this.open },
                        { label: 'Save', icon: mdiContentSave, onClick: this.save, disabled: !this.state.image },
                    ]} />
                <Panel
                    name="tools"
                    type="vertical"
                    buttons={[
                        { icon: mdiBrightness4, label: 'Brightness', onClick: this.noop },
                        { icon: mdiContrastBox, label: 'Contrast', onClick: this.noop },
                        { icon: mdiCrop, label: 'Crop', onClick: this.noop },
                        { icon: mdiFormatRotate90, label: 'Rotate to 90 deg', onClick: this.noop },
                        { icon: mdiImageFilterVintage, label: 'Filters', onClick: this.noop }
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
                                { label: 'Zoom out', icon: mdiMagnifyMinusOutline, onClick: this.zoomIn },
                                { label: 'Zoom in', icon: mdiMagnifyPlusOutline, onClick: this.zoomOut },
                                { label: 'Reset', icon: mdiSquareOutline, onClick: this.zoomReset },
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
                <Canvas image={this.state.image} />
            </div>
        );
    }
}
