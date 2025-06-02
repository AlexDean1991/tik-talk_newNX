// import { ChatConnectionWsParams, ChatWsService } from './chat-ws-service.interface';
// import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
// import { ChatWsMessage } from './chat-ws-message.interface';
// import { webSocket } from 'rxjs/webSocket';
// import { finalize, Observable, Subject, tap } from 'rxjs';
//
// export class ChatWsRxjsService implements ChatWsService {
//
//   // #messageBox = new Subject<ChatWsMessage>();
//   // #currentToken: string;
//   // #isDisconnected: false;
//
//   #socket: WebSocketSubject<ChatWsMessage> | null = null;
//
//   connect(params: ChatConnectionWsParams): Observable<ChatWsMessage> {
//
//     if (!this.#socket) {
//       this.#socket = webSocket({
//         url: params.url,
//         protocol: [params.token]
//       })
//       return this.#socket.asObservable()
//         .pipe(
//           tap(message => params.handleMessage(message)),
//           finalize(() => console.log('А чо это вы тут делаете?'))
//         )
//     }
//
//
//     return this.#socket.asObservable(); // 🟢 Добавить возврат, если сокет уже существует
//
//   }
//
//   disconnect(): void {
//
//     this.#socket?.complete()
//   }
//
//   sendMessage(text: string, chatId: number): void {
//
//     this.#socket?.next({
//       text,
//       chat_id: chatId
//     })
//   }
//
// }

import { ChatConnectionWsParams, ChatWsService } from './chat-ws-service.interface';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { ChatWsMessage } from './chat-ws-message.interface';
import { webSocket } from 'rxjs/webSocket';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '@tt/data-access';


export class ChatWsRxjsService implements ChatWsService {
  #authService = inject(AuthService);
  #socket: WebSocketSubject<ChatWsMessage> | null = null;
  #currentParams: ChatConnectionWsParams | null = null;

  connect(params: ChatConnectionWsParams): Observable<ChatWsMessage> {
    if (!this.#socket) {
      this.#currentParams = params;
      this.#socket = webSocket({
        url: params.url,
        protocol: [params.token],
        closeObserver: {
          next: () => {
            console.log('Соединение закрыто сервером');
            this.#socket = null;
            this.#authService.refreshAuthToken().subscribe({
              next: () => this.reconnectWs(),
              error: (err) => console.error('Ошибка', err),
            });
          },
        },
      });

      return this.#socket.asObservable().pipe(
        tap((message) => params.handleMessage(message)),
        finalize(() => {
          console.log('Соединение');
        })
      );
    }
    return this.#socket.asObservable();
  }

  sendMessage(text: string, chatId: number): void {
    if (!this.#socket) {
      console.error('WebSocket не подключен');
      return;
    }

    this.#socket.next({ text, chat_id: chatId });

    this.#socket.pipe(
      catchError((error) => {
        if (error.message?.includes('Invalid-token')) {
          this.#authService.refreshAuthToken().subscribe({
            next: () => {
              this.reconnectWs();
              this.#socket?.next({ text, chat_id: chatId }); // Повторяем отправку
            },
            error: (err) => console.error('Ошибка при обновлении токена:', err),
          });
        }
        return throwError(error);
      })
    ).subscribe();
  }

  disconnect(): void {
    this.#socket?.complete();
    this.#socket = null;
    this.#currentParams = null;
  }


  private reconnectWs(): void {
    if (this.#currentParams) {
      this.disconnect();
      this.connect({
        ...this.#currentParams,
        token: this.#authService.token ?? '',
      });
    }
  }
}
