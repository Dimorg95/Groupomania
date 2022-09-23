import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { LandingConnexionComponent } from './pages/landing-connexion/landing-connexion.component';
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
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingConnexionComponent,
    FooterComponent,
    SignUpComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [loginSignupService, httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
