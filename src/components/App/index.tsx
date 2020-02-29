import * as React from 'react';
import './App.scss';
import Panel, { IPanelButton } from '../Panel';
import Canvas from '../Canvas';
import { mdiFolderOpenOutline, mdiContentSave, mdiBrightness4, mdiContrastBox, mdiImageFilterVintage } from '@mdi/js';
import StatusBar, { StatusController } from '../StatusBar';


interface IAppState {
    image?: HTMLImageElement;
    // history: IHistoryEntry[];
}

export default class App extends React.Component<{}, IAppState> {
    state: IAppState = {

    };

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
                        this.setState({ image });
                        sc.set('Done');
                    }
                }
            } else {
                sc.set('Error: not image');
            }
        };
        elem.click();
    };

    private save = () => {
        //saveAs(this.state.file, this.state.file.name);
    };

    private getButtons = (): IPanelButton[] => [
        { label: 'Open', icon: mdiFolderOpenOutline, onClick: this.open },
        { label: 'Save', icon: mdiContentSave, onClick: this.save, disabled: !this.state.image },
    ];

    private noop = () => {
        // todo
    };

    render() {
        return (
            <div className="app">
                <Panel
                    name="file"
                    type="horizontal"
                    buttons={this.getButtons()} />
                <Panel
                    name="tools"
                    type="vertical"
                    buttons={[
                        { icon: mdiBrightness4, label: 'Brightness', onClick: this.noop },
                        { icon: mdiContrastBox, label: 'Contrast', onClick: this.noop },
                        { icon: mdiImageFilterVintage, label: 'Filters', onClick: this.noop }
                    ]} />
                <Panel
                    name="status"
                    type="horizontal"
                    buttons={[
                        <StatusBar key="status" />
                    ]} />
                <div className="panel--aside">
                    <div className="panel--aside_nav">nav</div>
                    <div className="panel--aside_history">history</div>
                </div>
                <Canvas
                    image={this.state.image} />
            </div>
        );
    }
}
