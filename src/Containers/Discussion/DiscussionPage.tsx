import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as firebase from 'firebase';
import { convertFromRaw, EditorState, convertToRaw } from 'draft-js';
import {
  Post,
  UserInfo,
  NewCommentDocument,
  mapDocument,
  Comment,
} from 'src/types';
import { firestore } from 'src/firebase';
import { DocumentTitle } from 'src/Components/SideEffects';
import { Col, Row } from 'src/Components/Layout';
import { RichTextContent, RichTextEditor } from 'src/Components/Editor';
import { Avatar } from 'src/Components/Discussions/Avatar';
import { Section } from 'src/Components/Layout/Section';
import { Button } from 'src/Components/Buttons';
import './DiscussionPage.css';

interface DiscussionPageProps extends RouteComponentProps<{ id: string }> {
  userInfo?: UserInfo | null;
}

const initialState = {
  post: undefined as undefined | null | Post,
  comments: undefined as undefined | Comment[],
  editorState: EditorState.createEmpty(),
};
type DiscussionPageState = Readonly<typeof initialState>;

export class DiscussionPage extends React.PureComponent<
  DiscussionPageProps,
  DiscussionPageState
> {
  postRef: firebase.firestore.DocumentReference;
  readonly state: DiscussionPageState = initialState;
  readonly subscriptions: Array<() => void> = [];

  componentDidMount() {
    this.postRef = firestore
      .collection('posts')
      .doc(this.props.match.params.id) as firebase.firestore.DocumentReference;
    const postSubscription = this.postRef.onSnapshot(doc => {
      if (doc.exists) {
        this.setState(() => ({ post: mapDocument(doc) }));
      } else {
        this.setState(() => ({ post: null }));
      }
    });
    this.subscriptions.push(postSubscription);
    const commentsSubscription = this.postRef
      .collection('comments')
      .orderBy('dateOfCreation', 'asc')
      .onSnapshot(snapshot => {
        this.setState(() => ({
          comments: snapshot.docs.map(d => mapDocument(d)),
        }));
      });
    this.subscriptions.push(commentsSubscription);
  }
  componentWillUnmount() {
    this.subscriptions.forEach(u => u());
  }
  render() {
    return (
      <main>
        {this.state.post && (
          <Col spacing="large">
            <DocumentTitle title={this.state.post.title} />
            <Section>
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
            </Section>
            {this.state.comments && (
              <Section className="Discussion-Comments">
                <Col spacing="medium" as="ol" seperators>
                  {this.state.comments.map(c => (
                    <Row as="li" key={c.id} spacing="medium">
                      <Avatar photoURL={c.authorPhotoURL} size="large" />
                      <Col spacing="medium">
                        <Col>
                          <span>{c.authorName}</span>
                          <time>
                            {new Intl.DateTimeFormat('fr').format(
                              c.dateOfCreation,
                            )}
                          </time>
                        </Col>
                        <RichTextContent content={convertFromRaw(c.content)} />
                      </Col>
                    </Row>
                  ))}
                </Col>
              </Section>
            )}
            {this.props.userInfo && (
              <Section className="Discussion-New-Comment" sideMargins={false}>
                <form onSubmit={this.submitNewComment}>
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
                  <Row justifyContent="end">
                    <Button
                      width="fit-content"
                      style="flat"
                      type="submit"
                      color="default"
                    >
                      Senda svar
                    </Button>
                  </Row>
                </form>
              </Section>
            )}
          </Col>
        )}
      </main>
    );
  }
  private onEditorChange = (editorState: EditorState) => {
    this.setState(() => ({ editorState }));
  };
  private submitNewComment = (event: React.FormEvent<{}>) => {
    event.preventDefault();
    if (this.props.userInfo) {
      const newComment: NewCommentDocument = {
        authorName: this.props.userInfo.displayName,
        authorUid: this.props.userInfo.uid,
        authorPhotoURL: this.props.userInfo.photoURL,
        content: convertToRaw(this.state.editorState.getCurrentContent()),
        dateOfCreation: firebase.firestore.FieldValue.serverTimestamp(),
      };
      this.postRef
        .collection('comments')
        .add(newComment)
        .then(() => {
          console.log('comment added');
          this.setState(() => ({ editorState: EditorState.createEmpty() }));
        })
        .catch((reason: firebase.firestore.FirestoreError) => {
          console.log(
            'add comment rejected',
            reason.code,
            reason.message,
            reason.name,
          );
        });
    }
  };
}
