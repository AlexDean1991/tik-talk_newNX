import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, switchMap, tap } from 'rxjs';
import {
  CommentCreateDto,
  Post,
  PostComment,
  PostCreateDto,
} from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';


  createPost(payload: PostCreateDto) {
    return this.#http.post<Post>(`${this.baseApiUrl}post/`, payload);
  }

  fetchPosts() {
    return this.#http.get<Post[]>(`${this.baseApiUrl}post/`); // Убрали сигнал
  }

  createComment(payload: CommentCreateDto) {
    return this.#http.post<PostComment>(`${this.baseApiUrl}comment/`, payload);
  }

  getCommentsByPostId(postId: number) {
    return this.#http
      .get<Post>(`${this.baseApiUrl}post/${postId}`)
      .pipe(map((res) => res.comments));
  }
}
