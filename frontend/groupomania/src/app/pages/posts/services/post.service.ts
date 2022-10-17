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
  //exploitation du token

  // this.token = JSON.stringify(localStorage.getItem('token'));

  // this.infoFromToken = this.connect.getUserIdFromToken(this.token);
  getTest() {
    this.token = JSON.stringify(localStorage.getItem('token'));
    this.infoFromToken = this.connect.getUserIdFromToken(this.token);
    return this.infoFromToken.userId;
  }
  //V1
  getAllPost(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts`).pipe(
      tap((post) => this.posts$.next(post)),
      catchError((error) => throwError(error.error.message))
    );
  }

  //test delete post

  deletePost(id: string) {
    return this.http
      .delete<{ message: string }>(`${environment.apiUrl}/posts/${id}`)
      .pipe(
        // switchMap(() => this.getAllPost()),
        catchError((error) => throwError(error.error.message))
      );
  }

  addNewPost(post: Post, image: File) {
    const formData = new FormData();
    formData.append('post', JSON.stringify(post));
    formData.append('image', image);
    return this.http
      .post<{ message: string }>(`${environment.apiUrl}/posts`, formData)
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  likedPost(id: string, like: boolean) {
    return this.http
      .post<{ message: string }>(`${environment.apiUrl}/posts/${id}/like`, {
        userId: this.getTest(),
        like: like ? 1 : 0,
      })
      .pipe(
        mapTo(like),
        catchError((error) => throwError(error.error.message))
      );
  }

  //test recuperation  un post
  getOnePost(id: string) {
    return this.http
      .get<Post>(`${environment.apiUrl}/posts/${id}`)
      .pipe(catchError((error) => throwError(error.error.message)));
  }
  //test modify post
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
