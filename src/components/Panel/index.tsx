import * as React from 'react';
import * as classnames from 'classnames';
import './Panel.scss';
import PanelItem from './PanelItem';

export type IPanelButton = {
    icon?: string;
    label: string;
    onClick: (tag?: string | number) => void;
    disabled?: boolean;
    tag?: string | number;
};

export type IPanelText = {
    text: string;
};

export type IPanelEntry = IPanelButton | IPanelText | React.ReactElement | Element;

export interface IPanelProps {
    items: IPanelEntry[];
    type: 'vertical' | 'horizontal';
    name: string;
}

export interface IPanelState {}

export default class Panel extends React.Component<IPanelProps, IPanelState> {
    render() {
        return (
            <div className={classnames(
                'panel',
                'panel__' + this.props.type,
                this.props.name && 'panel--' + this.props.name,
            )}>
                {(this.props.items || []).map((entry, i) => React.isValidElement(entry) ? entry : (
                    <PanelItem key={i} entry={entry} />
                ))}
            </div>
        );
    }
}
