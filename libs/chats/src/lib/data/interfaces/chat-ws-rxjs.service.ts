import { ChatConnectionWsParams, ChatWsService } from './chat-ws-service.interface';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { ChatWsMessage } from './chat-ws-message.interface';
import { webSocket } from 'rxjs/webSocket';
import { finalize, Observable, Subject, tap } from 'rxjs';

export class ChatWsRxjsService implements ChatWsService {

  // #messageBox = new Subject<ChatWsMessage>();
  // #currentToken: string;
  // #isDisconnected: false;

  #socket: WebSocketSubject<ChatWsMessage> | null = null;

  connect(params: ChatConnectionWsParams): Observable<ChatWsMessage> {

    if (!this.#socket) {
      this.#socket = webSocket({
        url: params.url,
        protocol: [params.token]
      })
      return this.#socket.asObservable()
        .pipe(
          tap(message => params.handleMessage(message)),
          finalize(() => console.log('А чо это вы тут делаете?'))
        )
    }


    return this.#socket.asObservable(); // 🟢 Добавить возврат, если сокет уже существует

  }

  disconnect(): void {

    this.#socket?.complete()
  }

  sendMessage(text: string, chatId: number): void {

    this.#socket?.next({
      text,
      chat_id: chatId
    })
  }

}
