import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICriteriaSet, NewCriteriaSet } from '../criteria-set.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICriteriaSet for edit and NewCriteriaSetFormGroupInput for create.
 */
type CriteriaSetFormGroupInput = ICriteriaSet | PartialWithRequiredKeyOf<NewCriteriaSet>;

type CriteriaSetFormDefaults = Pick<NewCriteriaSet, 'id'>;

type CriteriaSetFormGroupContent = {
  id: FormControl<ICriteriaSet['id'] | NewCriteriaSet['id']>;
  name: FormControl<ICriteriaSet['name']>;
  insurerId: FormControl<ICriteriaSet['insurerId']>;
  lobId: FormControl<ICriteriaSet['lobId']>;
  positiveAction: FormControl<ICriteriaSet['positiveAction']>;
  positiveActionParameters: FormControl<ICriteriaSet['positiveActionParameters']>;
  negativeAction: FormControl<ICriteriaSet['negativeAction']>;
  negativeActionParameters: FormControl<ICriteriaSet['negativeActionParameters']>;
};

export type CriteriaSetFormGroup = FormGroup<CriteriaSetFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CriteriaSetFormService {
  createCriteriaSetFormGroup(criteriaSet: CriteriaSetFormGroupInput = { id: null }): CriteriaSetFormGroup {
    const criteriaSetRawValue = {
      ...this.getFormDefaults(),
      ...criteriaSet,
    };
    return new FormGroup<CriteriaSetFormGroupContent>({
      id: new FormControl(
        { value: criteriaSetRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(criteriaSetRawValue.name),
      insurerId: new FormControl(criteriaSetRawValue.insurerId),
      lobId: new FormControl(criteriaSetRawValue.lobId),
      positiveAction: new FormControl(criteriaSetRawValue.positiveAction),
      positiveActionParameters: new FormControl(criteriaSetRawValue.positiveActionParameters),
      negativeAction: new FormControl(criteriaSetRawValue.negativeAction),
      negativeActionParameters: new FormControl(criteriaSetRawValue.negativeActionParameters),
    });
  }

  getCriteriaSet(form: CriteriaSetFormGroup): ICriteriaSet | NewCriteriaSet {
    return form.getRawValue() as ICriteriaSet | NewCriteriaSet;
  }

  resetForm(form: CriteriaSetFormGroup, criteriaSet: CriteriaSetFormGroupInput): void {
    const criteriaSetRawValue = { ...this.getFormDefaults(), ...criteriaSet };
    form.reset(
      {
        ...criteriaSetRawValue,
        id: { value: criteriaSetRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CriteriaSetFormDefaults {
    return {
      id: null,
    };
  }
}
