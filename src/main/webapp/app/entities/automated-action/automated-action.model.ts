import { AutomatedActionType } from 'app/entities/enumerations/automated-action-type.model';

export interface IAutomatedAction {
  id: number;
  type?: AutomatedActionType | null;
  positiveActionDefinition?: string | null;
  negativeActionDefinition?: string | null;
  negativeActionPropertyValue?: string | null;
  displayNameDe?: string | null;
  displayNameEn?: string | null;
  displayNameFr?: string | null;
  displayNameIt?: string | null;
}

export type NewAutomatedAction = Omit<IAutomatedAction, 'id'> & { id: null };
