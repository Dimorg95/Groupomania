import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { loginSignupService } from 'src/app/pages/landing-connexion/services/connexion.service';
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
    private dataService: DataService,
    private connect: loginSignupService
  ) {}
  //test
  token = JSON.stringify(localStorage.getItem('token'));

  ngOnInit(): void {
    //V1
    this.posts$ = this.postService.getAllPost();

    //test detection si le token est toujour valide
    if (this.connect.isTokenExpired(this.token)) {
      this.redirecting();
    } else {
      console.log('token pas expirer');
    }
    //Pourquoi pas mettre dans un service et l'appeller sur les deux composant post
    //et carement les mettre en place sur les requete like/delete et modify en mode condition
    //si le token n'a pas expirer alors on lance la fonction
    //sinon pop up votre session a expirer tous reset et rediriger au login
  }

  //On unsubscribe a la notification
  ngOnDestroy() {
    this.notifierSubscription.unsubscribe();
  }

  onClickNewPost() {
    if (this.connect.isTokenExpired(this.token)) {
      this.redirecting();
    } else {
      this.router.navigateByUrl('new-post');
    }
  }

  redirecting() {
    console.log('token a expirer');
    window.confirm('Votre session a expirer vous devez vous reconnecter');
    localStorage.clear();
    this.connect.isAuth$.next(false);
    this.router.navigateByUrl('login');
  }
}
