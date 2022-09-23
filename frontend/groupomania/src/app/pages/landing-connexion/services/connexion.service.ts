import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class loginSignupService {
  constructor(private http: HttpClient) {}

  private authToken = '';
  private userId = '';
  isAuth$ = new BehaviorSubject<boolean>(false);

  getUserId() {
    return this.userId;
  }

  getToken() {
    return this.authToken;
  }

  userSignUp(name: string, email: string, password: string) {
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/auth/signup`,
      { name: name, email: email, password: password }
    );
  }

  userLogin(email: string, password: string) {
    return this.http
      .post<{
        // userName: string;
        // userEmail: string;
        userId: string;
        // isAdmin: boolean;
        token: string;
      }>(`${environment.apiUrl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        tap(({ userId, token }) => {
          this.userId = userId;
          this.authToken = token;
          this.isAuth$.next(true);
        })
      );
  }
}
