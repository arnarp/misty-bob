import * as React from 'react';

interface NotFoundPageProps {}

export class NotFoundPage extends React.PureComponent<NotFoundPageProps> {
  render() {
    return (
      <main>
        <h1>Síða fannst ekki</h1>
      </main>
    );
  }
}
