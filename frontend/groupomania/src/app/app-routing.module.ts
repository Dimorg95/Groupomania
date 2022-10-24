import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/landing-connexion/components/login/login.component';
import { SignUpComponent } from './pages/landing-connexion/components/sign-up/sign-up.component';

import { NewPostComponent } from './pages/posts/components/new-post/new-post.component';
import { PostListComponent } from './pages/posts/components/post-list/post-list.component';
import { AuthGuard } from './pages/posts/services/auth-guard.service';

const routes: Routes = [
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'new-post', component: NewPostComponent, canActivate: [AuthGuard] },

  {
    path: 'modify-post/:id',
    component: NewPostComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
