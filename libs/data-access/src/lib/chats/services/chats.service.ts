import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {ProfileService} from 'libs/profile/src';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import { ChatWsService } from '../interfaces/chat-ws-service.interface';
import { ChatWsMessage } from '../interfaces/chat-ws-message.interface';
import { isNewMessage, isUnreadMessage } from '../interfaces/type-guards';
import { ChatWsRxjsService } from '../interfaces/chat-ws-rxjs.service';
import { AuthService } from '@tt/data-access';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  #authService = inject(AuthService)
  me = inject(ProfileService).me;

  wsAdapter: ChatWsService = new ChatWsRxjsService()
    // new ChatWsNativeService()

  activeChatMessages = signal<Message[]>([]);

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$: Observable<number> = this.unreadCountSubject.asObservable();

  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  chatsUrl = `${this.baseApiUrl}chat/`;
  messageUrl = `${this.baseApiUrl}message/`;

  connectWs() {
    // return
    return this.wsAdapter.connect({
      url: `${this.baseApiUrl}chat/ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWsMessage
    }) as Observable<ChatWsMessage>
    // as obs
  }

  handleWsMessage = (message: ChatWsMessage) => {
    console.log('Received WS message:', message);
    if (!('action' in message)) return

    if (isUnreadMessage(message)) {
      console.log('Unread message, count:', message.data.count);
      this.unreadCountSubject.next(message.data.count)
      // TODO
      // message.data.
    }

    if (isNewMessage(message)) {
      console.log('New message received:', message.data);
      this.activeChatMessages.set([
        ...this.activeChatMessages(),
        {
          id: message.data.id,
          userFromId: message.data.author,
          personalChatId: message.data.chat_id,
          text: message.data.message,
          createdAt: message.data.created_at,
          isRead: false,
          isMine: false
        }
      ])
    }
  }

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          };
        });

        this.activeChatMessages.set(patchedMessages);

        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()!.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
        };
      })
    );
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    );
  }
}
