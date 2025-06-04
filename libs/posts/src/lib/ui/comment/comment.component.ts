import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {AvatarCircleComponent} from '@tt/common-ui';
import {PostComment} from '../../data';

@Component({
    selector: 'app-comment',
    imports: [AvatarCircleComponent, DatePipe],
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
  comment = input<PostComment>();
}
