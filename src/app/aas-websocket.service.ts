import { Injectable, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AasWebsocketService {
  private socket!: WebSocket;
  private serverUrl = 'ws://localhost:8765'; 

  resultId: number = 0;
  /** used as return value for observable */
  @Input() calc: any = null;
  /** Observable Item sources as BehaviorSubject of calc */
  private _calcSource = new BehaviorSubject(this.calc);
  /** Observable Item stream which converts _calcSource to an Observable (which other Components can subscribe to) */
  calcItem$ = this._calcSource.asObservable();

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    this.socket = new WebSocket(this.serverUrl);
    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };
    this.socket.onmessage = (event) => {
      // const data = JSON.parse(event.data);
      // Process received data
      // console.log('Received data:', data);
      console.log('Received data:', event.data);

      if (event.data == "result")
      {
        this.resultId = this.resultId + 1;
        this._calcSource.next(this.resultId);
      }
      if (event.data == "selected")
      {
        this._calcSource.next("selected");
      }
    };
    this.socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  public send(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn('WebSocket connection is not open.');
    }
  }

  public close(): void {
    this.socket.close();
  }
}