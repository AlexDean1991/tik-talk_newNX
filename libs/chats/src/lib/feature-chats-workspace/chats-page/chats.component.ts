import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChatsListComponent} from '../chats-list/chats-list.component';
import { ChatsService } from '@tt/chats';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-chats',
    imports: [RouterOutlet, ChatsListComponent],
    templateUrl: './chats.component.html',
    styleUrl: './chats.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsPageComponent {
  #chatService = inject(ChatsService);
  #destroyRef = inject(DestroyRef)

  constructor() {
    this.#chatService.connectWs()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe()
  }
}

