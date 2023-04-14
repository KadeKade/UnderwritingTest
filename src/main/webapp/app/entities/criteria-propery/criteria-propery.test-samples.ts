import { ICriteriaPropery, NewCriteriaPropery } from './criteria-propery.model';

export const sampleWithRequiredData: ICriteriaPropery = {
  id: 70181,
};

export const sampleWithPartialData: ICriteriaPropery = {
  id: 74274,
  displayNameFr: 'Engineer West',
  displayNameIt: 'Plastic Rubber',
};

export const sampleWithFullData: ICriteriaPropery = {
  id: 48531,
  propertyName: 'Quetzal',
  displayNameDe: 'matrices',
  displayNameEn: 'SSL',
  displayNameFr: 'definition Plastic payment',
  displayNameIt: 'tangible Home',
};

export const sampleWithNewData: NewCriteriaPropery = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
