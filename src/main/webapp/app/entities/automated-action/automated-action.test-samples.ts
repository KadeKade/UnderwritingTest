import { AutomatedActionType } from 'app/entities/enumerations/automated-action-type.model';

import { IAutomatedAction, NewAutomatedAction } from './automated-action.model';

export const sampleWithRequiredData: IAutomatedAction = {
  id: 25304,
};

export const sampleWithPartialData: IAutomatedAction = {
  id: 52383,
  type: AutomatedActionType['AUTO_DECLINE'],
  positiveActionDefinition: 'collaborative Concrete Fiji',
  negativeActionDefinition: 'improvement SAS',
  negativeActionPropertyValue: 'Zambian generate Florida',
  displayNameIt: 'navigating',
};

export const sampleWithFullData: IAutomatedAction = {
  id: 12910,
  type: AutomatedActionType['AUTO_OFFER'],
  positiveActionDefinition: 'modular',
  negativeActionDefinition: 'deposit Regional',
  negativeActionPropertyValue: 'Bedfordshire invoice',
  displayNameDe: 'Concrete repurpose Direct',
  displayNameEn: 'Games strategy',
  displayNameFr: 'Progressive',
  displayNameIt: 'web-enabled',
};

export const sampleWithNewData: NewAutomatedAction = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
