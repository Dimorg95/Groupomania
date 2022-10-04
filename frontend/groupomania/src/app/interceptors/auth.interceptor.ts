import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginSignupService } from '../pages/landing-connexion/services/connexion.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private connect: loginSignupService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.connect.getToken()
      ? this.connect.getToken()
      : localStorage.getItem('token');
    const headers = new HttpHeaders().append(
      'Authorization',
      `Bearer ${authToken}`
    );
    const modifyReq = req.clone({ headers });
    return next.handle(modifyReq);
  }
}
