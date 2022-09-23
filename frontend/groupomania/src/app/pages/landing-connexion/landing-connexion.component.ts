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
  constructor(private router: Router, private renderer: Renderer2) {}

  btnAnimationState: 'default' | 'active' = 'default';

  ngOnInit(): void {}

  ngAfterViewInit() {
    console.log(this.loginbutton.nativeElement);
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

  //Dernier retour en arriv
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
//https://stackoverflow.com/questions/32693061/how-can-i-select-an-element-in-a-component-template
