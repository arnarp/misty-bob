import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as firebase from 'firebase';
import { convertFromRaw, EditorState, convertToRaw } from 'draft-js';
import { FormattedDate, FormattedRelative, FormattedMessage } from 'react-intl';
import {
  Post,
  UserInfo,
  NewCommentDocument,
  mapDocument,
  Comment,
  DocumentId,
  Like,
  UID,
  CommentDocument,
  propertyOf,
} from '../../types';
import { firestore } from '../../firebase';
import { DocumentTitle } from '../../Components/SideEffects';
import { Col, Row, Button, LikeButton, Section, Text } from '../../Components';
import { RichTextContent, RichTextEditor } from '../../Components/Editor';
import { Avatar } from '../../Components/Discussions/Avatar';
import './DiscussionPage.css';

interface DiscussionPageProps extends RouteComponentProps<{ id: string }> {
  userInfo: UserInfo | null;
}

const initialState = {
  post: undefined as undefined | null | Post,
  comments: undefined as undefined | Comment[],
  likes: new Map<DocumentId, Map<UID, Like>>(),
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
        this.setState(() => ({ post: mapDocument<Post>(doc) }));
      } else {
        this.setState(() => ({ post: null }));
      }
    });
    this.subscriptions.push(postSubscription);
    const commentsSubscription = firestore
      .collection('comments')
      .orderBy('dateOfCreation', 'asc')
      .where(
        propertyOf<CommentDocument>('postId'),
        '==',
        this.props.match.params.id,
      )
      .onSnapshot(snapshot => {
        this.setState(() => ({
          comments: snapshot.docs.map(d => mapDocument<Comment>(d as any)),
        }));
      });
    this.subscriptions.push(commentsSubscription);
    const likesSubscription = firestore
      .collection('likes')
      .where(`pageIds.${this.props.match.params.id}`, '==', true)
      .onSnapshot(snapshot => {
        const likes = new Map<DocumentId, Map<UID, Like>>();
        snapshot.docs
          .map(d => mapDocument<Like>(d as firebase.firestore.DocumentSnapshot))
          .forEach(value => {
            if (likes.get(value.documentRef.id) === undefined) {
              likes.set(value.documentRef.id, new Map());
            }
            const documentLikes = likes.get(value.documentRef.id) as Map<
              UID,
              Like
            >;
            documentLikes.set(value.authorUid, value);
          });
        this.setState(() => ({ likes }));
      });
    this.subscriptions.push(likesSubscription);
  }
  componentWillUnmount() {
    this.subscriptions.forEach(u => u());
  }
  render() {
    return (
      <Col
        as="main"
        spacing="large"
        alignItems="center"
        className="DiscussionPage-Main"
      >
        {this.state.post && (
          <>
            <DocumentTitle title={this.state.post.title} />
            <Section sidePaddings="mediumResponsive">
              <Row spacing="medium">
                <Avatar
                  photoURL={this.state.post.authorPhotoURL}
                  size="large"
                />
                <Col>
                  <Text.Secondary>{this.state.post.authorName}</Text.Secondary>
                  {this.state.post.dateOfCreation !== null && (
                    <FormattedDate
                      value={this.state.post.dateOfCreation}
                      day="numeric"
                      month="long"
                      year="numeric"
                    />
                  )}
                </Col>
              </Row>
              <h1>{this.state.post.title}</h1>
              <RichTextContent
                content={convertFromRaw(this.state.post.content)}
              />
              <Row justifyContent="spaceBetween" alignItems="center">
                <FormattedMessage
                  id="numberOfComments"
                  values={{
                    numberOfComments: this.state.post.numberOfComments,
                  }}
                >
                  {message => <Text.Secondary>{message}</Text.Secondary>}
                </FormattedMessage>
                <LikeButton
                  likeableDocument={this.state.post}
                  likeableDocumentType="Post"
                  likes={this.state.likes.get(this.state.post.id)}
                  pageId={this.state.post.id}
                  userInfo={this.props.userInfo}
                />
              </Row>
            </Section>
            {this.state.comments && (
              <Section className="Discussion-Comments">
                <Col spacing="medium" as="ol" seperators>
                  {this.state.comments.map(c => (
                    <Col as="li" key={c.id} spacing="medium">
                      <Row spacing="medium" alignItems="center">
                        <Avatar photoURL={c.authorPhotoURL} size="default" />
                        <span className="Comment-Author">{c.authorName}</span>
                        {c.dateOfCreation !== null && (
                          <FormattedRelative value={c.dateOfCreation} />
                        )}
                      </Row>
                      <RichTextContent content={convertFromRaw(c.content)} />
                      <Row justifyContent="end" alignItems="center">
                        {this.state.post && (
                          <LikeButton
                            likeableDocument={c}
                            likeableDocumentType="Comment"
                            likes={this.state.likes.get(c.id)}
                            pageId={this.state.post.id}
                            userInfo={this.props.userInfo}
                          />
                        )}
                      </Row>
                    </Col>
                  ))}
                </Col>
              </Section>
            )}
            {this.props.userInfo && (
              <Section className="Discussion-New-Comment">
                <form onSubmit={this.submitNewComment}>
                  <Row spacing="medium">
                    <Avatar
                      photoURL={this.props.userInfo.photoURL}
                      size="large"
                    />
                    <FormattedMessage id="writeAReplyPlaceholder">
                      {placeholder => (
                        <RichTextEditor
                          placeholder={placeholder}
                          editorState={this.state.editorState}
                          onChange={this.onEditorChange}
                        />
                      )}
                    </FormattedMessage>
                  </Row>
                  <Row justifyContent="end">
                    <Button
                      width="fit-content"
                      style="flat"
                      type="submit"
                      color="default"
                    >
                      <FormattedMessage id="sendReply" />
                    </Button>
                  </Row>
                </form>
              </Section>
            )}
          </>
        )}
      </Col>
    );
  }
  private onEditorChange = (editorState: EditorState) => {
    this.setState(() => ({ editorState }));
  };

  private submitNewComment = (event: React.FormEvent<{}>) => {
    event.preventDefault();
    if (this.props.userInfo && this.state.post) {
      const newComment: NewCommentDocument = {
        authorName: this.props.userInfo.displayName,
        authorUid: this.props.userInfo.uid,
        authorPhotoURL: this.props.userInfo.photoURL,
        content: convertToRaw(this.state.editorState.getCurrentContent()),
        dateOfCreation: firebase.firestore.FieldValue.serverTimestamp(),
        numberOfLikes: 0,
        postId: this.state.post.id,
      };
      firestore
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
