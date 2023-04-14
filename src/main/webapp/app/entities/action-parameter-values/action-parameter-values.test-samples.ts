import { IActionParameterValues, NewActionParameterValues } from './action-parameter-values.model';

export const sampleWithRequiredData: IActionParameterValues = {
  id: 2497,
};

export const sampleWithPartialData: IActionParameterValues = {
  id: 25860,
};

export const sampleWithFullData: IActionParameterValues = {
  id: 46201,
  parameterValue: 'seize',
};

export const sampleWithNewData: NewActionParameterValues = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
