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
//
//       return this.#socket.asObservable()
//
//         .pipe(
//           tap(message => params.handleMessage(message)),
//           finalize(() => console.log('А чо это вы тут делаете?'))
//         )
//     }
//
//
//     return this.#socket.asObservable(); // 🟢 Добавить возврат, если сокет уже существует
//   }
//
//   disconnect(): void {
//     this.#socket?.complete()
//   }
//
//   sendMessage(text: string, chatId: number): void {
//     this.#socket?.next({
//       text,
//       chat_id: chatId
//     })
//   }
//
// }

import { catchError, switchMap, throwError } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { finalize, Observable, tap } from 'rxjs';
import { ChatConnectionWsParams, ChatWsService } from './chat-ws-service.interface';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { ChatWsMessage } from './chat-ws-message.interface';
import { AuthService } from '@tt/data-access'; // Импорт AuthService

export class ChatWsRxjsService implements ChatWsService {
  #socket: WebSocketSubject<ChatWsMessage> | null = null;

  constructor(private authService: AuthService) {} // Добавляем AuthService через конструктор

  connect(params: ChatConnectionWsParams): Observable<ChatWsMessage> {

    if (this.#socket) {
      this.#socket.complete();
    }

    this.#socket = webSocket({
      url: params.url,
      protocol: [params.token],
    });

    return this.#socket.asObservable()
      .pipe(
      tap(message => params.handleMessage(message)), // Обрабатываем входящие сообщения
      catchError(error => {
        if (error.status === 401) {
          return this.authService.refreshAuthToken()
            .pipe(
            switchMap(newToken => {
              params.token = newToken;
              return this.connect(params);
            }),
            catchError(refreshError => {
              this.authService.logout();
              return throwError(refreshError);
            })
          );
        }

        return throwError(error);
      }),
      finalize(() => console.log('Закрыто'))
    );
  }

  disconnect(): void {
    this.#socket?.complete();
  }

  sendMessage(text: string, chatId: number): void {
    this.#socket?.next({
      text,
      chat_id: chatId,
    });
  }
}
