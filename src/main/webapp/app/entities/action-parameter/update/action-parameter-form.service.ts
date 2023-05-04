import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IActionParameter, NewActionParameter } from '../action-parameter.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActionParameter for edit and NewActionParameterFormGroupInput for create.
 */
type ActionParameterFormGroupInput = IActionParameter | PartialWithRequiredKeyOf<NewActionParameter>;

type ActionParameterFormDefaults = Pick<NewActionParameter, 'id' | 'criterias'>;

type ActionParameterFormGroupContent = {
  id: FormControl<IActionParameter['id'] | NewActionParameter['id']>;
  parameterName: FormControl<IActionParameter['parameterName']>;
  parameterValue: FormControl<IActionParameter['parameterValue']>;
  criterias: FormControl<IActionParameter['criterias']>;
};

export type ActionParameterFormGroup = FormGroup<ActionParameterFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActionParameterFormService {
  createActionParameterFormGroup(actionParameter: ActionParameterFormGroupInput = { id: null }): ActionParameterFormGroup {
    const actionParameterRawValue = {
      ...this.getFormDefaults(),
      ...actionParameter,
    };
    return new FormGroup<ActionParameterFormGroupContent>({
      id: new FormControl(
        { value: actionParameterRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      parameterName: new FormControl(actionParameterRawValue.parameterName),
      parameterValue: new FormControl(actionParameterRawValue.parameterValue),
      criterias: new FormControl(actionParameterRawValue.criterias ?? []),
    });
  }

  getActionParameter(form: ActionParameterFormGroup): IActionParameter | NewActionParameter {
    return form.getRawValue() as IActionParameter | NewActionParameter;
  }

  resetForm(form: ActionParameterFormGroup, actionParameter: ActionParameterFormGroupInput): void {
    const actionParameterRawValue = { ...this.getFormDefaults(), ...actionParameter };
    form.reset(
      {
        ...actionParameterRawValue,
        id: { value: actionParameterRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActionParameterFormDefaults {
    return {
      id: null,
      criterias: [],
    };
  }
}
