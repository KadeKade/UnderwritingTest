import { IAutomatedAction } from 'app/entities/automated-action/automated-action.model';

export interface ICriteriaSet {
  id: number;
  name?: string | null;
  insurerId?: number | null;
  lobId?: number | null;
  brokerCategory?: string | null;
  automatedAction?: Pick<IAutomatedAction, 'id'> | null;
}

export type NewCriteriaSet = Omit<ICriteriaSet, 'id'> & { id: null };
