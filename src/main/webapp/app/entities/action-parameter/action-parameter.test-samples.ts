import { IActionParameter, NewActionParameter } from './action-parameter.model';

export const sampleWithRequiredData: IActionParameter = {
  id: 22285,
};

export const sampleWithPartialData: IActionParameter = {
  id: 26741,
  parameterValue: 'Generic standardization',
};

export const sampleWithFullData: IActionParameter = {
  id: 96283,
  parameterKey: 'Product',
  parameterValue: 'Engineer hierarchy',
};

export const sampleWithNewData: NewActionParameter = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
