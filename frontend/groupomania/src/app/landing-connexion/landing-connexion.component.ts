import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-connexion',
  templateUrl: './landing-connexion.component.html',
  styleUrls: ['./landing-connexion.component.scss'],
  animations: [
    trigger('btnAnimation', [
      state(
        'default',
        style({
          transform: 'scale(1)  skew(0deg)',

          'background-color': 'rgba(130, 141, 213, 1)',
          'z-index': 1,
        })
      ),
      state(
        'active',
        style({
          transform: 'scale(1.1)  skew(5deg)',
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
  constructor() {}

  btnAnimationState: 'default' | 'active' = 'default';

  ngOnInit(): void {}

  onBtnMouseEnter() {
    this.btnAnimationState = 'active';
  }

  onBtnMouseLeave() {
    this.btnAnimationState = 'default';
  }

  goToSignup() {
    console.log('Formulaire signUp');
  }

  goToLogin() {
    console.log('Formulaire Login');
  }
}
