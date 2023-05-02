import { IParameter, NewParameter } from './parameter.model';

export const sampleWithRequiredData: IParameter = {
  id: 1739,
};

export const sampleWithPartialData: IParameter = {
  id: 36682,
  displayNameDe: 'Account info-mediaries Tools',
  displayNameIt: 'core',
};

export const sampleWithFullData: IParameter = {
  id: 10110,
  parameterName: 'niches',
  displayNameDe: 'Concrete',
  displayNameEn: 'Belarus methodical convergence',
  displayNameFr: 'e-services',
  displayNameIt: 'Multi-tiered optical',
};

export const sampleWithNewData: NewParameter = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
