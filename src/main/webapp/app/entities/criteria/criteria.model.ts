import { ICriteriaProperty } from 'app/entities/criteria-property/criteria-property.model';
import { ICriteriaSet } from 'app/entities/criteria-set/criteria-set.model';
import { CriteriaType } from 'app/entities/enumerations/criteria-type.model';
import { Operator } from 'app/entities/enumerations/operator.model';

export interface ICriteria {
  id: number;
  criteriaActionType?: CriteriaType | null;
  operator?: Operator | null;
  criteriaPropertyValue?: string | null;
  positiveActionPropertyValue?: string | null;
  property?: Pick<ICriteriaProperty, 'id'> | null;
  criteriaSet?: Pick<ICriteriaSet, 'id'> | null;
}

export type NewCriteria = Omit<ICriteria, 'id'> & { id: null };
