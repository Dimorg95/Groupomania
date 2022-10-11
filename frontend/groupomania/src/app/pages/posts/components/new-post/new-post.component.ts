import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  SelectControlValueAccessor,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, EMPTY, empty, tap } from 'rxjs';
import { loginSignupService } from 'src/app/pages/landing-connexion/services/connexion.service';
import { Post } from '../../models/post.model';
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

  constructor(
    private formBuilder: FormBuilder,
    private connect: loginSignupService,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initEmptyForm();
  }

  initEmptyForm() {
    this.postForm = this.formBuilder.group({
      title: [null, Validators.required],
      text: [null, Validators.required],
      image: [null, Validators.required],
    });
    this.imagePreview = '';
  }
  //Problème concernant l'envoie des posts visiblement mon userId est vide a l'envoie
  //et le serveur me signale une erreur par rapport a filename
  onSubmitForm() {
    this.loading = true;
    console.log(this.postForm.value);
    const newPost = new Post();
    newPost.title = this.postForm.get('title')!.value;
    newPost.text = this.postForm.get('text')!.value;
    newPost.userId = this.connect.getUserId();
    console.log(newPost.userId);
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
