import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HtmlDirective } from './html.directive';


import { MainModule } from './main/main.module';
import { HtmlModule } from './html/html.module';


import { RestService } from './rest.service';
import { ComponentGeneratorService } from './component-generator.service';



@NgModule({
  declarations: [
    AppComponent,
    HtmlDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    MainModule,
    HtmlModule,
  ],
  providers: [RestService, ComponentGeneratorService],
  bootstrap: [AppComponent]
})

export class AppModule { 

}
