import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  mapDocument,
  CommentDocument,
  PostDocument,
  Post,
} from '../../../types';
import { sendNotifications } from '../../utils/sendNotifications';

const updateNumberOfComments = (
  postRef: admin.firestore.DocumentReference,
  newComment: CommentDocument,
) =>
  admin.firestore().runTransaction(async transaction => {
    const postSnapshot = await transaction.get(postRef);
    if (!postSnapshot.exists || newComment.dateOfCreation === null) {
      return Promise.resolve();
    }
    const post = postSnapshot.data() as PostDocument;
    const postUpdate: Partial<PostDocument> = {
      numberOfComments: post.numberOfComments + 1,
      dateOfLastActivity:
        post.dateOfLastActivity > newComment.dateOfCreation
          ? post.dateOfLastActivity
          : newComment.dateOfCreation,
    };
    return transaction.update(postRef, postUpdate);
  });

const sendNewCommentNotifications = async (
  postRef: admin.firestore.DocumentReference,
  newComment: CommentDocument,
) => {
  const subscribers = await postRef
    .collection('subscribers')
    .get()
    .then(s => s.docs.map(d => d.id));
  const post = await postRef.get().then(s => mapDocument<Post>(s as any));
  const message: admin.messaging.MessagingPayload = {
    notification: {
      title: `${newComment.authorName} skrifaði ummæli við innlegg ${
        post.title
      }`,
      body: newComment.content.blocks.map(i => i.text).join(' '),
      clickAction: `https://misty-bob.firebaseapp.com/d/${post.id}`,
    },
  };
  return sendNotifications(
    subscribers,
    message,
    meta => meta.pushNotifications.comments === 'all',
    newComment,
  );
};
const addCommentAuthorToPostSubscribers = (
  postRef: admin.firestore.DocumentReference,
  newComment: CommentDocument,
) => {
  return postRef
    .collection('subscribers')
    .doc(newComment.authorUid)
    .set({});
};

export const onCommentCreate = firestore
  .document('/comments/{commentId}')
  .onCreate((snapshot, context) => {
    const newComment = snapshot.data() as CommentDocument;
    if (context === undefined) {
      return Promise.resolve();
    }
    const postRef = admin
      .firestore()
      .collection('posts')
      .doc(newComment.postId);
    if (postRef === null) {
      return Promise.resolve();
    }
    return Promise.all([
      updateNumberOfComments(postRef, newComment),
      addCommentAuthorToPostSubscribers(postRef, newComment),
      sendNewCommentNotifications(postRef, newComment),
    ]);
  });
