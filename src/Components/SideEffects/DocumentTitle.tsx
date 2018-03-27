import * as React from 'react';
import * as withSideEffect from 'react-side-effect';

type DocumentTitleProps = {
  title: string;
};

const SITE_TITLE = 'MistyBob';

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

function handleStateChangeOnClient(props: DocumentTitleProps | undefined) {
  if (props === undefined) {
    document.title = SITE_TITLE;
  } else {
    document.title = `${SITE_TITLE} - ${props.title}`;
  }
}

export const DocumentTitle = withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient,
)(DocumentTitleClass);
