import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {ProfileCardComponent} from '../../ui';
import { ProfileFiltersComponent } from '@tt/profile';
import {selectFilteresProfiles } from '../../../../../data-access/src/lib/profile';
import { Store } from '@ngrx/store';
// import { Store } from '@ngxs/store';
// import { ProfileState } from '../../data/store/state.ngxs';

@Component({
    selector: 'app-search-page',
    imports: [ProfileCardComponent, ProfileFiltersComponent],
    templateUrl: './search-page.component.html',
    styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {

  store = inject(Store)

  profiles = this.store.selectSignal(selectFilteresProfiles);
  // profiles = this.store.selectSignal(ProfileState.getProfiles)

  constructor() {}
}
