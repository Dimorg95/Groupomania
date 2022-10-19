import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  SelectControlValueAccessor,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, empty, switchMap, tap } from 'rxjs';
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

    this.route.params
      .pipe(
        switchMap((params) => {
          if (!params['id']) {
            this.mode = 'new';
            this.initEmptyForm();
            return EMPTY;
          } else {
            this.mode = 'edit';
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

  initEmptyForm() {
    this.postForm = this.formBuilder.group({
      title: [null, Validators.required],
      text: [null, Validators.required],
      image: [null, Validators.required],
    });
    this.imagePreview = '';
  }

  initModifyForm(post: Post) {
    this.postForm = this.formBuilder.group({
      title: [post.title, Validators.required],
      text: [post.text, Validators.required],
      image: [post.imageUrl, Validators.required],
    });
    this.imagePreview = post.imageUrl;
  }

  onSubmitForm() {
    this.loading = true;
    console.log(this.postForm.value);
    const newPost = new Post();
    newPost.title = this.postForm.get('title')!.value;
    newPost.text = this.postForm.get('text')!.value;
    //changer cette methode et recuperer le userId du token ?
    // newPost.userId = this.connect.getUserId();
    newPost.userId = this.infoFromToken.userId;
    console.log(newPost.userId);
    if (this.mode === 'new') {
      this.postService
        .addNewPost(newPost, this.postForm.get('image')!.value)
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
    } else if (this.mode === 'edit') {
      //Ici le code pour la modification de post
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
  //Probleme avec les requete de modification voir avec arthur
  //Via le back 1er methode tourne dans le vide
  //2eme methode effectue bien les changement mais impossible de visualiser le post modifier !

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
