import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  SelectControlValueAccessor,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, delay, EMPTY, empty, switchMap, tap } from 'rxjs';
import { loginSignupService } from 'src/app/pages/landing-connexion/services/connexion.service';
import { Post } from '../../models/post.model';
import { UserModelId } from '../../models/userId.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  loading!: boolean;
  postForm!: FormGroup;
  errorMsg!: string;
  imagePreview!: string;
  post!: Post;
  mode!: string;
  token!: string;
  infoFromToken!: UserModelId;

  constructor(
    private formBuilder: FormBuilder,
    private connect: loginSignupService,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = JSON.stringify(localStorage.getItem('token'));

    this.infoFromToken = this.connect.getUserIdFromToken(this.token);

    //Mise en place du formulaire soit vide soit a modifier
    //Si aucun id dans l'url alors newForm sinon modifyForm
    this.route.params
      .pipe(
        switchMap((params) => {
          if (!params['id']) {
            this.mode = 'new';
            this.initEmptyForm();
            return EMPTY;
          } else {
            this.mode = 'edit';
            //On récupere les donnée du post par rapport a l'id de l'url
            return this.postService.getOnePost(params['id']);
          }
        }),
        tap((post) => {
          if (post) {
            this.post = post;
            this.initModifyForm(post);
          }
        }),
        catchError((error) => (this.errorMsg = JSON.stringify(error)))
      )
      .subscribe();
  }

  //Regex de validation des champs
  validationRegex = /^\S[A-Za-z0-9 -]*$/;

  //Initialisation du formulaire de post vide (new post)
  initEmptyForm() {
    this.postForm = this.formBuilder.group({
      title: [
        null,
        [Validators.required, Validators.pattern(this.validationRegex)],
      ],
      text: [
        null,
        [Validators.required, Validators.pattern(this.validationRegex)],
      ],
      image: [null, Validators.required],
    });
    this.imagePreview = '';
  }

  //Initialisation du formulaire de post modification(modifyPost)
  initModifyForm(post: Post) {
    this.postForm = this.formBuilder.group({
      title: [
        post.title,
        [Validators.required, Validators.pattern(this.validationRegex)],
      ],
      text: [
        post.text,
        [Validators.required, Validators.pattern(this.validationRegex)],
      ],
      image: [post.imageUrl, Validators.required],
    });
    this.imagePreview = post.imageUrl;
  }

  //Au clique sur le bouton de validation
  onSubmitForm() {
    this.loading = true;
    console.log(this.postForm.value);
    const newPost = new Post();
    newPost.title = this.postForm.get('title')!.value;
    newPost.text = this.postForm.get('text')!.value;
    newPost.userId = this.infoFromToken.userId;

    //Ici le code pour la création de post
    if (this.mode === 'new') {
      this.postService
        .addNewPost(newPost, this.postForm.get('image')!.value)
        .pipe(
          delay(1500),
          tap(({ message }) => {
            console.log(message);
            this.loading = false;
            this.router.navigateByUrl('posts');
          }),
          catchError((error) => {
            console.error(error);
            this.loading = false;
            this.errorMsg = error.message;
            return EMPTY;
          })
        )
        .subscribe();

      //Ici le code pour la modification de post
    } else if (this.mode === 'edit') {
      newPost.userId = this.post.userId;

      this.postService
        .modifyPost(this.post._id, newPost, this.postForm.get('image')!.value)
        .pipe(
          tap(({ message }) => {
            console.log(message);
            this.loading = false;
            this.router.navigateByUrl('posts');
          }),
          catchError((error) => {
            console.error(error);
            this.loading = false;
            this.errorMsg = error.message;
            return EMPTY;
          })
        )
        .subscribe();
    }
  }

  //Gestion et previsualisation de l'image
  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.postForm.get('image')?.setValue(file);
    this.postForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
