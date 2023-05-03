import { ICriteriaSet, NewCriteriaSet } from './criteria-set.model';

export const sampleWithRequiredData: ICriteriaSet = {
  id: 87465,
};

export const sampleWithPartialData: ICriteriaSet = {
  id: 32698,
  brokerCategory: 'deposit',
};

export const sampleWithFullData: ICriteriaSet = {
  id: 26364,
  name: 'Rue bypassing Corporate',
  insurerId: 99318,
  lobId: 65783,
  brokerCategory: 'Strategist',
};

export const sampleWithNewData: NewCriteriaSet = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
