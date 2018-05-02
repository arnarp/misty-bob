import * as React from 'react';
import * as firebase from 'firebase';
import { debounce } from 'ts-debounce';
import { IconButton } from '.';
import { LikeIcon } from '../Icons/LikeIcon';
import {
  Likeable,
  BaseDocument,
  UserInfo,
  DocumentId,
  Like,
  NewLikeDocument,
  UID,
  Authorable,
  UserClaims,
} from '../../types';
import { firestore } from '../../firebase';

type LikeButtonProps = {
  likeableDocument: Likeable & BaseDocument & Authorable;
  likeableDocumentType: 'Post' | 'Comment';
  likes?: Map<UID, Like>;
  pageId: DocumentId;
  userInfo: UserInfo | null;
  userClaims: UserClaims | undefined;
};

const initialState = { modifier: 0 };
type LikeButtonState = Readonly<typeof initialState>;

export class LikeButton extends React.PureComponent<
  LikeButtonProps,
  LikeButtonState
> {
  readonly state: LikeButtonState = initialState;

  componentDidUpdate(prevProps: LikeButtonProps) {
    if (this.props.likeableDocument !== prevProps.likeableDocument) {
      this.setState(() => ({ modifier: 0 }));
    }
  }

  render() {
    return (
      <IconButton
        onClick={debounce(this.onLikeClick, 1000, { isImmediate: true })}
        Icon={LikeIcon}
        color={
          this.isLikedByCurrentUser(this.props.likeableDocument.ref.id)
            ? 'primary'
            : 'default'
        }
        label="Líka við þessa færslu"
        disabled={
          this.props.userInfo
            ? this.props.likeableDocument.authorUid === this.props.userInfo.uid
            : false
        }
      >
        <span>
          {this.props.likeableDocument.numberOfLikes + this.state.modifier}
        </span>
      </IconButton>
    );
  }
  private onLikeClick = () => {
    if (
      this.props.userInfo === undefined ||
      !this.props.userClaims ||
      !this.props.userClaims.username
    ) {
      return;
    }
    if (this.props.userInfo === null) {
      return; // ToDo: Login modal?
    }
    const currentUserDocumentLike = this.getCurrentUserLikeForDocument(
      this.props.likeableDocument.ref.id,
    );
    if (currentUserDocumentLike) {
      firestore
        .collection('likes')
        .doc(currentUserDocumentLike.id)
        .delete()
        .then(() => {
          this.setState(() => ({ modifier: -1 }));
        })
        .catch(reason => {
          console.log('Like delete reject', reason);
        });
    } else {
      const newLike: NewLikeDocument = {
        authorName: this.props.userInfo.displayName,
        authorUsername: this.props.userClaims.username,
        authorUid: this.props.userInfo.uid,
        authorPhotoURL: this.props.userInfo.photoURL,
        dateOfCreation: firebase.firestore.FieldValue.serverTimestamp(),
        documentRef: this.props.likeableDocument.ref,
        documentType: this.props.likeableDocumentType,
        pageIds: { [this.props.pageId]: true },
      };
      firestore
        .collection('likes')
        .add(newLike)
        .then(() => {
          this.setState(() => ({ modifier: 1 }));
        })
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
