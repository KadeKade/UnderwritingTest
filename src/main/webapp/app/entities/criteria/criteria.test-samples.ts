import { CriteriaType } from 'app/entities/enumerations/criteria-type.model';
import { Operator } from 'app/entities/enumerations/operator.model';
import { CriteriaDefinition } from 'app/entities/enumerations/criteria-definition.model';

import { ICriteria, NewCriteria } from './criteria.model';

export const sampleWithRequiredData: ICriteria = {
  id: 75265,
};

export const sampleWithPartialData: ICriteria = {
  id: 87771,
  priority: 95174,
  criteriaActionType: CriteriaType['POSITIVE'],
  criteriaDefinition: CriteriaDefinition['AMOUNT_OF_EMPLOYEES'],
};

export const sampleWithFullData: ICriteria = {
  id: 13343,
  priority: 77885,
  criteriaActionType: CriteriaType['POSITIVE'],
  operator: Operator['GREATER_THAN'],
  criteriaDefinition: CriteriaDefinition['AMOUNT_OF_EMPLOYEES'],
};

export const sampleWithNewData: NewCriteria = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
