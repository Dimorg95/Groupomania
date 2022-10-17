import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Post } from '../../models/post.model';
import { DataService } from '../../services/data.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  //v1
  posts$!: Observable<Post[]>;

  //Recuperation depuis post component pour actualiser la page a la supression
  notifierSubscription: Subscription =
    this.dataService.eventEmitterNotifier.subscribe((notified) => {
      this.posts$ = this.postService.getAllPost();
    });
  constructor(
    private postService: PostService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    //V1
    this.posts$ = this.postService.getAllPost();
  }
  //On unsubscribe a la notification
  ngOnDestroy() {
    this.notifierSubscription.unsubscribe();
  }

  onClickNewPost() {
    this.router.navigateByUrl('new-post');
  }
}
