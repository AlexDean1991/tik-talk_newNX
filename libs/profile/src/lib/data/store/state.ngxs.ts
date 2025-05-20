import { Profile } from '@tt/interfaces/profile';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { inject, Inject, Injectable } from '@angular/core';
import { FilterEvents } from './actions.ngxs';
import { Observable, tap } from 'rxjs';
import { ProfileService } from '@tt/profile';
import { Pageble } from 'libs/shared/src/lib/data/interfaces/pageble.interface';

export interface ProfileStateModel {
  profiles: Profile[],
  profileFilters: {}
}

@State({
  name: 'profileState',
  defaults: {
    profiles: [],
    profileFilters: []
  },
})

@Injectable()
export class ProfileState {
  #profileService = inject(ProfileService)

  @Selector()
  static getProfiles(state: ProfileStateModel): Profile[] {
    return state.profiles
  }

  @Action(FilterEvents)
  onFilterEvents(ctx: StateContext<ProfileStateModel>, { filters }: FilterEvents): Observable<Pageble<Profile>> {
    return this.#profileService.filterProfiles(filters).pipe(
      tap(res => {
        ctx.patchState({
          profiles: res.items
        });
      })
    );
  }
}
