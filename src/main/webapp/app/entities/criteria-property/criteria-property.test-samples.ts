import { DataType } from 'app/entities/enumerations/data-type.model';

import { ICriteriaProperty, NewCriteriaProperty } from './criteria-property.model';

export const sampleWithRequiredData: ICriteriaProperty = {
  id: 98536,
};

export const sampleWithPartialData: ICriteriaProperty = {
  id: 45009,
  propertyName: 'solutions Implementation',
  propertyType: DataType['STRING'],
  displayNameDe: 'auxiliary Assistant copying',
  displayNameEn: 'Florida',
  displayNameFr: 'Persevering',
};

export const sampleWithFullData: ICriteriaProperty = {
  id: 492,
  propertyName: 'Intuitive salmon',
  propertyType: DataType['STRING'],
  displayNameDe: 'TCP',
  displayNameEn: 'Island',
  displayNameFr: 'copying',
  displayNameIt: 'Practical hub Practical',
};

export const sampleWithNewData: NewCriteriaProperty = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
