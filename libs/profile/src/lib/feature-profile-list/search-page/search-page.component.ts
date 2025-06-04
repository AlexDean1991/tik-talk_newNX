
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {ProfileCardComponent} from '../../ui';
import { ProfileFiltersComponent, selectFilteredProfiles } from '@tt/profile';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-search-page',
    imports: [ProfileCardComponent, ProfileFiltersComponent],
    templateUrl: './search-page.component.html',
    styleUrl: './search-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {

  store = inject(Store)

  profiles = this.store.selectSignal(selectFilteredProfiles);
  // profiles = this.store.selectSignal(ProfileState.getProfiles)

  constructor() {}
}
