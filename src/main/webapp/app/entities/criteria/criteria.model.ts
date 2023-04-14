import { ICriteriaPropery } from 'app/entities/criteria-propery/criteria-propery.model';
import { ICriteriaSet } from 'app/entities/criteria-set/criteria-set.model';
import { Operator } from 'app/entities/enumerations/operator.model';

export interface ICriteria {
  id: number;
  operator?: Operator | null;
  propertyValue?: string | null;
  property?: Pick<ICriteriaPropery, 'id'> | null;
  criteria?: Pick<ICriteriaSet, 'id'> | null;
}

export type NewCriteria = Omit<ICriteria, 'id'> & { id: null };
