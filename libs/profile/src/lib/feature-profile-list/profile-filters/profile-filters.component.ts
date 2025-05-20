import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { profileActions, ProfileService, selectProfileFilters } from '@tt/profile';
import {
  debounceTime,
  startWith,
  Subscription, take
} from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-profile-filters',
    imports: [ReactiveFormsModule],
    templateUrl: './profile-filters.component.html',
    styleUrl: './profile-filters.component.scss'
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
      });
  }

  ngOnDestroy() {
    this.searchFormSub.unsubscribe();
  }
}
