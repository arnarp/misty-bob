import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { convertFromRaw } from 'draft-js';
import { DocumentTitle } from 'src/Components/SideEffects/DocumentTitle';
import { Col } from 'src/Components/Layout';
import { Post } from 'src/types';
import { firestore } from 'src/firebase';
import { mapDocument } from '../../types/FirestoreSchema';
import { RichTextContent } from '../../Components/Editor/RichTextContent';

interface DiscussionPageProps extends RouteComponentProps<{ id: string }> {}

const initialState = {
  post: undefined as undefined | null | Post,
};
type DiscussionPageState = Readonly<typeof initialState>;

export class DiscussionPage extends React.PureComponent<
  DiscussionPageProps,
  DiscussionPageState
> {
  readonly state: DiscussionPageState = initialState;
  readonly subscriptions: Array<() => void> = [];
  componentDidMount() {
    const postSubscription = firestore
      .collection('posts')
      .doc(this.props.match.params.id)
      .onSnapshot(doc => {
        if (doc.exists) {
          this.setState(() => ({ post: mapDocument(doc) }));
        } else {
          this.setState(() => ({ post: null }));
        }
      });
    this.subscriptions.push(postSubscription);
  }
  componentWillUnmount() {
    this.subscriptions.forEach(u => u());
  }
  render() {
    return (
      <main>
        {this.state.post && (
          <Col>
            <DocumentTitle title={this.state.post.title} />
            <h1>{this.state.post.title}</h1>
            <RichTextContent
              content={convertFromRaw(this.state.post.content)}
            />
          </Col>
        )}
      </main>
    );
  }
}
