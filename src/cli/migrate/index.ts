#!/usr/bin/env node

import { PublicUserInfo, AuthorableDocument } from '../../types';
import { adminFirestore } from '../firebase-admin';
import chalk from 'chalk';
import * as ora from 'ora';

export async function migrate() {
  console.log(chalk.yellow('=========*** mb-cli migration ***=========='));
  const fetchPublicUserInfos = adminFirestore
    .collection('publicUserInfos')
    .get();
  ora.promise(fetchPublicUserInfos, 'Fetching user infos');
  const userInfosSnapshots = await fetchPublicUserInfos;
  console.log(chalk.green(`Fetched ${userInfosSnapshots.size} user infos`));
  const uidUsernameMap = new Map<string, string>();
  userInfosSnapshots.docs.forEach(s => {
    const ui = s.data() as PublicUserInfo;
    uidUsernameMap.set(ui.uid, ui.username);
  });

  const fetchPostsPromise = adminFirestore.collection('posts').get();
  const fetchLikesPromise = adminFirestore.collection('likes').get();
  const fetchCommentsPromise = adminFirestore.collection('comments').get();
  const fetchAuthorablePromise = Promise.all([
    fetchPostsPromise,
    fetchLikesPromise,
    fetchCommentsPromise,
  ]);
  ora.promise(fetchAuthorablePromise, 'Fetching authorables');
  const [
    postsSnapshots,
    likesSnapshot,
    commentsSnapshots,
  ] = await fetchAuthorablePromise;
  console.log(chalk.green(`Fetched ${postsSnapshots.size} posts`));
  console.log(chalk.green(`Fetched ${likesSnapshot.size} likes`));
  console.log(chalk.green(`Fetched ${commentsSnapshots.size} comments`));
  const batch = adminFirestore.batch();
  [
    ...postsSnapshots.docs,
    ...likesSnapshot.docs,
    ...commentsSnapshots.docs,
  ].forEach(s => {
    const authorable = s.data() as AuthorableDocument;
    const update: Partial<AuthorableDocument> = {
      authorUsername: uidUsernameMap.get(authorable.authorUid),
    };
    batch.update(s.ref, update);
  });
  const batchCommitPromise = batch.commit();
  ora.promise(batchCommitPromise, 'Writing updates');
  const batchWriteResult = await batchCommitPromise;
  console.log(chalk.green(`Updateed ${batchWriteResult.length} documents`));
}
