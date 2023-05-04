import { IAutomatedAction } from 'app/entities/automated-action/automated-action.model';
import { IBrokerCategory } from 'app/entities/broker-category/broker-category.model';

export interface ICriteriaSet {
  id: number;
  name?: string | null;
  priority?: number | null;
  insurerId?: number | null;
  lobId?: number | null;
  automatedAction?: Pick<IAutomatedAction, 'id'> | null;
  brokerCategories?: Pick<IBrokerCategory, 'id'>[] | null;
}

export type NewCriteriaSet = Omit<ICriteriaSet, 'id'> & { id: null };
