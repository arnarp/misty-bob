import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CommentDocument, PostDocument } from 'src/types/Post';

export const onCommentCreate = firestore
  .document('posts/{postId}/comments/{commentId}')
  .onCreate((snapshot, context) => {
    const newComment = snapshot.data() as CommentDocument;
    console.log('onCommentCreated', newComment);
    if (context === undefined || context.params.postId === undefined) {
      return Promise.resolve();
    }
    const postRef = admin
      .firestore()
      .collection('posts')
      .doc(context.params.postId);
    if (postRef === null) {
      return Promise.resolve();
    }
    return admin.firestore().runTransaction(async transaction => {
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
      console.log('onCommentCreated', 'update', post.title, postUpdate);
      return transaction.update(postRef, postUpdate);
    });
  });
