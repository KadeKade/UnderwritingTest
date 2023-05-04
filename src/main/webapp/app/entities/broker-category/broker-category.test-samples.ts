import { IBrokerCategory, NewBrokerCategory } from './broker-category.model';

export const sampleWithRequiredData: IBrokerCategory = {
  id: 82862,
};

export const sampleWithPartialData: IBrokerCategory = {
  id: 35230,
};

export const sampleWithFullData: IBrokerCategory = {
  id: 19980,
  displayName: 'innovate Cambridgeshire Maine',
};

export const sampleWithNewData: NewBrokerCategory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
