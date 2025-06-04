import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  input,
  Output,
  Renderer2
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import { Store } from '@ngrx/store';

import { CommentCreateDto, PostCreateDto } from '../../data/interfaces/post.interface';
import { postsActions } from '@tt/posts';
import { GlobalStoreService } from '@tt/data-access';

@Component({
    selector: 'app-post-input',
    imports: [AvatarCircleComponent, NgIf, SvgIconComponent, FormsModule],
    templateUrl: './post-input.component.html',
    styleUrl: './post-input.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostInputComponent {
  r2 = inject(Renderer2);
  store = inject(Store)

  isCommentInput = input(false);
  postId = input<number>(0);
  // @ts-ignore
  profile = inject(GlobalStoreService).me;

  @Output() created = new EventEmitter();

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput();
  }

  postText = '';

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }


  onCreatePost() {
    if (!this.postText.trim()) return;

    if (this.isCommentInput()) {
      const dto: CommentCreateDto = {
        text: this.postText,
        authorId: this.profile()!.id,
        postId: this.postId(),
      };

      this.store.dispatch(postsActions.createComment({ dto }));
    } else {
      const dto: PostCreateDto = {
        title: 'Новый пост', // Добавьте поле для заголовка в шаблоне
        content: this.postText,
        authorId: this.profile()!.id,
      };
      this.store.dispatch(postsActions.createPost({ dto }));
    }

    this.postText = '';
    this.created.emit();
  }
}
