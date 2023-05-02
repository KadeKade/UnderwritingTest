import { IActionParameter, NewActionParameter } from './action-parameter.model';

export const sampleWithRequiredData: IActionParameter = {
  id: 22285,
};

export const sampleWithPartialData: IActionParameter = {
  id: 59049,
  displayNameDe: 'standardization Brand',
};

export const sampleWithFullData: IActionParameter = {
  id: 30345,
  parameterName: 'methodologies',
  displayNameDe: 'hierarchy Creative Solutions',
  displayNameEn: 'withdrawal',
  displayNameFr: 'Mission aggregate deposit',
  displayNameIt: 'Specialist',
};

export const sampleWithNewData: NewActionParameter = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
