import { createSelector } from '@ngrx/store';
import { profileFeature } from './reducer';

export const selectFilteredProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles) => profiles
)
// Добавляем новый селектор
export const selectProfileFilters = createSelector(
  profileFeature.selectProfileFilters,
  (filters) => filters
);
