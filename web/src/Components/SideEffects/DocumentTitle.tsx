import * as React from 'react';
import * as withSideEffect from 'react-side-effect';

type DocumentTitleProps = {
  title: string;
};

class DocumentTitleClass extends React.PureComponent<DocumentTitleProps, {}> {
  render() {
    return null;
  }
}

function reducePropsToState(propsList: DocumentTitleProps[]) {
  if (propsList.length > 0) {
    return propsList[propsList.length - 1];
  }
  return undefined;
}

function handleStateChangeOnClient(props: DocumentTitleProps) {
  document.title = 'MistyBob - ' + props.title;
}

export const DocumentTitle = withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient,
)(DocumentTitleClass);
