import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CommentDocument, PostDocument } from 'src/types/Post';

export const onCommentCreated = firestore
  .document('posts/{postId}/comments/{commentId}')
  .onCreate(event => {
    const newComment = event.data.data() as CommentDocument;
    const postRef = event.data.ref.parent.parent;
    if (postRef === null) {
      return;
    }
    return admin.firestore().runTransaction(async transaction => {
      const postSnapshot = await transaction.get(postRef);
      if (!postSnapshot.exists) {
        return;
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
  });
