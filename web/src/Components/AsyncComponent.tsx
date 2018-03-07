import * as React from 'react';

type State<P> = Readonly<{
  component: null | React.ComponentType<P>;
}>;

export function createAsyncComponent<P>(
  importComponent: () => Promise<React.ComponentType<P>>,
) {
  const initialState: State<P> = { component: null };

  class AsyncComponent extends React.Component<P, State<P>> {
    readonly state: State<P> = initialState;

    async componentDidMount() {
      const component = await importComponent();
      this.setState({
        component,
      });
    }

    render() {
      const C = this.state.component;
      return C ? <C {...this.props} /> : null;
    }
  }
  return AsyncComponent;
}
