import { IAutomatedAction } from 'app/entities/automated-action/automated-action.model';

export interface IActionParameter {
  id: number;
  parameterName?: string | null;
  displayNameDe?: string | null;
  displayNameEn?: string | null;
  displayNameFr?: string | null;
  displayNameIt?: string | null;
  positiveAutomatedActions?: Pick<IAutomatedAction, 'id'> | null;
  negativeAutomatedActions?: Pick<IAutomatedAction, 'id'> | null;
}

export type NewActionParameter = Omit<IActionParameter, 'id'> & { id: null };
