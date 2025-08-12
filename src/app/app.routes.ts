import { Routes } from '@angular/router';
import { HomeComponent } from './public/home/home.component';
import { LoginComponent } from './public/login/login.component';
import { CatalogComponent } from './public/catalog/catalog.component';
import { DetailsComponent } from './public/details/details.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'catalog', component: CatalogComponent },
  { path: 'details/:id', component: DetailsComponent },
  {
    path: 'profile',
    loadComponent: () =>
      import('./private/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'home' },
];
