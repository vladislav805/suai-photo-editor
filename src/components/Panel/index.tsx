import * as React from 'react';
import * as classnames from 'classnames';
import Icon from '@mdi/react';
import './Panel.scss';

export type IPanelButton = {
    icon: string;
    label: string;
    onClick: () => void;
    disabled?: boolean;
};

export interface IPanelProps {
    buttons: IPanelButton[];
    type: 'vertical' | 'horizontal';
}

export interface IPanelState {

}

export default class Panel extends React.Component<IPanelProps, IPanelState> {

    private button = (button: IPanelButton) => {
        return (
            <div
                className={classnames('panel-button', {
                    'panel-button__disabled': button.disabled
                })}
                onClick={button.onClick}
                title={button.label}>
                <Icon
                    path={button.icon}
                    size={1} />
            </div>
        );
    };

    render() {
        return (
            <div className={classnames('panel', 'panel__' + this.props.type)}>
                {(this.props.buttons || []).map(button => this.button(button))}
            </div>
        );
    }
}
