import { ICriteriaSet } from 'app/entities/criteria-set/criteria-set.model';

export interface IBrokerCategory {
  id: number;
  displayName?: string | null;
  criteriaSets?: Pick<ICriteriaSet, 'id'>[] | null;
}

export type NewBrokerCategory = Omit<IBrokerCategory, 'id'> & { id: null };
