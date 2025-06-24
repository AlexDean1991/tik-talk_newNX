import { AsyncPipe, CommonModule, JsonPipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {ImgUrlPipe, SvgIconComponent} from '@tt/common-ui';
import {ProfileService} from '@tt/profile';
import { firstValueFrom, Observable } from 'rxjs';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { ChatsService } from '@tt/chats';

@Component({
    selector: 'app-sidebar',
    imports: [
        CommonModule,
        SvgIconComponent,
        NgForOf,
        SubscriberCardComponent,
        AsyncPipe,
        RouterLink,
        ImgUrlPipe,
        RouterLinkActive,
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  profileService = inject(ProfileService);
  subcribers$ = this.profileService.getSubscribersShortList();
  unreadCount$: Observable<number>

  me = this.profileService.me;

  constructor(private chatsService: ChatsService) {
    this.unreadCount$ = this.chatsService.unreadCount$
  }

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
    {
      label: 'Моя форма',
      icon: '',
      link: 'exp-form',
    },
  ];


  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
    this.chatsService.connectWs().subscribe()
  }
}
