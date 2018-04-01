import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { convertFromRaw, EditorState } from 'draft-js';
import { DocumentTitle } from 'src/Components/SideEffects/DocumentTitle';
import { Col, Row } from 'src/Components/Layout';
import { Post, UserInfo } from 'src/types';
import { firestore } from 'src/firebase';
import { mapDocument } from '../../types/FirestoreSchema';
import { RichTextContent } from '../../Components/Editor/RichTextContent';
import { Avatar } from '../../Components/Discussions/Avatar';
import { RichTextEditor } from '../../Components/Editor';
import './DiscussionPage.css';

interface DiscussionPageProps extends RouteComponentProps<{ id: string }> {
  userInfo?: UserInfo | null;
}

const initialState = {
  post: undefined as undefined | null | Post,
  editorState: EditorState.createEmpty(),
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
          <Col spacing="large">
            <div>
              <DocumentTitle title={this.state.post.title} />
              <Row spacing="medium">
                <Avatar
                  photoURL={this.state.post.authorPhotoURL}
                  size="large"
                />
                <Col>
                  <span>{this.state.post.authorName}</span>
                  <time>
                    {new Intl.DateTimeFormat('fr').format(
                      this.state.post.dateOfCreation,
                    )}
                  </time>
                </Col>
              </Row>
              <h1>{this.state.post.title}</h1>
              <RichTextContent
                content={convertFromRaw(this.state.post.content)}
              />
            </div>
            <Col className="Discussion-Comments">
              {this.props.userInfo && (
                <Row spacing="medium">
                  <Avatar
                    photoURL={this.props.userInfo.photoURL}
                    size="large"
                  />
                  <RichTextEditor
                    placeholder="Skrifaðu athugasemd"
                    editorState={this.state.editorState}
                    onChange={this.onEditorChange}
                  />
                </Row>
              )}
            </Col>
          </Col>
        )}
      </main>
    );
  }
  private onEditorChange = (editorState: EditorState) => {
    this.setState(() => ({ editorState }));
  };
}
