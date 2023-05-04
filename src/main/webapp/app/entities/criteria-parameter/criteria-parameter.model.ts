import { ICriteria } from 'app/entities/criteria/criteria.model';

export interface ICriteriaParameter {
  id: number;
  parameterKey?: string | null;
  parameterValue?: string | null;
  criteria?: Pick<ICriteria, 'id'> | null;
}

export type NewCriteriaParameter = Omit<ICriteriaParameter, 'id'> & { id: null };
