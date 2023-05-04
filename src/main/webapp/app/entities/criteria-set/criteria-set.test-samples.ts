import { ICriteriaSet, NewCriteriaSet } from './criteria-set.model';

export const sampleWithRequiredData: ICriteriaSet = {
  id: 87465,
};

export const sampleWithPartialData: ICriteriaSet = {
  id: 32698,
  lobId: 26510,
};

export const sampleWithFullData: ICriteriaSet = {
  id: 64163,
  name: 'Shoes',
  priority: 37461,
  insurerId: 81899,
  lobId: 11560,
};

export const sampleWithNewData: NewCriteriaSet = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
