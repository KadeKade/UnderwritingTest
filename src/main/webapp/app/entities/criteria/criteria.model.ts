import { ICriteriaSet } from 'app/entities/criteria-set/criteria-set.model';
import { CriteriaType } from 'app/entities/enumerations/criteria-type.model';
import { Operator } from 'app/entities/enumerations/operator.model';
import { CriteriaDefinition } from 'app/entities/enumerations/criteria-definition.model';

export interface ICriteria {
  id: number;
  criteriaActionType?: CriteriaType | null;
  operator?: Operator | null;
  criteriaDefinition?: CriteriaDefinition | null;
  criteriaSet?: Pick<ICriteriaSet, 'id'> | null;
}

export type NewCriteria = Omit<ICriteria, 'id'> & { id: null };
