import { Component, OnInit } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { loginSignupService } from 'src/app/pages/landing-connexion/services/connexion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAuth$!: Observable<boolean>;

  constructor(private connect: loginSignupService) {}

  ngOnInit(): void {
    this.isAuth$ = this.connect.isAuth$.pipe(shareReplay(1));
  }

  onLogout() {
    this.connect.userLogout();
  }
}
