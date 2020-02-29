import * as React from 'react';
import * as classnames from 'classnames';
import Icon from '@mdi/react';
import './Panel.scss';

export type IPanelButton = {
    icon?: string;
    label: string;
    onClick: () => void;
    disabled?: boolean;
};

export type IPanelText = {
    text: string;
};

export type IPanelEntry = IPanelButton | IPanelText | React.ReactElement | Element;

export interface IPanelProps {
    buttons: IPanelEntry[];
    type: 'vertical' | 'horizontal';
    name: string;
}

export interface IPanelState {

}

export default class Panel extends React.Component<IPanelProps, IPanelState> {

    private entry = (button: IPanelEntry) => {
        if (React.isValidElement(button)) {
            return button;
        }

        if ((button as IPanelText).text) {
            const { text } = button as IPanelText;
            return <div className='panel-text'>{text}</div>
        }

        const { icon, label, disabled, onClick } = button as IPanelButton;

        return (
            <div
                className={classnames('panel-button', {
                    'panel-button__disabled': disabled
                })}
                onClick={onClick}
                title={label}>
                {icon
                    ? (
                        <Icon
                            path={icon}
                            size={1}
                            color="#ffffff" />
                    )
                    : label
                }
            </div>
        );
    };

    render() {
        return (
            <div className={classnames(
                'panel',
                'panel__' + this.props.type,
                this.props.name && 'panel--' + this.props.name,
            )}>
                {(this.props.buttons || []).map(entry => this.entry(entry))}
            </div>
        );
    }
}
