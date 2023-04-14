import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IActionParameterValues, NewActionParameterValues } from '../action-parameter-values.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActionParameterValues for edit and NewActionParameterValuesFormGroupInput for create.
 */
type ActionParameterValuesFormGroupInput = IActionParameterValues | PartialWithRequiredKeyOf<NewActionParameterValues>;

type ActionParameterValuesFormDefaults = Pick<NewActionParameterValues, 'id'>;

type ActionParameterValuesFormGroupContent = {
  id: FormControl<IActionParameterValues['id'] | NewActionParameterValues['id']>;
  parameterValue: FormControl<IActionParameterValues['parameterValue']>;
  parameter: FormControl<IActionParameterValues['parameter']>;
};

export type ActionParameterValuesFormGroup = FormGroup<ActionParameterValuesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActionParameterValuesFormService {
  createActionParameterValuesFormGroup(
    actionParameterValues: ActionParameterValuesFormGroupInput = { id: null }
  ): ActionParameterValuesFormGroup {
    const actionParameterValuesRawValue = {
      ...this.getFormDefaults(),
      ...actionParameterValues,
    };
    return new FormGroup<ActionParameterValuesFormGroupContent>({
      id: new FormControl(
        { value: actionParameterValuesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      parameterValue: new FormControl(actionParameterValuesRawValue.parameterValue),
      parameter: new FormControl(actionParameterValuesRawValue.parameter),
    });
  }

  getActionParameterValues(form: ActionParameterValuesFormGroup): IActionParameterValues | NewActionParameterValues {
    return form.getRawValue() as IActionParameterValues | NewActionParameterValues;
  }

  resetForm(form: ActionParameterValuesFormGroup, actionParameterValues: ActionParameterValuesFormGroupInput): void {
    const actionParameterValuesRawValue = { ...this.getFormDefaults(), ...actionParameterValues };
    form.reset(
      {
        ...actionParameterValuesRawValue,
        id: { value: actionParameterValuesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActionParameterValuesFormDefaults {
    return {
      id: null,
    };
  }
}
