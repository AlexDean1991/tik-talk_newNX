// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authTokenInterceptor } from '@tt/auth';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { postsFeature } from '@tt/posts';
import { PostsEffects } from '@tt/posts';
// import { provideStore } from '@ngxs/store';
// import { ProfileState } from '../../../../libs/profile/src/lib/data/store/state.ngxs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    provideStore
    // ([ProfileState])
    ({
      [postsFeature.name]: postsFeature.reducer
    }),
    provideEffects([PostsEffects])
  ]
};
