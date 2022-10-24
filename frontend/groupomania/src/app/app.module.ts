import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './pages/landing-connexion/components/login/login.component';
import { SignUpComponent } from './pages/landing-connexion/components/sign-up/sign-up.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { loginSignupService } from './pages/landing-connexion/services/connexion.service';
import { httpInterceptorProviders } from './interceptors';
import { PostListComponent } from './pages/posts/components/post-list/post-list.component';
import { PostComponent } from './pages/posts/components/post-item/post.component';
import { NewPostComponent } from './pages/posts/components/new-post/new-post.component';
import { PostService } from './pages/posts/services/post.service';
import * as fr from '@angular/common/locales/fr';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SignUpComponent,
    LoginComponent,
    PostListComponent,
    PostComponent,
    NewPostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    loginSignupService,
    PostService,
    httpInterceptorProviders,
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}
