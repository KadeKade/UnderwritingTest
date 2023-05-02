import { ICriteriaSet } from 'app/entities/criteria-set/criteria-set.model';
import { CriteriaType } from 'app/entities/enumerations/criteria-type.model';
import { Operator } from 'app/entities/enumerations/operator.model';

export interface ICriteria {
  id: number;
  criteriaType?: CriteriaType | null;
  operator?: Operator | null;
  criteriaPropertyValue?: string | null;
  positiveActionPropertyValue?: string | null;
  criterias?: Pick<ICriteriaSet, 'id'> | null;
}

export type NewCriteria = Omit<ICriteria, 'id'> & { id: null };
