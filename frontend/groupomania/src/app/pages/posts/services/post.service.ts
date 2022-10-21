import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  Observable,
  Subject,
  tap,
  throwError,
  of,
  switchMap,
  mapTo,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { loginSignupService } from '../../landing-connexion/services/connexion.service';
import { Post } from '../models/post.model';
import { UserModelId } from '../models/userId.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  //test
  posts$ = new Subject<Post[]>();
  token = '';
  infoFromToken!: UserModelId;

  constructor(private http: HttpClient, private connect: loginSignupService) {}

  //Exploitation du token pour récupérer l'UserId
  getUserId() {
    this.token = JSON.stringify(localStorage.getItem('token'));
    this.infoFromToken = this.connect.getUserIdFromToken(this.token);
    return this.infoFromToken.userId;
  }

  //Récupération de tous les Posts
  getAllPost(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts`).pipe(
      tap((post) => this.posts$.next(post)),
      catchError((error) => throwError(error.error.message))
    );
  }

  //Suppression d'un Post
  deletePost(id: string) {
    return this.http
      .delete<{ message: string }>(`${environment.apiUrl}/posts/${id}`)
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  //Ajout d'un nouveau Post
  addNewPost(post: Post, image: File) {
    const formData = new FormData();
    formData.append('post', JSON.stringify(post));
    formData.append('image', image);
    return this.http
      .post<{ message: string }>(`${environment.apiUrl}/posts`, formData)
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  //Ajout d'un like ou enlevement
  likedPost(id: string, like: boolean) {
    return this.http
      .post<{ message: string }>(`${environment.apiUrl}/posts/${id}/like`, {
        userId: this.getUserId(),
        like: like ? 1 : 0,
      })
      .pipe(
        mapTo(like),
        catchError((error) => throwError(error.error.message))
      );
  }

  //Récupération d'un Post
  getOnePost(id: string) {
    return this.http
      .get<Post>(`${environment.apiUrl}/posts/${id}`)
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  //Modification de post
  modifyPost(id: string, post: Post, image: string | File) {
    if (typeof image === 'string') {
      return this.http
        .put<{ message: string }>(`${environment.apiUrl}/posts/${id}`, post)
        .pipe(catchError((error) => throwError(error.error.message)));
    } else {
      const formData = new FormData();
      formData.append('post', JSON.stringify(post));
      formData.append('image', image);
      return this.http
        .put<{ message: string }>(`${environment.apiUrl}/posts/${id}`, formData)
        .pipe(catchError((error) => throwError(error.error.message)));
    }
  }
}
