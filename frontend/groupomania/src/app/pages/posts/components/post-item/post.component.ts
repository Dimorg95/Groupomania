import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post!: Post;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {}
}

//Pourquoi pas rajouter l'email et le name (coté backend) pour s'en servir directement dans le post
