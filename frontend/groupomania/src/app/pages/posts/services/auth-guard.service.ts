import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, tap, take } from 'rxjs';
import { loginSignupService } from '../../landing-connexion/services/connexion.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private connect: loginSignupService) {
    if (localStorage.getItem('token')) {
      this.connect.isAuth$.next(true);
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.connect.isAuth$.pipe(
      take(1),
      tap((auth) => {
        console.log(this.router.url);
        if (!auth) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
