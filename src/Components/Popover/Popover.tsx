import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Transition } from 'react-transition-group';
import './Popover.css';

export interface PopoverControl {
  closePopover: () => void;
}
export interface PopoverProps {
  button: JSX.Element;
  deltaY: number;
  deltaX: number;
  provideControl: (ctrl: PopoverControl | null) => void;
}
interface PopoverState {
  open: boolean;
}

export class Popover extends React.PureComponent<PopoverProps, PopoverState> {
  buttonContainerRect: ClientRect | null;
  focusWhenOpened: HTMLButtonElement;
  portalContainer: HTMLElement | null;
  buttonContainer: HTMLDivElement | null;

  constructor(props: PopoverProps) {
    super(props);
    this.state = { open: false };
    this.portalContainer = document.getElementById('modal-portal');
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount() {
    this.props.provideControl({
      closePopover: () => this.handleClose(),
    });
  }

  componentWillUnmount() {
    this.props.provideControl(null);
  }
  handleOpen() {
    this.setState(
      () => ({ open: true }),
      () => {
        this.focusWhenOpened = document.activeElement as HTMLButtonElement;
        this.buttonContainerRect =
          this.buttonContainer && this.buttonContainer.getBoundingClientRect();
        setTimeout(() => {
          // if (this.closeButton) {
          //   this.closeButton.focus()
          // }
          // tslint:disable-next-line:no-any
          const root = document.getElementById('root');
          if (root) {
            root.inert = true;
          }
        }, 30);
      },
    );
  }
  handleClose() {
    this.setState(() => ({ open: false }));
    this.focusWhenOpened.focus();
    // tslint:disable-next-line:no-any
    const root = document.getElementById('root');
    if (root) {
      root.inert = false;
    }
  }
  render() {
    return (
      <div>
        <div
          ref={ref => {
            this.buttonContainer = ref;
          }}
        >
          {React.cloneElement(this.props.button, {
            onClick: this.handleOpen,
          })}
        </div>
        {this.portalContainer &&
          ReactDOM.createPortal(
            <Transition in={this.state.open} timeout={{ enter: 0, exit: 300 }}>
              {(state: 'entering' | 'entered' | 'exiting' | 'exited') => (
                <div className={`PopoverContainer ${state}`}>
                  <div
                    className={`TransparentBackdrop ${state}`}
                    onClick={this.handleClose}
                  />
                  <div
                    className={`Popover ${state}`}
                    onKeyDown={event => {
                      if (event.key === 'Escape') {
                        this.handleClose();
                      }
                    }}
                    style={{
                      top: `${
                        this.buttonContainerRect
                          ? this.buttonContainerRect.top +
                            this.buttonContainerRect.height +
                            this.props.deltaY
                          : 0
                      }px`,
                      right: `${
                        this.buttonContainerRect
                          ? window.innerWidth -
                            this.buttonContainerRect.right +
                            this.props.deltaX
                          : 0
                      }px`,
                    }}
                  >
                    {this.props.children}
                  </div>
                </div>
              )}
            </Transition>,
            this.portalContainer,
          )}
      </div>
    );
  }
}
