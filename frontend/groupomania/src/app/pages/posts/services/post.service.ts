import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  //test
  posts$ = new Subject<Post[]>();

  constructor(private http: HttpClient) {}
  //V1
  getAllPost(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts`);
  }

  //test
  // getAllPost() {
  //   this.http
  //     .get<Post[]>(`${environment.apiUrl}/posts`)
  //     .pipe(
  //       tap((post) => this.posts$.next(post)),
  //       catchError((error) => {
  //         console.error(error.error.message);
  //         return of([]);
  //       })
  //     )
  //     .subscribe();
  // }

  addNewPost(post: Post, image: File) {
    const formData = new FormData();
    formData.append('post', JSON.stringify(post));
    formData.append('image', image);
    return this.http
      .post<{ message: string }>(`${environment.apiUrl}/posts`, formData)
      .pipe(catchError((error) => throwError(error.error.message)));
  }
}
