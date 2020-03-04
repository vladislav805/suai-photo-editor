import * as React from 'react';
import classnames from 'classnames';
import { IPanelText, IPanelButton, IPanelEntry } from '.';
import Icon from '@mdi/react';

export interface IPanelItemProps {
    entry: IPanelEntry;
}

export type IPanelItemState = {};

export default class PanelItem extends React.Component<IPanelItemProps, IPanelItemState> {
    private onClick = () => {
        const e = this.props.entry as IPanelButton;
        const { disabled, onClick, tag } = e;

        if (!disabled) {
            onClick(tag);
        }
    };

    render() {
        const { entry } = this.props;
        if (React.isValidElement(entry)) {
            return entry;
        }

        if ((entry as unknown as IPanelText).text) {
            const { text } = entry as unknown as IPanelText;
            return <div className='panel-text'>{text}</div>
        }

        const { icon, label, disabled } = entry as unknown as IPanelButton;

        return (
            <div
                className={classnames('panel-button', {
                    'panel-button__disabled': disabled
                })}
                onClick={this.onClick}>
                <div className="panel-button-label">{label}</div>
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
    }
}
