import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IActionParameters, NewActionParameters } from '../action-parameters.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActionParameters for edit and NewActionParametersFormGroupInput for create.
 */
type ActionParametersFormGroupInput = IActionParameters | PartialWithRequiredKeyOf<NewActionParameters>;

type ActionParametersFormDefaults = Pick<NewActionParameters, 'id'>;

type ActionParametersFormGroupContent = {
  id: FormControl<IActionParameters['id'] | NewActionParameters['id']>;
  parameterName: FormControl<IActionParameters['parameterName']>;
  displayNameDe: FormControl<IActionParameters['displayNameDe']>;
  displayNameEn: FormControl<IActionParameters['displayNameEn']>;
  displayNameFr: FormControl<IActionParameters['displayNameFr']>;
  displayNameIt: FormControl<IActionParameters['displayNameIt']>;
  action: FormControl<IActionParameters['action']>;
};

export type ActionParametersFormGroup = FormGroup<ActionParametersFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActionParametersFormService {
  createActionParametersFormGroup(actionParameters: ActionParametersFormGroupInput = { id: null }): ActionParametersFormGroup {
    const actionParametersRawValue = {
      ...this.getFormDefaults(),
      ...actionParameters,
    };
    return new FormGroup<ActionParametersFormGroupContent>({
      id: new FormControl(
        { value: actionParametersRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      parameterName: new FormControl(actionParametersRawValue.parameterName),
      displayNameDe: new FormControl(actionParametersRawValue.displayNameDe),
      displayNameEn: new FormControl(actionParametersRawValue.displayNameEn),
      displayNameFr: new FormControl(actionParametersRawValue.displayNameFr),
      displayNameIt: new FormControl(actionParametersRawValue.displayNameIt),
      action: new FormControl(actionParametersRawValue.action),
    });
  }

  getActionParameters(form: ActionParametersFormGroup): IActionParameters | NewActionParameters {
    return form.getRawValue() as IActionParameters | NewActionParameters;
  }

  resetForm(form: ActionParametersFormGroup, actionParameters: ActionParametersFormGroupInput): void {
    const actionParametersRawValue = { ...this.getFormDefaults(), ...actionParameters };
    form.reset(
      {
        ...actionParametersRawValue,
        id: { value: actionParametersRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActionParametersFormDefaults {
    return {
      id: null,
    };
  }
}
