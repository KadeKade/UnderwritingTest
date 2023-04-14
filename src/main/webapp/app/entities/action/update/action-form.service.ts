import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAction, NewAction } from '../action.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAction for edit and NewActionFormGroupInput for create.
 */
type ActionFormGroupInput = IAction | PartialWithRequiredKeyOf<NewAction>;

type ActionFormDefaults = Pick<NewAction, 'id'>;

type ActionFormGroupContent = {
  id: FormControl<IAction['id'] | NewAction['id']>;
  actionDefinition: FormControl<IAction['actionDefinition']>;
};

export type ActionFormGroup = FormGroup<ActionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActionFormService {
  createActionFormGroup(action: ActionFormGroupInput = { id: null }): ActionFormGroup {
    const actionRawValue = {
      ...this.getFormDefaults(),
      ...action,
    };
    return new FormGroup<ActionFormGroupContent>({
      id: new FormControl(
        { value: actionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      actionDefinition: new FormControl(actionRawValue.actionDefinition),
    });
  }

  getAction(form: ActionFormGroup): IAction | NewAction {
    return form.getRawValue() as IAction | NewAction;
  }

  resetForm(form: ActionFormGroup, action: ActionFormGroupInput): void {
    const actionRawValue = { ...this.getFormDefaults(), ...action };
    form.reset(
      {
        ...actionRawValue,
        id: { value: actionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActionFormDefaults {
    return {
      id: null,
    };
  }
}
