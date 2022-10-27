import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap, map } from 'rxjs';
import { loginSignupService } from 'src/app/pages/landing-connexion/services/connexion.service';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { UserModelId } from '../../models/userId.model';
import { DataService } from '../../services/data.service';
import { PostService } from '../../services/post.service';
import { userService } from '../../services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  user!: User;

  token = '';
  infoFromToken!: UserModelId;
  disableButton!: boolean;
  liked!: boolean;
  likedMessage = '';
  dateFr!: any;
  constructor(
    private postService: PostService,
    private router: Router,
    private userService: userService,
    private connect: loginSignupService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    //Récuperation des information User
    this.userService.getOneUser(this.post.userId).subscribe((result) => {
      this.user = result;
    });

    //recuperation des info du token
    this.token = JSON.stringify(localStorage.getItem('token'));

    this.infoFromToken = this.connect.getUserIdFromToken(this.token);

    //Si l'userId du post correspond a l'userId du token alors on active les buttons
    //sinon on les desactive
    if (
      this.post.userId === this.infoFromToken.userId ||
      this.infoFromToken.isAdmin === true
    ) {
      console.log('Les userId correspondent');
      this.disableButton = true;
    } else {
      console.log('Les userId ne correpondent pas');
      this.disableButton = false;
    }

    //Verification si l'utilisateur enregistrer a like un ou plusieurs post
    if (
      this.post.usersLiked.find((user) => user === this.infoFromToken.userId)
    ) {
      this.liked = true;
    } else {
      this.liked = false;
    }

    //Ajustage du texte par rapport au like
    if (this.post.likes === 1) {
      this.likedMessage = this.post.likes + ' utilisateur à aimé';
    } else if (this.post.likes === 0) {
      this.likedMessage = '';
    } else {
      this.likedMessage = this.post.likes + ' utilisateurs ont aimés';
    }
  }

  //A chaque fonction on verifie que le token n'est pas expirer
  //Fonction qui nous supprime l'article cliquer

  onDelete() {
    if (this.connect.isTokenExpired(this.token)) {
      this.redirecting();
    } else {
      this.postService
        .deletePost(this.post._id)
        .pipe(
          tap((message) => {
            console.log(message);
            this.notifyForChange();
          }),

          catchError((error) => {
            console.error(error);
            return EMPTY;
          })
        )
        .subscribe();
    }
  }
  //Ajout/enlevement du like
  onLike() {
    if (this.connect.isTokenExpired(this.token)) {
      this.redirecting();
    } else {
      this.postService
        .likedPost(this.post._id, !this.liked)
        .pipe(
          tap((liked) => {
            this.liked = liked;
            this.notifyForChange();
          }),
          map((liked) => ({
            ...this.post,
            likes: liked ? this.post.likes + 1 : this.post.likes - 1,
          }))
        )
        .subscribe();
    }
  }
  //Notification de changement pour rechargement de la page post-list
  notifyForChange() {
    this.dataService.notifyAboutChange();
  }

  //Clique sur le bouton modifier Post
  onModify() {
    if (this.connect.isTokenExpired(this.token)) {
      this.redirecting();
    } else {
      console.log('token pas expirer');
      this.router.navigate(['/modify-post', this.post._id]);
    }
  }

  //Redirection en cas de Token expirer
  redirecting() {
    console.log('Token a expirer');
    window.confirm('Votre session a expirer vous devez vous reconnecter');
    localStorage.clear();
    this.connect.isAuth$.next(false);
    this.router.navigateByUrl('login');
  }
}
