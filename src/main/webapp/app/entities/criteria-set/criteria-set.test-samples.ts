import { ICriteriaSet, NewCriteriaSet } from './criteria-set.model';

export const sampleWithRequiredData: ICriteriaSet = {
  id: 87465,
};

export const sampleWithPartialData: ICriteriaSet = {
  id: 88769,
};

export const sampleWithFullData: ICriteriaSet = {
  id: 32698,
  name: 'deposit',
  insurerId: 26364,
  lobId: 96424,
};

export const sampleWithNewData: NewCriteriaSet = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
