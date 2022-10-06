import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, share, shareReplay } from 'rxjs';
import { loginSignupService } from './services/connexion.service';

@Component({
  selector: 'app-landing-connexion',
  templateUrl: './landing-connexion.component.html',
  styleUrls: ['./landing-connexion.component.scss'],
  animations: [
    trigger('btnAnimation', [
      state(
        'default',
        style({
          transform: 'scale(1)',

          'background-color': 'rgba(130, 141, 213, 1)',
          'z-index': 1,
        })
      ),
      state(
        'active',
        style({
          transform: 'scale(1.1)',
          'background-color': 'rgb(75, 93, 216)',
          'z-index': 2,
          color: 'rgba(255, 215, 215)',
        })
      ),
      transition('default => active', [animate('200ms ease-in-out')]),
      transition('active => default', [animate('500ms ease-in-out')]),
    ]),
  ],
})
export class LandingConnexionComponent implements OnInit {
  isAuth$!: Observable<boolean>;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private connect: loginSignupService
  ) {}

  btnAnimationState: 'default' | 'active' = 'default';

  ngOnInit(): void {
    //a revoir ne fonctionne pas correctement isAuth semble etre false alors qu'on est connecter
    //Je ne vois pas d'ou vient le probleme a la connection il passe bien en true mais la valeur ce reset
    if (this.connect.getIsAuth() === true) {
      console.log('On tombe dans le if');
      this.router.navigateByUrl('/posts');
    } else {
      console.log('on tombe dans le Else');
    }
  }

  ////////////////////////////
  @ViewChild('loginbutton') loginbutton!: ElementRef<HTMLButtonElement>;

  ////////////////////////////////
  getAnimation() {
    return [
      { transform: 'scale(1.1)' },
      { backgroundColor: 'rgb(75, 93, 216)' },

      { color: 'rgba(255, 215, 215)' },
    ];
  }
  ////////////////////////////////////

  onBtnMouseEnter() {
    this.btnAnimationState = 'active';
  }

  onBtnMouseLeave() {
    this.btnAnimationState = 'default';
  }

  goToSignup() {
    this.router.navigateByUrl('/signup');
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}

//Ng on init faire un check si isAuth = true , si oui redirection vers post

//ngonInit checker si un token est present, faire une requete de connexion
//navigate url sur la page post
