import { ICriteria } from 'app/entities/criteria/criteria.model';

export interface IActionParameter {
  id: number;
  parameterKey?: string | null;
  parameterValue?: string | null;
  criteria?: Pick<ICriteria, 'id'> | null;
}

export type NewActionParameter = Omit<IActionParameter, 'id'> & { id: null };
