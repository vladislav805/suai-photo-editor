import * as React from 'react';
import { IHistoryEntry, IHistoryEntryData, HistoryType } from '../../types/history';
import './HistoryEntry.scss';
import classnames from 'classnames';

export interface IHistoryEntryProps {
    entry: IHistoryEntry;
    active?: boolean;
    onClick?: (id: number) => void;
}

export interface IHistoryEntryState {

}

export class HistoryEntry extends React.Component<IHistoryEntryProps, IHistoryEntryState> {
    private namesOfTypes: Record<HistoryType, (data?: IHistoryEntryData) => string> = {
        [HistoryType.OPEN]: () => `Open`,
        [HistoryType.ROTATE]: () => 'Rotate',
        [HistoryType.BRIGHTNESS]: () => `Set brightness`,
        [HistoryType.CONTRAST]: () => `Set contrast`,
        [HistoryType.BLUR]: () => `Blur`,
        [HistoryType.GRAYSCALE]: () => `Grayscale`,
        [HistoryType.HUE_ROTATE]: () => `Hue rotate`,
        [HistoryType.INVERT]: () => `Invert`,
        [HistoryType.SATURATE]: () => `Saturate`,
        [HistoryType.SEPIA]: () => `Sepia`,
        [HistoryType.FILTER]: () => `Apply filter`,
    };

    private onClick = () => {
        this.props.onClick?.(this.props.entry.id);
    };

    render() {
        const { active, entry } = this.props;
        const { id, type, data } = entry;
        return (
            <div className={classnames('history-entry', { 'history-entry__active': active })} onClick={this.onClick}>
                <div className="history-entry-id">{id}</div>
                <div className="history-entry-label">{this.namesOfTypes[type](data)}</div>
            </div>
        );
    }
}
