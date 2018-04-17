#!/usr/bin/env node

import { mapDocument, Post, CommentDocument } from '../../types';
import { adminFirestore } from '../firebase-admin';
import chalk from 'chalk';
import * as ora from 'ora';

export async function migrate(migration: string) {
  console.log(chalk.yellow('=========*** mb-cli migration ***=========='));
  const fetchPostsPromise = adminFirestore.collection('posts').get();
  ora.promise(fetchPostsPromise, 'Fetching posts');
  const postsSnapshots = await fetchPostsPromise;
  const posts = postsSnapshots.docs.map(d => mapDocument<Post>(d as any));
  const fetchCommentsPromise = Promise.all(
    posts.map(p =>
      adminFirestore
        .collection('posts')
        .doc(p.id)
        .collection('comments')
        .get()
        .then(v =>
          v.docs.map(d => {
            return {
              id: d.id,
              comment: { ...d.data(), postId: p.id } as CommentDocument,
            };
          }),
        ),
    ),
  );
  ora.promise(fetchCommentsPromise, 'Fetching comments');
  const cA = await fetchCommentsPromise;
  const batch = adminFirestore.batch();
  cA.forEach(v => {
    v.forEach(i =>
      batch.set(adminFirestore.collection('comments').doc(i.id), i.comment),
    );
  });
  const commitPromise = batch.commit();
  ora.promise(commitPromise, 'Committing changes');
  await commitPromise;
}
