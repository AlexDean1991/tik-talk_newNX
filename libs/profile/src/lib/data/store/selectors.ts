import { createSelector } from '@ngrx/store';
import { profileFeature } from './reducer';

export const selectFilteresProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles) => profiles
)
