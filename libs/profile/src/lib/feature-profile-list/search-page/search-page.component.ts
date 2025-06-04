import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {ProfileCardComponent} from '../../ui';
import { profileActions, ProfileFiltersComponent, selectFilteredProfiles } from '@tt/profile';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { WaIntersectionObservee, WaIntersectionObserver } from '@ng-web-apis/intersection-observer';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';


@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CommonModule,
    ProfileCardComponent,
    ProfileFiltersComponent,
    // WaIntersectionObservee,
    // WaIntersectionObserver,
    InfiniteScrollDirective
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  store = inject(Store);
  profiles = this.store.selectSignal(selectFilteredProfiles);
  console = console;

  constructor() {}

  ngOnInit() {
    // Отправляем действие filterEvents с пустыми фильтрами для загрузки всех профилей
    this.store.dispatch(profileActions.filterEvents({ filters: {} }));
  }

  timeToFetch() {
    this.store.dispatch(profileActions.setPage({}));
  }

  onIntersection(entries: IntersectionObserverEntry[]) {
    if (!entries.length) return

    if (entries[0].intersectionRatio > 0) {
      this.timeToFetch()
    }
  }

  onScroll() {
    console.log('scroll');
    this.timeToFetch()
  }
}

  // profiles = this.store.selectSignal(ProfileState.getProfiles)
