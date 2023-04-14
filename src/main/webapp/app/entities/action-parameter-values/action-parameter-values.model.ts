import { IActionParameters } from 'app/entities/action-parameters/action-parameters.model';

export interface IActionParameterValues {
  id: number;
  parameterValue?: string | null;
  parameter?: Pick<IActionParameters, 'id'> | null;
}

export type NewActionParameterValues = Omit<IActionParameterValues, 'id'> & { id: null };
