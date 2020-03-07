import * as React from 'react';
import { IFilter } from '../../utils/filters';
import { ImageSize } from '../../types/image';
import { OnApplyTool } from '../ToolWindow';
import { makeImage } from '../../utils/image';
import './FilterEntry.scss';

export interface IFilterEntryProps {
    filter: IFilter;
    thumb: HTMLImageElement;
    thumbSize: ImageSize;
    onApply: OnApplyTool;
}

export interface IFilterEntryState {
    uri?: string;
}

export default class FilterEntry extends React.Component<IFilterEntryProps, IFilterEntryState> {
    state = {
        uri: 'about:blank'
    };

    componentDidMount() {
        const { filter, thumb } = this.props;

        filter.applyFilter(thumb).then(uri => this.setState({ uri }));
    }

    private onClick = () => {
        const { onApply, filter: { applyFilter } } = this.props;

        onApply(image => applyFilter(image).then(uri => makeImage(uri)));
    };

    render() {
        const { filter, thumbSize: { width, height} } = this.props;

        return (
            <div className="filter" onClick={this.onClick}>
                <div className="filter-name">{filter.title}</div>
                <div className="filter-preview" style={{ paddingBottom: `${height / width * 100}%` }}>
                    <img src={this.state.uri} alt="preview" />
                </div>
            </div>
        );
    }
}
