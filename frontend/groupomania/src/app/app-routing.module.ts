import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingConnexionComponent } from './landing-connexion/landing-connexion.component';

const routes: Routes = [{ path: '', component: LandingConnexionComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
