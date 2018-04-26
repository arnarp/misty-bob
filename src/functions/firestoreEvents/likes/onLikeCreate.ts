import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { LikeDocument, PostDocument, CommentDocument } from '../../../types';
import { updateNumberOfLikes } from './updateNumberOfLikes';
import { sendNotifications } from '../../utils/sendNotifications';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendLikeNotification(
  likeRef: admin.firestore.DocumentReference,
) {
  await sleep(5000);
  const likeSnapshot = await likeRef.get();
  if (likeSnapshot.exists === false) {
    return;
  }
  const likeDocument = likeSnapshot.data() as LikeDocument;
  const likedDocumentSnapshot = await admin
    .firestore()
    .doc(likeDocument.documentRef.path)
    .get();
  if (likedDocumentSnapshot.exists === false) {
    return;
  }
  const likedPostDocument =
    likeDocument.documentType === 'Post'
      ? (likedDocumentSnapshot.data() as PostDocument)
      : undefined;
  const likedCommentDocument =
    likeDocument.documentType === 'Comment'
      ? (likedDocumentSnapshot.data() as CommentDocument)
      : undefined;
  let body = '';
  let postId = '';
  let likedAuthorId = '';
  if (likedPostDocument) {
    body = likedPostDocument.title;
    postId = likedDocumentSnapshot.id;
    likedAuthorId = likedPostDocument.authorUid;
  }
  if (likedCommentDocument) {
    body = likedCommentDocument.content.blocks.map(i => i.text).join(' ');
    postId = likedCommentDocument.postId;
    likedAuthorId = likedCommentDocument.authorUid;
  }
  const notification: admin.messaging.MessagingPayload = {
    notification: {
      title: `${likeDocument.authorName} líkar við ${
        likeDocument.documentType === 'Post'
          ? 'innlegg þitt'
          : 'athugasemd þína'
      }`,
      body,
      clickAction: `https://misty-bob.firebaseapp.com/d/${postId}`,
    },
  };
  return sendNotifications(
    [likedAuthorId],
    notification,
    meta => meta.pushNotifications.likes === 'all',
    likeDocument,
  );
}

export const onLikeCreate = firestore
  .document('likes/{likeId}')
  .onCreate(snapshot => {
    const like = snapshot.data() as LikeDocument;
    return Promise.all([
      updateNumberOfLikes(like, 1),
      sendLikeNotification(snapshot.ref),
    ]);
  });
