import * as React from 'react';
import { IToolWindowChildProps } from '.';
import filters from '../../utils/filters';
import { makeImageFromCanvas } from '../../utils/image';
import { createCanvas } from '../../utils/canvas';
import FilterEntry from '../FilterEntry';
import { ImageSize } from '../../types/image';

type IFiltersToolWindowProps = IToolWindowChildProps & {
    image: HTMLImageElement;
};

type IFiltersToolWindowState = {
    thumb?: HTMLImageElement;
    thumbSize?: ImageSize;
};

export default class FiltersToolWindow extends React.Component<IFiltersToolWindowProps, IFiltersToolWindowState> {
    state: IFiltersToolWindowState = {};

    private TARGET_WIDTH = 200;

    constructor(props: IFiltersToolWindowProps) {
        super(props);

        this.createThumbnail(props.image).then(thumb => {
            const thumbSize = { width: thumb.naturalWidth, height: thumb.naturalHeight };
            this.setState({ thumb, thumbSize });
        });

        this.state = { thumb: null };
    }

    private createThumbnail = async(original: HTMLImageElement): Promise<HTMLImageElement> => {
        const scale = this.TARGET_WIDTH / original.naturalWidth;

        const { canvas, context } = createCanvas({ width: this.TARGET_WIDTH, height: original.naturalHeight * scale });

        context.drawImage(original, 0, 0, original.naturalWidth, original.naturalHeight, 0, 0, canvas.width, canvas.height);

        return await makeImageFromCanvas(canvas);
    };

    render() {
        return (
            <div className="filter-list">
                {this.state.thumb && filters.map((filter, i) => (
                    <FilterEntry
                        key={i}
                        filter={filter}
                        thumb={this.state.thumb}
                        thumbSize={this.state.thumbSize}
                        onApply={this.props.onApplyTool} />
                ))}
            </div>
        );
    }
}
