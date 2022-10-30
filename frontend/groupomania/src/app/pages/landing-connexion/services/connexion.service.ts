import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserModelId } from '../../posts/models/userId.model';
@Injectable({
  providedIn: 'root',
})
export class loginSignupService {
  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    this.isAuth$.next(!!token);
  }

  user!: UserModelId;

  private authToken = '';
  private userId = '';
  private isAdmin!: boolean;

  //A la connexion il passe a true et maintient le status du toute les pages
  //jusqu'au logout ou expiration de session
  isAuth$ = new BehaviorSubject<boolean>(false);

  getIsAuth() {
    return this.isAuth$.value;
  }

  getToken() {
    return this.authToken;
  }

  token = JSON.stringify(localStorage.getItem('token'));

  //Recuperation de l'id de l'utilisateur
  getUserIdFromToken(token: string): UserModelId {
    return JSON.parse(atob(token.split('.')[1]));
  }

  //Enregistrement de l'utilisateur
  userSignUp(name: string, email: string, password: string, isAdmin: boolean) {
    console.log('Utilisateur enregistrer');
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/auth/signup`,
      { name: name, email: email, password: password, isAdmin: isAdmin }
    );
  }

  //Connexion de l'utilisateur
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
          //isAuth$ qui passe a true
          this.isAuth$.next(true);
          this.user = this.getUserIdFromToken(token);
          this.router.navigateByUrl('/posts');
        })
      );
  }

  //Deconnexion via bouton header
  userLogout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    localStorage.clear();
    this.router.navigateByUrl('/login');
    console.log('utilisateur deconnecté');
  }

  //Utilisés pour gerer le token expirer
  isTokenExpired(token: string) {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return expiry * 1000 < Date.now();
  }
}
