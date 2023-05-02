import { IActionParameters, NewActionParameters } from './action-parameters.model';

export const sampleWithRequiredData: IActionParameters = {
  id: 11137,
};

export const sampleWithPartialData: IActionParameters = {
  id: 67808,
  displayNameFr: 'Germany upward-trending',
};

export const sampleWithFullData: IActionParameters = {
  id: 40488,
  parameterName: 'PCI Manager Berkshire',
  displayNameDe: 'Borders',
  displayNameEn: 'Directives Iran',
  displayNameFr: 'Dakota Toys',
  displayNameIt: 'Frozen invoice payment',
};

export const sampleWithNewData: NewActionParameters = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
