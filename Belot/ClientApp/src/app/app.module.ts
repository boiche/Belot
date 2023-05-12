import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { MainScene } from './scenes/main-scene';
import SignalRProxy from './server-api/proxies/signalRProxy';
import BelotProxy from './server-api/proxies/belotProxy';
import LoginComponent from './shared/auth/login/login.component';
import { RegisterComponent } from './shared/auth/register/register.component';
import { ForgotPasswordComponent } from './shared/auth/forgot-password/forgot-password.component';
import { AppRoutingModule } from './app-routing.module';
import { FooterMenuComponent } from './shared/footer-menu/footer-menu.component';
import { NavMenuComponent } from './shared/nav-menu/nav-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    FooterMenuComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    TableModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    SignalRProxy,
    BelotProxy
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
