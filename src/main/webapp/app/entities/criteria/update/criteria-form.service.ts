import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICriteria, NewCriteria } from '../criteria.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICriteria for edit and NewCriteriaFormGroupInput for create.
 */
type CriteriaFormGroupInput = ICriteria | PartialWithRequiredKeyOf<NewCriteria>;

type CriteriaFormDefaults = Pick<NewCriteria, 'id'>;

type CriteriaFormGroupContent = {
  id: FormControl<ICriteria['id'] | NewCriteria['id']>;
  operator: FormControl<ICriteria['operator']>;
  propertyValue: FormControl<ICriteria['propertyValue']>;
  property: FormControl<ICriteria['property']>;
  criteria: FormControl<ICriteria['criteria']>;
};

export type CriteriaFormGroup = FormGroup<CriteriaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CriteriaFormService {
  createCriteriaFormGroup(criteria: CriteriaFormGroupInput = { id: null }): CriteriaFormGroup {
    const criteriaRawValue = {
      ...this.getFormDefaults(),
      ...criteria,
    };
    return new FormGroup<CriteriaFormGroupContent>({
      id: new FormControl(
        { value: criteriaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      operator: new FormControl(criteriaRawValue.operator),
      propertyValue: new FormControl(criteriaRawValue.propertyValue),
      property: new FormControl(criteriaRawValue.property),
      criteria: new FormControl(criteriaRawValue.criteria),
    });
  }

  getCriteria(form: CriteriaFormGroup): ICriteria | NewCriteria {
    return form.getRawValue() as ICriteria | NewCriteria;
  }

  resetForm(form: CriteriaFormGroup, criteria: CriteriaFormGroupInput): void {
    const criteriaRawValue = { ...this.getFormDefaults(), ...criteria };
    form.reset(
      {
        ...criteriaRawValue,
        id: { value: criteriaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CriteriaFormDefaults {
    return {
      id: null,
    };
  }
}
