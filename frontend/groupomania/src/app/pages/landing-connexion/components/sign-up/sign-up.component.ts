import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, map, tap, catchError, EMPTY } from 'rxjs';
import { loginSignupService } from '../../services/connexion.service';
import { confirmEqualValidator } from '../../validators/confirm-equal.validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private connect: loginSignupService
  ) {}
  errorMsg!: string;
  loading!: Boolean;
  mainForm!: FormGroup;

  nameForm!: FormGroup;
  nameCtrl!: FormControl; //peut etre pas utile

  emailForm!: FormGroup;
  emailCtrl!: FormControl;
  emailConfirmCtrl!: FormControl;

  passwordForm!: FormGroup;
  passwordCtrl!: FormControl;
  passwordConfirmCtrl!: FormControl;
  passwordRegex!: RegExp;

  //Observable text erreur
  showEmailError$!: Observable<Boolean>;
  showPasswordError$!: Observable<Boolean>;

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initFormObservable();
  }

  private initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      name: this.nameCtrl,
      email: this.emailForm,
      password: this.passwordForm,
    });
  }

  private initFormObservable(): void {
    this.showEmailError$ = this.emailForm.statusChanges.pipe(
      map(
        (status) =>
          status === 'INVALID' &&
          this.emailCtrl.value &&
          this.emailConfirmCtrl.value
      )
    );

    this.showPasswordError$ = this.passwordForm.statusChanges.pipe(
      map(
        (status) =>
          status === 'INVALID' &&
          this.passwordCtrl.value &&
          this.passwordConfirmCtrl.value
      )
    );
  }

  private initFormControls(): void {
    //Form name
    this.nameCtrl = this.formBuilder.control('', Validators.required);

    //Form Email
    this.emailCtrl = this.formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]);
    this.emailConfirmCtrl = this.formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]);
    this.emailForm = this.formBuilder.group(
      {
        email: this.emailCtrl,
        confirm: this.emailConfirmCtrl,
      },
      {
        validators: [confirmEqualValidator('email', 'confirm')],
        updateOn: 'blur',
      }
    );
    //Regex mots de passe
    this.passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

    //Form password
    this.passwordCtrl = this.formBuilder.control('', [
      Validators.required,
      Validators.pattern(this.passwordRegex),
    ]);
    this.passwordConfirmCtrl = this.formBuilder.control('', [
      Validators.required,
      Validators.pattern(this.passwordRegex),
    ]);
    this.passwordForm = this.formBuilder.group(
      {
        password: this.passwordCtrl,
        confirmPassword: this.passwordConfirmCtrl,
      },
      {
        validators: [confirmEqualValidator('password', 'confirmPassword')],
        updateOn: 'blur',
      }
    );
  }

  onSubmitForm() {
    this.loading = true;
    const name = this.mainForm.value.name;
    const email = this.mainForm.value.email.email;
    const password = this.mainForm.value.password.password;
    this.connect
      .userSignUp(name, email, password)
      .pipe(
        tap((saved) => {
          this.loading = false;
          console.log('User crée');
          if (saved) {
            this.resetForm();
          }
        }),
        catchError((error) => {
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      )
      .subscribe();
  }

  resetForm() {
    this.mainForm.reset();
  }

  getFormControlErrorText(ctrl: AbstractControl) {
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
    } else if (ctrl.hasError('email')) {
      return "Merci d'entrer une adresse mail valide";
    } else if (ctrl.hasError('pattern')) {
      return 'Mot de passe incorrect: majuscule, minuscule, chiffre et 8 caractère minimum';
    } else {
      return 'Ce champ contient une erreur';
    }
  }
}
