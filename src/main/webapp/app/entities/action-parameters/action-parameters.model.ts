import { IAction } from 'app/entities/action/action.model';

export interface IActionParameters {
  id: number;
  parameterName?: string | null;
  displayNameDe?: string | null;
  displayNameEn?: string | null;
  displayNameFr?: string | null;
  displayNameIt?: string | null;
  action?: Pick<IAction, 'id'> | null;
}

export type NewActionParameters = Omit<IActionParameters, 'id'> & { id: null };
