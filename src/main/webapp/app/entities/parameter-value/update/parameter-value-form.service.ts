import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IParameterValue, NewParameterValue } from '../parameter-value.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IParameterValue for edit and NewParameterValueFormGroupInput for create.
 */
type ParameterValueFormGroupInput = IParameterValue | PartialWithRequiredKeyOf<NewParameterValue>;

type ParameterValueFormDefaults = Pick<NewParameterValue, 'id'>;

type ParameterValueFormGroupContent = {
  id: FormControl<IParameterValue['id'] | NewParameterValue['id']>;
  actionParameterValue: FormControl<IParameterValue['actionParameterValue']>;
  actionParameter: FormControl<IParameterValue['actionParameter']>;
  criteria: FormControl<IParameterValue['criteria']>;
};

export type ParameterValueFormGroup = FormGroup<ParameterValueFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ParameterValueFormService {
  createParameterValueFormGroup(parameterValue: ParameterValueFormGroupInput = { id: null }): ParameterValueFormGroup {
    const parameterValueRawValue = {
      ...this.getFormDefaults(),
      ...parameterValue,
    };
    return new FormGroup<ParameterValueFormGroupContent>({
      id: new FormControl(
        { value: parameterValueRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      actionParameterValue: new FormControl(parameterValueRawValue.actionParameterValue),
      actionParameter: new FormControl(parameterValueRawValue.actionParameter),
      criteria: new FormControl(parameterValueRawValue.criteria),
    });
  }

  getParameterValue(form: ParameterValueFormGroup): IParameterValue | NewParameterValue {
    return form.getRawValue() as IParameterValue | NewParameterValue;
  }

  resetForm(form: ParameterValueFormGroup, parameterValue: ParameterValueFormGroupInput): void {
    const parameterValueRawValue = { ...this.getFormDefaults(), ...parameterValue };
    form.reset(
      {
        ...parameterValueRawValue,
        id: { value: parameterValueRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ParameterValueFormDefaults {
    return {
      id: null,
    };
  }
}
