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
  DocumentId,
  Like,
  UID,
  NewLikeDocument,
  BaseDocument,
  Likeable,
} from '../../types';
import { firestore } from '../../firebase';
import { DocumentTitle } from '../../Components/SideEffects';
import { Col, Row } from '../../Components/Layout';
import { RichTextContent, RichTextEditor } from '../../Components/Editor';
import { Avatar } from '../../Components/Discussions/Avatar';
import { Section } from '../../Components/Layout/Section';
import { Button, IconButton } from '../../Components/Buttons';
import './DiscussionPage.css';
import { LikeIcon } from '../../Components/Icons/LikeIcon';

interface DiscussionPageProps extends RouteComponentProps<{ id: string }> {
  userInfo?: UserInfo | null;
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
    const commentsSubscription = this.postRef
      .collection('comments')
      .orderBy('dateOfCreation', 'asc')
      .onSnapshot(snapshot => {
        this.setState(() => ({
          comments: snapshot.docs.map(d => mapDocument<Comment>(d)),
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
              <Row justifyContent="end">
                <IconButton
                  onClick={() =>
                    this.state.post && this.onDocumentLikeClick(this.state.post)
                  }
                  Icon={LikeIcon}
                  color={
                    this.isLikedByCurrentUser(this.state.post.id)
                      ? 'primary'
                      : 'default'
                  }
                  label="Líka við þessa færslu"
                >
                  <span>{this.state.post.numberOfLikes}</span>
                </IconButton>
              </Row>
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
  private onDocumentLikeClick = (document: BaseDocument & Likeable) => {
    console.log('click');
    if (!this.props.userInfo || !this.state.post) {
      return;
    }
    const currentUserDocumentLike = this.getCurrentUserLikeForDocument(
      document.ref.id,
    );
    if (currentUserDocumentLike) {
      firestore
        .collection('likes')
        .doc(currentUserDocumentLike.id)
        .delete()
        .catch(reason => {
          console.log('Like delete reject', reason);
        });
    } else {
      const newLike: NewLikeDocument = {
        authorName: this.props.userInfo.displayName,
        authorUid: this.props.userInfo.uid,
        authorPhotoURL: this.props.userInfo.photoURL,
        dateOfCreation: firebase.firestore.FieldValue.serverTimestamp(),
        documentRef: document.ref,
        documentType:
          document.ref.id === this.state.post.id ? 'Post' : 'Comment',
        pageIds: { [this.state.post.id]: true },
      };
      firestore
        .collection('likes')
        .add(newLike)
        .catch(reason => {
          console.log('Like add reject', reason);
        });
    }
  };
  private isLikedByCurrentUser = (documentId: DocumentId) => {
    return this.getCurrentUserLikeForDocument(documentId) !== undefined;
  };
  private getCurrentUserLikeForDocument = (documentId: DocumentId) => {
    const documentLikes = this.state.likes.get(documentId);
    if (
      documentLikes === undefined ||
      this.props.userInfo === undefined ||
      this.props.userInfo === null
    ) {
      return undefined;
    }
    return documentLikes.get(this.props.userInfo.uid);
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
        numberOfLikes: 0,
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
