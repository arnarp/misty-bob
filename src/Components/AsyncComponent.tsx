import * as React from 'react';

type State<P> = Readonly<{
  component: null | React.ComponentType<P>;
  pastDelay: boolean;
}>;

const DELAY = 200;

export function createAsyncComponent<P>(
  importComponent: () => Promise<React.ComponentType<P>>,
  LoadingComponent?: React.ComponentType,
) {
  const initialState: State<P> = { component: null, pastDelay: false };

  class AsyncComponent extends React.Component<P, State<P>> {
    delayTimeout: NodeJS.Timer;
    readonly state: State<P> = initialState;

    async componentDidMount() {
      this.delayTimeout = setTimeout(() => {
        this.setState(() => ({ pastDelay: true }));
      }, DELAY);
      const component = await importComponent();
      this.setState(() => ({
        component,
      }));
    }

    componentWillUnmount() {
      clearTimeout(this.delayTimeout);
    }

    render() {
      const C = this.state.component;
      if (C) {
        return <C {...this.props} />;
      }
      if (this.state.pastDelay && LoadingComponent) {
        return <LoadingComponent />;
      }
      return null;
    }
  }
  return AsyncComponent;
}
