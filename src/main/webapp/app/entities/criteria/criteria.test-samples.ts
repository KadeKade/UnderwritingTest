import { CriteriaType } from 'app/entities/enumerations/criteria-type.model';
import { Operator } from 'app/entities/enumerations/operator.model';
import { CriteriaDefinition } from 'app/entities/enumerations/criteria-definition.model';

import { ICriteria, NewCriteria } from './criteria.model';

export const sampleWithRequiredData: ICriteria = {
  id: 75265,
};

export const sampleWithPartialData: ICriteria = {
  id: 95100,
  criteriaActionType: CriteriaType['NEGATIVE'],
  operator: Operator['LESS_THAN_OR_EQUAL_TO'],
};

export const sampleWithFullData: ICriteria = {
  id: 33327,
  criteriaActionType: CriteriaType['NEGATIVE'],
  operator: Operator['NOT_EQUAL_TO'],
  criteriaDefinition: CriteriaDefinition['AMOUNT_OF_EMPLOYEES'],
};

export const sampleWithNewData: NewCriteria = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
