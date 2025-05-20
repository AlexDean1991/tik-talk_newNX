import { createFeature, createReducer, on } from '@ngrx/store';
import { postsActions } from './actions';
import { Post } from '../interfaces/post.interface';


export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null
};

export const postsFeature = createFeature({
  name: 'posts',
  reducer: createReducer(
    initialState,

    // Загрузка постов
    on(postsActions.loadPosts, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(postsActions.loadPostsSuccess, (state, { posts }) => {
      console.log('Reducer: updating posts state'); // Логирование
      return { ...state, posts };
    }),
    on(postsActions.loadPostsFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false
    })),

    // Создание поста
    on(postsActions.createPost, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(postsActions.createPostSuccess, (state, { post }) => ({
      ...state,
      posts: [post, ...state.posts],
      loading: false
    })),
    on(postsActions.createPostFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false
    })),

    // Создание комментария
    on(postsActions.createCommentSuccess, (state, { comment }) => {
      const updatedPosts = state.posts.map(post => {
        if(post.id === comment.postId) {
          return {
            ...post,
            comments: [...post.comments, comment]
          };
        }
        return post;
      });

      return {
        ...state,
        posts: updatedPosts,
        loading: false
      };
    })
  )
});
