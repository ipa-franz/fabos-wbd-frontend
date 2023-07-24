import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AasWebsocketService } from './aas-websocket.service';
import { AssetAdministrationShellService } from 'src/swagger-typescript';
import { TwoDigitsDirectiveDirective } from './two-digits-directive.directive';

@NgModule({
  declarations: [
    AppComponent,
    TwoDigitsDirectiveDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    AasWebsocketService,
    AssetAdministrationShellService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
