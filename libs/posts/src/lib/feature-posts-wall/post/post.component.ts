import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import { firstValueFrom } from 'rxjs';
import {Post, PostComment, PostService} from '../../data';
import {CommentComponent, PostInputComponent} from '../../ui';

@Component({
    selector: 'app-post',
    imports: [
        AvatarCircleComponent,
        DatePipe,
        SvgIconComponent,
        PostInputComponent,
        CommentComponent,
    ],
    templateUrl: './post.component.html',
    styleUrl: './post.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {
  post = input<Post>();
  comments = signal<PostComment[]>([]);
  postService = inject(PostService);

  async ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCreated() {
    const comments = await firstValueFrom(
      this.postService.getCommentsByPostId(this.post()!.id)
    );
    this.comments.set(comments);
  }
}
