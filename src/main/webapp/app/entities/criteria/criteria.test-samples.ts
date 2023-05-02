import { CriteriaType } from 'app/entities/enumerations/criteria-type.model';
import { Operator } from 'app/entities/enumerations/operator.model';

import { ICriteria, NewCriteria } from './criteria.model';

export const sampleWithRequiredData: ICriteria = {
  id: 75265,
};

export const sampleWithPartialData: ICriteria = {
  id: 87771,
  criteriaActionType: CriteriaType['NEGATIVE'],
  operator: Operator['CONTAINS'],
  positiveActionPropertyValue: 'Soft Turkmenistan Credit',
};

export const sampleWithFullData: ICriteria = {
  id: 69174,
  criteriaActionType: CriteriaType['POSITIVE'],
  operator: Operator['NOT_EQUAL_TO'],
  criteriaPropertyValue: 'bluetooth Licensed Democratic',
  positiveActionPropertyValue: 'Pizza',
};

export const sampleWithNewData: NewCriteria = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
