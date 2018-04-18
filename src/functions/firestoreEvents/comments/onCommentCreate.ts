import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  mapDocument,
  UserMeta,
  CommentDocument,
  PostDocument,
  Post,
} from '../../../types';

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
      addCommentAuthorToSubscribers(postRef, newComment),
      sendNotifications(postRef, newComment),
    ]);
  });

const updateNumberOfComments = (
  postRef: admin.firestore.DocumentReference,
  newComment: CommentDocument,
) =>
  admin.firestore().runTransaction(async transaction => {
    const postSnapshot = await transaction.get(postRef);
    if (!postSnapshot.exists) {
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

const sendNotifications = async (
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
  const userMetaDocuments = await Promise.all(
    subscribers.map(s =>
      admin
        .firestore()
        .collection('userMetas')
        .doc(s)
        .get()
        .then(val => {
          if (!val.exists) {
            return undefined;
          }
          return { ...val.data(), uid: val.id } as UserMeta;
        }),
    ),
  );
  const messagingTokens = userMetaDocuments.reduce((acc, val) => {
    if (val === undefined || val.uid === newComment.authorUid) {
      return acc;
    }
    val.messagingTokens.map(t => t.token).forEach(i => acc.add(i));
    return acc;
  }, new Set<string>());
  if (messagingTokens.size === 0) {
    return;
  }
  return admin
    .messaging()
    .sendToDevice(Array.from(messagingTokens.values()), message)
    .then(r => {
      // Response is a message ID string.
      console.log('Successfully sent message:', r);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
};

const addCommentAuthorToSubscribers = (
  postRef: admin.firestore.DocumentReference,
  newComment: CommentDocument,
) => {
  return postRef
    .collection('subscribers')
    .doc(newComment.authorUid)
    .set({});
};
