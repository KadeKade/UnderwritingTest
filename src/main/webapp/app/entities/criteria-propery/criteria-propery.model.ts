export interface ICriteriaPropery {
  id: number;
  propertyName?: string | null;
  displayNameDe?: string | null;
  displayNameEn?: string | null;
  displayNameFr?: string | null;
  displayNameIt?: string | null;
}

export type NewCriteriaPropery = Omit<ICriteriaPropery, 'id'> & { id: null };
