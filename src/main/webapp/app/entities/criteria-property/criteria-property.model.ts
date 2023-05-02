import { ICriteria } from 'app/entities/criteria/criteria.model';
import { DataType } from 'app/entities/enumerations/data-type.model';

export interface ICriteriaProperty {
  id: number;
  propertyName?: string | null;
  propertyType?: DataType | null;
  displayNameDe?: string | null;
  displayNameEn?: string | null;
  displayNameFr?: string | null;
  displayNameIt?: string | null;
  property?: Pick<ICriteria, 'id'> | null;
}

export type NewCriteriaProperty = Omit<ICriteriaProperty, 'id'> & { id: null };
