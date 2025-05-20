import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CommentCreateDto, Post, PostComment, PostCreateDto } from '../interfaces/post.interface';

export const postsActions = createActionGroup({
  source: 'Posts',
  events: {
    // Загрузка постов
    'Load Posts': emptyProps(),
    'Load Posts Success': props<{ posts: Post[] }>(),
    'Load Posts Failure': props<{ error: string }>(),

    // Создание поста
    'Create Post': props<{ dto: PostCreateDto }>(),
    'Create Post Success': props<{ post: Post }>(),
    'Create Post Failure': props<{ error: string }>(),

    // Создание комментария
    'Create Comment': props<{ dto: CommentCreateDto }>(),
    'Create Comment Success': props<{ comment: PostComment }>(),
    'Create Comment Failure': props<{ error: string }>(),
  }
});
