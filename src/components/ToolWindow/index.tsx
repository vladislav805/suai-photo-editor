import * as React from 'react';
import { CanvasWithContext } from '../../utils/canvas';
import AsideBlock from '../AsideBlock';
import { Tool } from '../../types/tools';
import { mdiCheck } from '@mdi/js';
import Icon from '@mdi/react';
import './styles.scss';
import { BlurToolWindow, ContrastToolWindow, BrightnessToolWindow, HueRotateToolWindow, GrayscaleToolWindow, InvertToolWindow, SaturateToolWindow, SepiaToolWindow } from './range-tools';

export type CallbackWithImageCanvas<T> = (image: HTMLImageElement, canvas: CanvasWithContext) => Promise<T> | void;
export type OnPreviewWillChange = (callback: CallbackWithImageCanvas<void>) => void;
export type OnPreviewWillReset = (callback: CallbackWithImageCanvas<void>) => void;
export type OnApplyTool = (callback: CallbackWithImageCanvas<HTMLImageElement>) => void;

export type IToolWindowChildProps = IToolWindowChildCallbacks & { save?: boolean };

type IToolWindowChildCallbacks = {
    onPreviewWillChange: OnPreviewWillChange;
    onPreviewWillReset: OnPreviewWillReset;
    onApplyTool: OnApplyTool;
}

export interface IToolWindowProps extends IToolWindowChildCallbacks {
    tool: Tool;
}

export interface IToolWindowState {
    save: boolean;
}

export default class ToolWindow extends React.Component<IToolWindowProps, IToolWindowState> {
    state: IToolWindowState = {
        save: false
    };

    private renderTool = (): { title: string; view: React.ReactNode} => {
        const args = {
            ...this.props,
            onApplyTool: (callback: CallbackWithImageCanvas<HTMLImageElement>) => {
                this.props.onApplyTool(callback);
                this.setState({ save: false });
            }
        };
        let title: string;
        let view: React.ReactNode;
        switch (this.props.tool) {
            case Tool.BRIGHTNESS: {
                title = 'Brightness';
                view = <BrightnessToolWindow {...args} save={this.state.save} />;
                break;
            }

            case Tool.CONTRAST: {
                title = 'Contrast';
                view = <ContrastToolWindow {...args} save={this.state.save} />;
                break;
            }

            case Tool.BLUR: {
                title = 'Blur';
                view = <BlurToolWindow {...args} save={this.state.save} />;
                break;
            }

            case Tool.GRAYSCALE: {
                title = 'Grayscale';
                view = <GrayscaleToolWindow {...args} save={this.state.save} />;
                break;
            }

            case Tool.HUE_ROTATE: {
                title = 'Hue rotate';
                view = <HueRotateToolWindow {...args} save={this.state.save} />;
                break;
            }

            case Tool.INVERT: {
                title = 'Invert';
                view = <InvertToolWindow {...args} save={this.state.save} />;
                break;
            }

            case Tool.SATURATE: {
                title = 'Saturate';
                view = <SaturateToolWindow {...args} save={this.state.save} />;
                break;
            }

            case Tool.SEPIA: {
                title = 'Sepia';
                view = <SepiaToolWindow {...args} save={this.state.save} />;
                break;
            }

            case Tool.NONE: {
                title = 'Tool not selected';
                view = <div className="tool-empty"><p>Tool not selected</p><p>Parameters not available</p></div>;
                break;
            }

            default: {
                return null;
            }
        }

        return { title, view };
    };

    private applyTool = () => {
        this.setState({ save: true });
    };

    render() {
        const tool = this.renderTool();

        if (!tool) {
            return null;
        }

        const { title, view } = tool;

        return (
            <AsideBlock title={title} open={true}>
                {view}
                {this.props.tool !== Tool.NONE ? (
                    <button className="tool-apply" onClick={this.applyTool}>
                        <Icon
                            path={mdiCheck}
                            size={1}
                            color={"white"} />
                        <span>Apply</span>
                    </button>
                ) : null}
            </AsideBlock>
        );
    }
}
