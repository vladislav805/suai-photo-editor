import * as React from 'react';
import classnames from 'classnames';
import './AsideBlock.scss';

export interface IAsideBlockProps {
    title: string;
    open?: boolean;
}

export interface IAsideBlockState {
    open: boolean;
}

export default class AsideBlock extends React.Component<IAsideBlockProps, IAsideBlockState> {
    state: IAsideBlockState = {
        open: true,
    };

    constructor(props: IAsideBlockProps) {
        super(props);

        if ('open' in props) {
            this.state.open = props.open;
        }
    }

    private onClickTitle = () => {
        this.setState(({ open }) => ({ open: !open}));
    };

    render() {
        return (
            <div className={classnames('asideBlock', {
                'asideBlock__open': this.state.open
            })}>
                <div className="asideBlock-title" onClick={this.onClickTitle}>{this.props.title}</div>
                <div className="asideBlock-content">{this.props.children}</div>
            </div>
        );
    }
}
