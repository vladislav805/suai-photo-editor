import * as React from 'react';
import Range from '../Range';
import { IToolWindowChildProps } from '.';
import { saveCanvas } from '../../utils/canvas';
import { ImageType } from '../../types/image';

type ISaveToolWindowProps = IToolWindowChildProps;

type MimeFormat = ImageType;
const formats: Record<MimeFormat, string> = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/bmp': 'BMP',
};

const extensions: Record<MimeFormat, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/bmp': '.bmp',
};

interface ISaveToolWindowState {
    format: MimeFormat;
    quality: number;
    name: string;
}

export default class SaveToolWindow extends React.Component<ISaveToolWindowProps, ISaveToolWindowState> {
    state = {
        format: 'image/jpeg' as MimeFormat,
        quality: 90,
        name: 'image',
    };

    componentDidMount() {
        this.props.getButtonText?.('Save');
    }

    componentDidUpdate(prevProps: IToolWindowChildProps) {
        if (!prevProps.save && this.props.save) {
            this.props.onApplyTool((_image, { canvas }) => {
                saveCanvas(canvas, this.state.name + extensions[this.state.format], this.state.format, this.state.quality);
            });
        }
    }

    private onChangeFormat = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
        const format = target.options[target.selectedIndex].value as MimeFormat;
        this.setState({ format });
    };

    private onChangeQuality = (quality: number) => this.setState({ quality });

    private onChangeName = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: target.value });
    };

    render() {
        return (
            <div className="save-form">
                <div className="save-info">
                    <input
                        type="text"
                        autoComplete="off"
                        onChange={this.onChangeName}
                        value={this.state.name} />
                    <select name="format" onChange={this.onChangeFormat}>
                        {Object.keys(formats).map((mime: MimeFormat, i: number) => (
                            <option key={i} value={mime}>{formats[mime]}</option>
                        ))}
                    </select>
                </div>

                {this.state.format === 'image/jpeg' && (
                    <>
                        <p>Quality (applied for JPEG only)</p>
                        <Range
                            min={1}
                            max={100}
                            step={1}
                            value={this.state.quality}
                            onChange={this.onChangeQuality} />
                    </>
                )}
            </div>
        )
    }
}