import {AsyncPipe, NgForOf} from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ImgUrlPipe, SvgIconComponent} from '@tt/common-ui';
import {PostFeedComponent} from '@tt/posts';
import {switchMap} from 'rxjs';
import {ProfileService} from '../../../../../data-access/src/lib/profile';
import {ProfileHeaderComponent} from '../../ui';

@Component({
    selector: 'app-profile-page',
    imports: [
        ProfileHeaderComponent,
        AsyncPipe,
        SvgIconComponent,
        RouterLink,
        ImgUrlPipe,
        PostFeedComponent,
    ],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  me$ = toObservable(this.profileService.me);
  subcribers$ = this.profileService.getSubscribersShortList(5);

  isMyPage = signal(false);

  constructor() {
    console.log('PROFILE PAGE')
  }

  profile$ = this.route.params.pipe(
    switchMap(({id}) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
      if (id === 'me') return this.me$;

      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(userId: number) {
    this.router.navigate(['/chats', 'new'], {queryParams: {userId}});
  }
}
