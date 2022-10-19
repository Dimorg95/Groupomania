import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  EMPTY,
  switchMap,
  tap,
  pipe,
  take,
  Observable,
  BehaviorSubject,
  map,
} from 'rxjs';
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
  user!: User; //
  //test
  token = '';
  infoFromToken!: UserModelId;
  disableButton!: boolean;
  // post$!: Observable<Post>;
  // deleteItem$ = new BehaviorSubject<boolean>(false);
  liked!: boolean;
  likedMessage = '';
  //test2
  onPost!: Post;

  constructor(
    private postService: PostService,
    private router: Router,
    private userService: userService,
    private connect: loginSignupService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    console.log(this.connect.getIsAuth());

    //faire le model user
    this.userService.getOneUser(this.post.userId).subscribe((result) => {
      this.user = result;
    });
    //test

    //recuperation des info du token
    this.token = JSON.stringify(localStorage.getItem('token'));

    this.infoFromToken = this.connect.getUserIdFromToken(this.token);
    // console.log(userIdFromToken.userId);
    // console.log(this.post.userId);
    // console.log(this.connect.UserAdmin);

    //Je n'arrive pas a la faire marcher dans la fonction en commentaire

    //Si l'userId du post correspond a l'userId du token alors on active les buttons
    //sinon on les desactive
    if (
      this.post.userId === this.infoFromToken.userId ||
      this.infoFromToken.isAdmin === true
    ) {
      console.log('Les userId correspond');
      this.disableButton = true;
    } else {
      console.log('Les userId ne correponde pas');
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
    } else {
      this.likedMessage = this.post.likes + ' utilisateur ont aimé';
    }
  }

  onDelete() {
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
  onLike() {
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
  //Notification de changement pour rechargement de la page post-list
  notifyForChange() {
    this.dataService.notifyAboutChange();
  }
  //test recup un post
  // onModify() {
  //   this.postService
  //     .getOnePost(this.post._id)
  //     .pipe(
  //       tap((post) => {
  //         console.log(post);
  //         this.router.navigate(['/modify-post', post._id]);
  //       })
  //     )
  //     .subscribe();
  // }
  onModify() {
    this.router.navigate(['/modify-post', this.post._id]);
  }
  //Pour la suppression :
  //Desactiver les boutons si l'id de l'utilisateur
  //n'est pas pareil que celui du poste (voir apres la fonctionnalité)
  //-Si l'id de l'utilisateur === userId du post
  //alors on envoie la requete avec onDelete sur le bouton supprimer

  //Dans postService effectuer notre requete delete avec en params l'id du post
}
