
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {ProfileCardComponent} from '../../ui';
import { profileActions, ProfileFiltersComponent, selectFilteredProfiles } from '@tt/profile';
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

  constructor() {}

  ngOnInit() {
    // Отправляем действие filterEvents с пустыми фильтрами для загрузки всех профилей
    this.store.dispatch(profileActions.filterEvents({ filters: {} }));
  }
}

  // profiles = this.store.selectSignal(ProfileState.getProfiles)
