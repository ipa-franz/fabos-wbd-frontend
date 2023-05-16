import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AasWebsocketService {
  private socket!: WebSocket;
  private serverUrl = 'ws://localhost:8081:4001'; // Replace with your server URL

  constructor() {
    // do not init the websocket
    //this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    this.socket = new WebSocket(this.serverUrl);
    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Process received data
      console.log('Received data:', data);
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