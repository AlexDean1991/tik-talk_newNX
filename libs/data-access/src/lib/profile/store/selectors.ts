import { createSelector } from '@ngrx/store';
import { profileFeature } from './reducer';

export const selectFilteresProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles) => profiles
)
// Добавляем новый селектор
export const selectProfileFilters = createSelector(
  profileFeature.selectProfileFilters,
  (filters) => filters
);
