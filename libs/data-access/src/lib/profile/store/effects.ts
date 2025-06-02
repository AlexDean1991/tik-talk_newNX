import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { profileActions } from './actions';
import { map, switchMap } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import { Profile } from '@tt/interfaces/profile';
import { Pageble } from '../../shared';

@Injectable({
  providedIn: 'root'
})
export class ProfileEffects {
  profileService = inject(ProfileService)
  actions$ = inject(Actions)

  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents),
      switchMap(({ filters })=> {
        return this.profileService.filterProfiles(filters)
    }),
      map((res: Pageble<Profile>) =>
        profileActions.profilesLoaded({profiles:res.items}))
    )
  })
}
