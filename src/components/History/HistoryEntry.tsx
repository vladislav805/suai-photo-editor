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
        [HistoryType.CROP]: () => 'Crop image',
        [HistoryType.ROTATE]: () => 'Rotate',
        [HistoryType.BRIGHTNESS]: (data: IHistoryEntryData) => `Set brightness to ${data?.value}`,
        [HistoryType.CONTRAST]: (data: IHistoryEntryData) => `Set contrast to ${data?.value}`,
        [HistoryType.BLUR]: (data: IHistoryEntryData) => `Set blur to ${data?.value}`,
        [HistoryType.GRAYSCALE]: (data: IHistoryEntryData) => `Set grayscale to ${data?.value}`,
        [HistoryType.HUE_ROTATE]: (data: IHistoryEntryData) => `Set hue rotate to ${data?.value}`,
        [HistoryType.INVERT]: (data: IHistoryEntryData) => `Set invert to ${data?.value}`,
        [HistoryType.SATURATE]: (data: IHistoryEntryData) => `Set saturate to ${data?.value}`,
        [HistoryType.SEPIA]: (data: IHistoryEntryData) => `Set sepia to ${data?.value}`,
        [HistoryType.FILTER]: (data: IHistoryEntryData) => `Apply filter '${data?.filterId}'`,
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
