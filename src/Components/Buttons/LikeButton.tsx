import * as React from 'react';
import * as firebase from 'firebase';
import { IconButton } from '.';
import { LikeIcon } from '../Icons/LikeIcon';
import {
  Likeable,
  BaseDocument,
  UserInfo,
  DocumentId,
  Like,
  NewLikeDocument,
} from '../../types';
import { firestore } from '../../firebase';

type LikeButtonProps = {
  likeableDocument: Likeable & BaseDocument;
  likeableDocumentType: 'Post' | 'Comment';
  likes?: Map<DocumentId, Like>;
  pageId: DocumentId;
  userInfo?: UserInfo | null;
};

const initialState = {};
type LikeButtonState = Readonly<typeof initialState>;

export class LikeButton extends React.PureComponent<
  LikeButtonProps,
  LikeButtonState
> {
  readonly state: LikeButtonState = initialState;

  render() {
    return (
      <IconButton
        onClick={() => this.onLikeClick(this.props.likeableDocument)}
        Icon={LikeIcon}
        color={
          this.isLikedByCurrentUser(this.props.likeableDocument.ref.id)
            ? 'primary'
            : 'default'
        }
        label="Líka við þessa færslu"
      >
        <span>{this.props.likeableDocument.numberOfLikes}</span>
      </IconButton>
    );
  }
  private onLikeClick = (document: BaseDocument & Likeable) => {
    console.log('click');
    if (this.props.userInfo === undefined) {
      return;
    }
    if (this.props.userInfo === null) {
      return; // ToDo: Login modal?
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
        documentType: this.props.likeableDocumentType,
        pageIds: { [this.props.pageId]: true },
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
    if (!this.props.userInfo) {
      return undefined;
    }
    return this.props.likes && this.props.likes.get(this.props.userInfo.uid);
  };
}
