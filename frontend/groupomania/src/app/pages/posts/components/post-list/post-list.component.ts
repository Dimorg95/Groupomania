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
  //Récupération du token depuis le Local storage
  token = JSON.stringify(localStorage.getItem('token'));

  ngOnInit(): void {
    //V1
    this.posts$ = this.postService.getAllPost();

    //Au retour de l'utilisateur connecter on verifie si le token est Valide
    if (this.connect.isTokenExpired(this.token)) {
      this.redirecting();
    } else {
      console.log('token pas expirer');
    }
  }
  //On unsubscribe a la notification
  ngOnDestroy() {
    this.notifierSubscription.unsubscribe();
  }

  //Redirection vers le formulaire des Posts si Token valide
  onClickNewPost() {
    if (this.connect.isTokenExpired(this.token)) {
      this.redirecting();
    } else {
      this.router.navigateByUrl('new-post');
    }
  }
  //Redirection en cas de token expiré
  redirecting() {
    console.log('token a expirer');
    window.confirm('Votre session a expirer vous devez vous reconnecter');
    localStorage.clear();
    this.connect.isAuth$.next(false);
    this.router.navigateByUrl('login');
  }
}
