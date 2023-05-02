import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICriteriaProperty, NewCriteriaProperty } from '../criteria-property.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICriteriaProperty for edit and NewCriteriaPropertyFormGroupInput for create.
 */
type CriteriaPropertyFormGroupInput = ICriteriaProperty | PartialWithRequiredKeyOf<NewCriteriaProperty>;

type CriteriaPropertyFormDefaults = Pick<NewCriteriaProperty, 'id'>;

type CriteriaPropertyFormGroupContent = {
  id: FormControl<ICriteriaProperty['id'] | NewCriteriaProperty['id']>;
  propertyName: FormControl<ICriteriaProperty['propertyName']>;
  propertyType: FormControl<ICriteriaProperty['propertyType']>;
  displayNameDe: FormControl<ICriteriaProperty['displayNameDe']>;
  displayNameEn: FormControl<ICriteriaProperty['displayNameEn']>;
  displayNameFr: FormControl<ICriteriaProperty['displayNameFr']>;
  displayNameIt: FormControl<ICriteriaProperty['displayNameIt']>;
  property: FormControl<ICriteriaProperty['property']>;
};

export type CriteriaPropertyFormGroup = FormGroup<CriteriaPropertyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CriteriaPropertyFormService {
  createCriteriaPropertyFormGroup(criteriaProperty: CriteriaPropertyFormGroupInput = { id: null }): CriteriaPropertyFormGroup {
    const criteriaPropertyRawValue = {
      ...this.getFormDefaults(),
      ...criteriaProperty,
    };
    return new FormGroup<CriteriaPropertyFormGroupContent>({
      id: new FormControl(
        { value: criteriaPropertyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      propertyName: new FormControl(criteriaPropertyRawValue.propertyName),
      propertyType: new FormControl(criteriaPropertyRawValue.propertyType),
      displayNameDe: new FormControl(criteriaPropertyRawValue.displayNameDe),
      displayNameEn: new FormControl(criteriaPropertyRawValue.displayNameEn),
      displayNameFr: new FormControl(criteriaPropertyRawValue.displayNameFr),
      displayNameIt: new FormControl(criteriaPropertyRawValue.displayNameIt),
      property: new FormControl(criteriaPropertyRawValue.property),
    });
  }

  getCriteriaProperty(form: CriteriaPropertyFormGroup): ICriteriaProperty | NewCriteriaProperty {
    return form.getRawValue() as ICriteriaProperty | NewCriteriaProperty;
  }

  resetForm(form: CriteriaPropertyFormGroup, criteriaProperty: CriteriaPropertyFormGroupInput): void {
    const criteriaPropertyRawValue = { ...this.getFormDefaults(), ...criteriaProperty };
    form.reset(
      {
        ...criteriaPropertyRawValue,
        id: { value: criteriaPropertyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CriteriaPropertyFormDefaults {
    return {
      id: null,
    };
  }
}
