export interface IParameter {
  id: number;
  parameterName?: string | null;
  displayNameDe?: string | null;
  displayNameEn?: string | null;
  displayNameFr?: string | null;
  displayNameIt?: string | null;
}

export type NewParameter = Omit<IParameter, 'id'> & { id: null };
