import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class loginSignupService {
  constructor(private http: HttpClient, private router: Router) {}

  private authToken = '';
  private userId = '';
  private isAdmin!: boolean;
  isAuth$ = new BehaviorSubject<boolean>(false);

  getIsAuth() {
    return this.isAuth$.value;
  }

  getUserId() {
    return this.userId;
  }

  getToken() {
    return this.authToken;
  }
  getUserAdmin() {
    return this.isAdmin;
  }

  userSignUp(name: string, email: string, password: string, isAdmin: boolean) {
    console.log('Utilisateur enregistrer');
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/auth/signup`,
      { name: name, email: email, password: password, isAdmin: isAdmin }
    );
  }

  userLogin(email: string, password: string, isAdmin: boolean) {
    return this.http
      .post<{
        userId: string;
        isAdmin: boolean;
        token: string;
      }>(`${environment.apiUrl}/auth/login`, {
        email: email,
        password: password,
        isAdmin: isAdmin,
      })
      .pipe(
        tap(({ userId, token, isAdmin }) => {
          console.log('Utilisateur connecté');
          this.userId = userId;
          this.authToken = token;
          this.isAdmin = isAdmin;
          //enregistrer le token dans le local storage
          localStorage.setItem('token', this.authToken);

          this.isAuth$.next(true);
          console.log(this.isAuth$);
          this.router.navigateByUrl('/posts');
        })
      );
  }

  //deconnexion via bouton header
  userLogout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    localStorage.clear();
    this.router.navigateByUrl('');
    console.log('utilisateur deconnecté');
  }
}
