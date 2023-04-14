export interface IAction {
  id: number;
  actionDefinition?: string | null;
}

export type NewAction = Omit<IAction, 'id'> & { id: null };
