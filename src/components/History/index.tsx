import * as React from 'react';
import { HistoryEntry } from './HistoryEntry';
import { IHistoryEntry } from '../../types/history';


export interface IHistoryProps {
    entries: IHistoryEntry[];
    current: number;
    onEntryClick: (id: number) => void;
}

export interface IHistoryState {

}

export default class History extends React.Component<IHistoryProps, IHistoryState> {
    render() {
        return (
            <div className="history">
                {this.props.entries.map((entry, i) => (
                    <HistoryEntry
                        key={i}
                        entry={entry}
                        onClick={this.props.onEntryClick}
                        active={entry.id <= this.props.current} />
                ))}
            </div>
        );
    }
}
