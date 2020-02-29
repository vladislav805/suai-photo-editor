import * as React from 'react';
import './App.scss';
import Panel, { IPanelButton } from '../Panel';
import { mdiFolderOpenOutline, mdiContentSave } from '@mdi/js';
import { saveAs } from 'file-saver';

interface IAppState {
    file?: File;
    // history: IHistoryEntry[];
}

export default class App extends React.Component<{}, IAppState> {
    state: IAppState = {

    };

    private open = () => {
        const elem = document.createElement('input');
        elem.type = 'file';
        elem.accept = 'image/*';
        elem.onchange = (event) => {
            this.setState({
                file: elem.files[0],
            });
        };
        elem.click();
    };

    private save = () => {
        saveAs(this.state.file, this.state.file.name);
    };

    private getButtons = (): IPanelButton[] => [
        { label: 'Open', icon: mdiFolderOpenOutline, onClick: this.open },
        { label: 'Save', icon: mdiContentSave, onClick: this.save, disabled: !this.state.file },
    ];

    render() {
        console.log(this.state);
        return (
            <div className="app">
                <Panel type="horizontal" buttons={this.getButtons()} />
            </div>
        );
    }
}
