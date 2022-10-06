import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { PostService } from '../../services/post.service';
import { userService } from '../../services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  user!: User; //

  constructor(
    private postService: PostService,
    private router: Router,
    private userService: userService
  ) {}

  ngOnInit(): void {
    //Pour chaque post faire une requete user grace au userId du post
    //this.userService.getOneUser().subscribe((result) => {
    //   this.user = result
    // })
    //faire le model user
    this.userService.getOneUser(this.post.userId).subscribe((result) => {
      this.user = result;
    });
  }
}
