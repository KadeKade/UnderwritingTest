import { IAction, NewAction } from './action.model';

export const sampleWithRequiredData: IAction = {
  id: 83860,
};

export const sampleWithPartialData: IAction = {
  id: 28666,
};

export const sampleWithFullData: IAction = {
  id: 36962,
  actionDefinition: 'JSON',
};

export const sampleWithNewData: NewAction = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
