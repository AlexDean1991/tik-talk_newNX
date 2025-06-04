// import { AsyncPipe } from '@angular/common';
// import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
// import {ProfileCardComponent} from '../../ui';
// import { ProfileFiltersComponent, selectFilteredProfiles } from '@tt/profile';
// import { Store } from '@ngrx/store';
// // import { Store } from '@ngxs/store';
// // import { ProfileState } from '../../data/store/state.ngxs';
//
// @Component({
//     selector: 'app-search-page',
//     imports: [ProfileCardComponent, ProfileFiltersComponent],
//     templateUrl: './search-page.component.html',
//     styleUrl: './search-page.component.scss',
//     changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class SearchPageComponent {
//
//   store = inject(Store)
//
//   profiles = this.store.selectSignal(selectFilteredProfiles);
//   // profiles = this.store.selectSignal(ProfileState.getProfiles)
//
//   constructor() {}
// }

import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ProfileCardComponent } from '../../ui';
import {
  ProfileFiltersComponent,
  selectFilteredProfiles,
  selectProfilePageable,
} from '@tt/profile';
import { Store } from '@ngrx/store';
import { profileActions } from '@tt/profile';

@Component({
  selector: 'app-search-page',
  imports: [AsyncPipe, ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent implements OnInit {
  store = inject(Store);

  profiles = this.store.selectSignal(selectFilteredProfiles);
  pageable: { page: number; size: number } = { page: 1, size: 10 };

  constructor() {
    // Подписываемся на изменения пагинации
    this.store.select(selectProfilePageable).subscribe(pageable => {
      this.pageable = pageable;
    });
  }

  ngOnInit(): void {
    this.store.dispatch(profileActions.loadInitialProfiles());
  }

  setPage(page: number): void {
    if (page >= 1) {
      this.store.dispatch(profileActions.setPage({ page }));
    }
  }
}
