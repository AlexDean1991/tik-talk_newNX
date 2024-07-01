import {AsyncPipe, NgForOf} from '@angular/common';
import {Component, inject, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ImgUrlPipe, SvgIconComponent} from '@tt/common-ui';
import {PostFeedComponent} from '@tt/posts';
import {ProfileService} from '@tt/profile';
import {delay, exhaust, exhaustMap, firstValueFrom, map, mergeMap, of, switchMap, take, tap, timer} from 'rxjs';
import {ProfileHeaderComponent} from '../../common-ui/profile-header/profile-header.component';
import {ChatsService} from '../../data/services/chats.sertvice';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    NgForOf,
    ImgUrlPipe,
    PostFeedComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  chatsService = inject(ChatsService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  me$ = toObservable(this.profileService.me);
  subcribers$ = this.profileService.getSubscribersShortList(5);

  isMyPage = signal(false);

  constructor() {
    console.log('PROFILE PAGE')
    const innerObs = timer(0, 1000)
      .pipe(
        take(7)
      )

    innerObs.pipe(
      exhaustMap((res) => {
        return timer(5000)
          .pipe(
            map(v => res),
            take(2))
      })
    ).subscribe(res => {
      console.log(res)
    })
  }

  profile$ = this.route.params.pipe(
    switchMap(({id}) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
      if (id === 'me') return this.me$;

      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(userId: number) {
    firstValueFrom(this.chatsService.createChat(userId)).then((res) => {
      this.router.navigate(['/chats', res.id]);
    });
  }
}
