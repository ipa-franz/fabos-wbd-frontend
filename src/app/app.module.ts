import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AasWebsocketService } from './aas-websocket.service';
import { AssetAdministrationShellService } from 'src/swagger-typescript';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    AasWebsocketService,
    AssetAdministrationShellService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
