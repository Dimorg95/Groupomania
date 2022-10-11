import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  //v1
  posts$!: Observable<Post[]>;
  //test
  // post$!: Observable<Post>;
  // posts$ = new BehaviorSubject<Post[]>([]);

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    //V1
    this.posts$ = this.postService.getAllPost();

    //test
    // this.postService.posts$.subscribe((posts: Post[]) => {
    //   this.posts$.next(posts);
    //   console.log(posts);
    // });
  }

  onClickNewPost() {
    this.router.navigateByUrl('new-post');
  }
}
