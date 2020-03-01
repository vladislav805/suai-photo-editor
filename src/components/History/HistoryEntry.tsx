import * as React from 'react';
import { IHistoryEntry, HistoryType, IHistoryEntryData } from '../../types/history';
import './HistoryEntry.scss';
import classnames from 'classnames';

export interface IHistoryEntryProps {
    entry: IHistoryEntry;
    active?: boolean;
    onClick: (id: number) => void;
}

export interface IHistoryEntryState {

}

export class HistoryEntry extends React.Component<IHistoryEntryProps, IHistoryEntryState> {
    private namesOfTypes: Record<HistoryType, (data?: IHistoryEntryData) => string> = {
        [HistoryType.OPEN]: () => `Open`,
        [HistoryType.APPLY_FILTER]: (data = {}) => `Apply filter '${data.filterId}'`,
        [HistoryType.CROP]: () => 'Crop image',
        [HistoryType.SET_BRIGHTNESS]: (data = {}) => `Set brightness to ${data.value}`,
        [HistoryType.SET_CONTRAST]: (data = {}) => `Set contrast to ${data.value}`,
    };

    private onClick = () => {
        this.props.onClick(this.props.entry.id);
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
