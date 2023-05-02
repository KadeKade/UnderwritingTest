import { IParameterValue, NewParameterValue } from './parameter-value.model';

export const sampleWithRequiredData: IParameterValue = {
  id: 13432,
};

export const sampleWithPartialData: IParameterValue = {
  id: 72441,
  actionParameterValue: 'copy connecting Frozen',
};

export const sampleWithFullData: IParameterValue = {
  id: 80129,
  actionParameterValue: 'Salad Operations installation',
};

export const sampleWithNewData: NewParameterValue = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
