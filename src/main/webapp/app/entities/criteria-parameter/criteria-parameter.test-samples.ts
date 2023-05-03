import { ICriteriaParameter, NewCriteriaParameter } from './criteria-parameter.model';

export const sampleWithRequiredData: ICriteriaParameter = {
  id: 34177,
};

export const sampleWithPartialData: ICriteriaParameter = {
  id: 38983,
  parameterName: 'back-end Maine',
};

export const sampleWithFullData: ICriteriaParameter = {
  id: 88708,
  parameterName: 'Lodge',
  parameterValue: 'state',
};

export const sampleWithNewData: NewCriteriaParameter = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
