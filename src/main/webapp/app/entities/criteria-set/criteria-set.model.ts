import { IAction } from 'app/entities/action/action.model';
import { IActionParameterValues } from 'app/entities/action-parameter-values/action-parameter-values.model';

export interface ICriteriaSet {
  id: number;
  name?: string | null;
  insurerId?: number | null;
  lobId?: number | null;
  positiveAction?: Pick<IAction, 'id'> | null;
  positiveActionParameters?: Pick<IActionParameterValues, 'id'> | null;
  negativeAction?: Pick<IAction, 'id'> | null;
  negativeActionParameters?: Pick<IActionParameterValues, 'id'> | null;
}

export type NewCriteriaSet = Omit<ICriteriaSet, 'id'> & { id: null };
