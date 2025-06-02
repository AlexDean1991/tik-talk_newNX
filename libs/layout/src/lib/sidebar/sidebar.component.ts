import { AsyncPipe, CommonModule, JsonPipe, NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
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
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
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
  ];

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
    this.chatsService.connectWs().subscribe()
  }
}
