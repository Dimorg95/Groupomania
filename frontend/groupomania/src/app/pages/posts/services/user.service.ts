import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class userService {
  constructor(private http: HttpClient) {}

  //Recupération d'un seul User
  getOneUser(userId: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/${userId}`);
  }
}
