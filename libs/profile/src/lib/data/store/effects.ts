import { ProfileService } from '@tt/profile';
import { inject, Injectable } from '@angular/core';

@Injectable({
  provideIn: 'root'
})
export class ProfileEffects {
  profileService = inject(ProfileService)
  filterProfiles = createEffects()
}
