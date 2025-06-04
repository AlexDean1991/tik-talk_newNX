import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import {
  debounceTime,
  Subscription, take
} from 'rxjs';

import { Store } from '@ngrx/store';
// import { Store } from '@ngxs/store';

import { profileActions, ProfileService, selectProfileFilters } from '../../../../../data-access/src/lib/profile';
// import { FilterEvents } from '../../data/store/actions.ngxs';

@Component({
    selector: 'app-profile-filters',
    imports: [ReactiveFormsModule],
    templateUrl: './profile-filters.component.html',
    styleUrl: './profile-filters.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFiltersComponent implements OnDestroy {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  store = inject(Store)

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  searchFormSub!: Subscription;

  constructor() {
    // Перенесем подписку на форму в ngOnInit
  }

  ngOnInit() {
    // Шаг 1: Восстановление сохраненных фильтров
    this.store.select(selectProfileFilters)
      .pipe(take(1)) // Берем только текущее значение
      .subscribe(filters => {
        if (filters) {
          this.searchForm.patchValue(filters, { emitEvent: false }); // emitEvent: false чтобы не вызвать сабмит
        }
      });

    // Шаг 2: Подписка на изменения формы
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
      )
      .subscribe(formValue => {
        this.store.dispatch(profileActions.filterEvents({filters: formValue}))

        // NGXS
        // this.store.dispatch(new FilterEvents(formValue))
      });
  }

  ngOnDestroy() {
    this.searchFormSub.unsubscribe();
  }
}
