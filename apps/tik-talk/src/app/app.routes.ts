import { Routes } from '@angular/router';
import {canActivateAuth, LoginPageComponent} from '@tt/auth';
import {chatsRoutes} from '@tt/chats';
import {LayoutComponent} from '@tt/layout';
import {
  ProfileEffects,
  profileFeature,
  ProfilePageComponent,
  SearchPageComponent,
  SettingsPageComponent
} from '@tt/profile';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { MyFormComponent } from '@tt/my-form';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'profile/:id', component: ProfilePageComponent },
      { path: 'exp-form', component: MyFormComponent },
      { path: 'settings', component: SettingsPageComponent },
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginPageComponent },
];
