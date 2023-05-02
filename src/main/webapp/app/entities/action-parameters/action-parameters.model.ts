export interface IActionParameters {
  id: number;
  parameterName?: string | null;
  displayNameDe?: string | null;
  displayNameEn?: string | null;
  displayNameFr?: string | null;
  displayNameIt?: string | null;
}

export type NewActionParameters = Omit<IActionParameters, 'id'> & { id: null };
