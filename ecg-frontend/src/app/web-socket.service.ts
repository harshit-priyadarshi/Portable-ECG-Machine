// web-socket.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<string>;

  constructor() {
    this.socket$ = webSocket('ws://localhost:8080');
  }

  public get messages$() {
    return this.socket$;
  }
}
