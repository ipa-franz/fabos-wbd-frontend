import { TestBed } from '@angular/core/testing';

import { AasWebsocketService } from './aas-websocket.service';

describe('AasWebsocketService', () => {
  let service: AasWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AasWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
