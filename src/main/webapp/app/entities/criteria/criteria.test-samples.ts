import { Operator } from 'app/entities/enumerations/operator.model';

import { ICriteria, NewCriteria } from './criteria.model';

export const sampleWithRequiredData: ICriteria = {
  id: 75265,
};

export const sampleWithPartialData: ICriteria = {
  id: 37734,
  operator: Operator['LESS_THAN_OR_EQUAL_TO'],
  propertyValue: 'Tactics Soft Turkmenistan',
};

export const sampleWithFullData: ICriteria = {
  id: 61179,
  operator: Operator['LESS_THAN'],
  propertyValue: 'Yen',
};

export const sampleWithNewData: NewCriteria = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
