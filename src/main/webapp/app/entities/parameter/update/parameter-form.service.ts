import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IParameter, NewParameter } from '../parameter.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IParameter for edit and NewParameterFormGroupInput for create.
 */
type ParameterFormGroupInput = IParameter | PartialWithRequiredKeyOf<NewParameter>;

type ParameterFormDefaults = Pick<NewParameter, 'id'>;

type ParameterFormGroupContent = {
  id: FormControl<IParameter['id'] | NewParameter['id']>;
  parameterName: FormControl<IParameter['parameterName']>;
  displayNameDe: FormControl<IParameter['displayNameDe']>;
  displayNameEn: FormControl<IParameter['displayNameEn']>;
  displayNameFr: FormControl<IParameter['displayNameFr']>;
  displayNameIt: FormControl<IParameter['displayNameIt']>;
};

export type ParameterFormGroup = FormGroup<ParameterFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ParameterFormService {
  createParameterFormGroup(parameter: ParameterFormGroupInput = { id: null }): ParameterFormGroup {
    const parameterRawValue = {
      ...this.getFormDefaults(),
      ...parameter,
    };
    return new FormGroup<ParameterFormGroupContent>({
      id: new FormControl(
        { value: parameterRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      parameterName: new FormControl(parameterRawValue.parameterName),
      displayNameDe: new FormControl(parameterRawValue.displayNameDe),
      displayNameEn: new FormControl(parameterRawValue.displayNameEn),
      displayNameFr: new FormControl(parameterRawValue.displayNameFr),
      displayNameIt: new FormControl(parameterRawValue.displayNameIt),
    });
  }

  getParameter(form: ParameterFormGroup): IParameter | NewParameter {
    return form.getRawValue() as IParameter | NewParameter;
  }

  resetForm(form: ParameterFormGroup, parameter: ParameterFormGroupInput): void {
    const parameterRawValue = { ...this.getFormDefaults(), ...parameter };
    form.reset(
      {
        ...parameterRawValue,
        id: { value: parameterRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ParameterFormDefaults {
    return {
      id: null,
    };
  }
}
