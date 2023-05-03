import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICriteriaParameter, NewCriteriaParameter } from '../criteria-parameter.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICriteriaParameter for edit and NewCriteriaParameterFormGroupInput for create.
 */
type CriteriaParameterFormGroupInput = ICriteriaParameter | PartialWithRequiredKeyOf<NewCriteriaParameter>;

type CriteriaParameterFormDefaults = Pick<NewCriteriaParameter, 'id'>;

type CriteriaParameterFormGroupContent = {
  id: FormControl<ICriteriaParameter['id'] | NewCriteriaParameter['id']>;
  parameterName: FormControl<ICriteriaParameter['parameterName']>;
  parameterValue: FormControl<ICriteriaParameter['parameterValue']>;
  criteria: FormControl<ICriteriaParameter['criteria']>;
};

export type CriteriaParameterFormGroup = FormGroup<CriteriaParameterFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CriteriaParameterFormService {
  createCriteriaParameterFormGroup(criteriaParameter: CriteriaParameterFormGroupInput = { id: null }): CriteriaParameterFormGroup {
    const criteriaParameterRawValue = {
      ...this.getFormDefaults(),
      ...criteriaParameter,
    };
    return new FormGroup<CriteriaParameterFormGroupContent>({
      id: new FormControl(
        { value: criteriaParameterRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      parameterName: new FormControl(criteriaParameterRawValue.parameterName),
      parameterValue: new FormControl(criteriaParameterRawValue.parameterValue),
      criteria: new FormControl(criteriaParameterRawValue.criteria),
    });
  }

  getCriteriaParameter(form: CriteriaParameterFormGroup): ICriteriaParameter | NewCriteriaParameter {
    return form.getRawValue() as ICriteriaParameter | NewCriteriaParameter;
  }

  resetForm(form: CriteriaParameterFormGroup, criteriaParameter: CriteriaParameterFormGroupInput): void {
    const criteriaParameterRawValue = { ...this.getFormDefaults(), ...criteriaParameter };
    form.reset(
      {
        ...criteriaParameterRawValue,
        id: { value: criteriaParameterRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CriteriaParameterFormDefaults {
    return {
      id: null,
    };
  }
}
