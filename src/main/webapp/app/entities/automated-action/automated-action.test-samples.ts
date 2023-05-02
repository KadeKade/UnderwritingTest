import { AutomatedActionType } from 'app/entities/enumerations/automated-action-type.model';

import { IAutomatedAction, NewAutomatedAction } from './automated-action.model';

export const sampleWithRequiredData: IAutomatedAction = {
  id: 25304,
};

export const sampleWithPartialData: IAutomatedAction = {
  id: 85497,
  type: AutomatedActionType['AUTO_OFFER'],
  positiveActionDefinition: 'array infrastructures',
  negativeActionDefinition: 'Fiji',
  displayNameDe: 'improvement SAS',
};

export const sampleWithFullData: IAutomatedAction = {
  id: 96550,
  type: AutomatedActionType['AUTO_OFFER'],
  positiveActionDefinition: 'scale interfaces Rustic',
  negativeActionDefinition: 'innovative Plastic',
  displayNameDe: 'North Factors',
  displayNameEn: 'interactive payment',
  displayNameFr: 'RAM',
  displayNameIt: 'repurpose',
};

export const sampleWithNewData: NewAutomatedAction = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
