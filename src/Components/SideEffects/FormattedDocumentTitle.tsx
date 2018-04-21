import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DocumentTitle } from '.';

type FormattedDocumentTitleProps = {
  id: string;
};

export const FormattedDocumentTitle: React.SFC<
  FormattedDocumentTitleProps
> = props => (
  <FormattedMessage id={props.id}>
    {text => <DocumentTitle title={text} />}
  </FormattedMessage>
);
