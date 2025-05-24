import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { postsActions } from './actions';
import { PostService } from '../services/post.service';

@Injectable({ providedIn: 'root' })
export class PostsEffects {
  private actions$ = inject(Actions);
  private postService = inject(PostService);

  // Эффект загрузки постов
  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(postsActions.loadPosts),
      tap(() => console.log('[Effect] Load Posts Started')),
      switchMap(() =>
        this.postService.fetchPosts().pipe(
          tap((posts) => console.log('[Effect] Posts Received:', posts)),
          map((posts) => postsActions.loadPostsSuccess({ posts })),
          catchError((error) => {
            console.error('[Effect] Load Posts Error:', error);
            return of(postsActions.loadPostsFailure({ error: error.message }))
          })
        )
      )
    )
  );

  // Эффект создания поста
  createPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(postsActions.createPost),
      tap(({ dto }) => console.log('[Effect] Create Post Started:', dto)),
      mergeMap(({ dto }) =>
        this.postService.createPost(dto).pipe(
          tap((post) => console.log('[Effect] Post Created:', post)),
          map((post) => postsActions.createPostSuccess({ post })),
          catchError((error) => {
            console.error('[Effect] Create Post Error:', error);
            return of(postsActions.createPostFailure({ error: error.message }))
          })
        )
      )
    )
  );

  // Эффект создания комментария
  createComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(postsActions.createComment),
      tap(({ dto }) => console.log('[Effect] Create Comment Started:', dto)),
      mergeMap(({ dto }) =>
         this.postService.createComment(dto).pipe(
          tap((comment) => console.log('[Effect] Comment Created:', comment)),
          map((comment) => postsActions.createCommentSuccess({ comment })),
          catchError((error) => {
            console.error('[Effect] Create Comment Error:', error);
            return of(postsActions.createCommentFailure({ error: error.message }))
          })
        )
      )
    )
  );
}
