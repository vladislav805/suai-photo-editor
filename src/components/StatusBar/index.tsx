import * as React from 'react';
import './StatusBar.scss';

export interface IStatusBarState {
    text: string;
}

export class StatusController {
    static sInstance: StatusController;

    public static getInstance = (): StatusController => {
        if (!StatusController.sInstance) {
            StatusController.sInstance = new StatusController();
        }
        return StatusController.sInstance;
    }

    private mListener: (text: string) => void;
    private mTempTimer: number;

    on = (listener: (text: string) => void) => this.mListener = listener;

    public set = (text: string) => {
        if (this.mTempTimer) {
            clearTimeout(this.mTempTimer);
        }

        if (this.mListener) {
            this.mListener(text);
        }
    };

    public temporary = (text: string) => {
        this.set(text);

        this.mTempTimer = setTimeout(this.clear, 2000) as unknown as number;
    };

    public clear = () => this.set('');
}

export default class StatusBar extends React.Component<{}, IStatusBarState> {
    state: IStatusBarState = {
        text: '',
    };

    private ctl: StatusController;

    componentDidMount() {
        this.ctl = StatusController.getInstance();
        this.ctl.on(this.setText);
    }

    private setText = (text: string) => {
        this.setState({ text });
    }

    render() {
        return (
            <div className="status">{this.state.text}</div>
        );
    }
}
