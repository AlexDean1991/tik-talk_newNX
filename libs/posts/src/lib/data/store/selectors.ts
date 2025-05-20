import { createSelector } from '@ngrx/store';
import { postsFeature } from './reducer';

export const selectAllPosts = createSelector(
  postsFeature.selectPosts,
  (posts) => {
    console.log('Selector: current posts:', posts); // Логирование
    return posts;
  }
);

export const selectPostsLoading = createSelector(
  postsFeature.selectLoading,
  loading => loading
);

export const selectPostById = (postId: number) =>
  createSelector(
    selectAllPosts,
    posts => posts.find(p => p.id === postId)
  );
