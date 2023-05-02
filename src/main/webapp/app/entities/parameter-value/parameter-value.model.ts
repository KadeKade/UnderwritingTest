import { IParameter } from 'app/entities/parameter/parameter.model';
import { ICriteria } from 'app/entities/criteria/criteria.model';

export interface IParameterValue {
  id: number;
  actionParameterValue?: string | null;
  actionParameter?: Pick<IParameter, 'id'> | null;
  criteria?: Pick<ICriteria, 'id'> | null;
}

export type NewParameterValue = Omit<IParameterValue, 'id'> & { id: null };
