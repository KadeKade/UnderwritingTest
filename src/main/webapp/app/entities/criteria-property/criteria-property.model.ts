import { DataType } from 'app/entities/enumerations/data-type.model';

export interface ICriteriaProperty {
  id: number;
  propertyName?: string | null;
  propertyType?: DataType | null;
  displayNameDe?: string | null;
  displayNameEn?: string | null;
  displayNameFr?: string | null;
  displayNameIt?: string | null;
}

export type NewCriteriaProperty = Omit<ICriteriaProperty, 'id'> & { id: null };
