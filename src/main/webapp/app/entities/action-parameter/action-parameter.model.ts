import { ICriteria } from 'app/entities/criteria/criteria.model';

export interface IActionParameter {
  id: number;
  parameterName?: string | null;
  parameterValue?: string | null;
  criterias?: Pick<ICriteria, 'id'>[] | null;
}

export type NewActionParameter = Omit<IActionParameter, 'id'> & { id: null };
