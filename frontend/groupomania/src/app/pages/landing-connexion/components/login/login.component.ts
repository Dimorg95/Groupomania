import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginSignupService } from '../../services/connexion.service';
import { catchError, delay, EMPTY, tap } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  passwordRegex!: RegExp;
  errorMsg!: string;
  email: string = '';
  password: string = '';
  isAdmin!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private connect: loginSignupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //regex de verification de password
    this.passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

    //Mise en place du formulaire
    this.loginForm = this.formBuilder.group({
      mail: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [Validators.required, Validators.pattern(this.passwordRegex)],
      ],
      isAdmin: [],
    });

    //Si le token du user est present on l'empeche de revenir sur login
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/posts');
    }
  }

  //Bouton de connexion
  onSubmitLogin() {
    this.loading = true;
    this.email = this.loginForm.get('mail')?.value;
    this.password = this.loginForm.value.password;
    this.isAdmin = this.loginForm.value.isAdmin;
    this.connect
      .userLogin(this.email, this.password, this.isAdmin)
      .pipe(
        delay(2000),
        tap(() => {
          this.loading = false;
        }),
        catchError((error) => {
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      )
      .subscribe();
  }
}
