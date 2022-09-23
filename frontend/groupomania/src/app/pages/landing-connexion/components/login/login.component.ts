import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginSignupService } from '../../services/connexion.service';
import { catchError, EMPTY, tap } from 'rxjs';
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

  constructor(
    private formBuilder: FormBuilder,
    private connect: loginSignupService
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
    });
  }

  onSubmitLogin() {
    this.loading = true;
    console.log('Fonctionne ? ');
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.value.password;
    console.log(email);
    this.connect
      .userLogin(email, password)
      .pipe(
        tap(() => {
          this.loading = false;
          console.log('Utilisateur connecté');
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

//Cela ne fonctionne pas !!! a revoir dans le Week-end
