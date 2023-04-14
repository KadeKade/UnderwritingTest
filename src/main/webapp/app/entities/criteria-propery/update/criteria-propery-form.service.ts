import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICriteriaPropery, NewCriteriaPropery } from '../criteria-propery.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICriteriaPropery for edit and NewCriteriaProperyFormGroupInput for create.
 */
type CriteriaProperyFormGroupInput = ICriteriaPropery | PartialWithRequiredKeyOf<NewCriteriaPropery>;

type CriteriaProperyFormDefaults = Pick<NewCriteriaPropery, 'id'>;

type CriteriaProperyFormGroupContent = {
  id: FormControl<ICriteriaPropery['id'] | NewCriteriaPropery['id']>;
  propertyName: FormControl<ICriteriaPropery['propertyName']>;
  displayNameDe: FormControl<ICriteriaPropery['displayNameDe']>;
  displayNameEn: FormControl<ICriteriaPropery['displayNameEn']>;
  displayNameFr: FormControl<ICriteriaPropery['displayNameFr']>;
  displayNameIt: FormControl<ICriteriaPropery['displayNameIt']>;
};

export type CriteriaProperyFormGroup = FormGroup<CriteriaProperyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CriteriaProperyFormService {
  createCriteriaProperyFormGroup(criteriaPropery: CriteriaProperyFormGroupInput = { id: null }): CriteriaProperyFormGroup {
    const criteriaProperyRawValue = {
      ...this.getFormDefaults(),
      ...criteriaPropery,
    };
    return new FormGroup<CriteriaProperyFormGroupContent>({
      id: new FormControl(
        { value: criteriaProperyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      propertyName: new FormControl(criteriaProperyRawValue.propertyName),
      displayNameDe: new FormControl(criteriaProperyRawValue.displayNameDe),
      displayNameEn: new FormControl(criteriaProperyRawValue.displayNameEn),
      displayNameFr: new FormControl(criteriaProperyRawValue.displayNameFr),
      displayNameIt: new FormControl(criteriaProperyRawValue.displayNameIt),
    });
  }

  getCriteriaPropery(form: CriteriaProperyFormGroup): ICriteriaPropery | NewCriteriaPropery {
    return form.getRawValue() as ICriteriaPropery | NewCriteriaPropery;
  }

  resetForm(form: CriteriaProperyFormGroup, criteriaPropery: CriteriaProperyFormGroupInput): void {
    const criteriaProperyRawValue = { ...this.getFormDefaults(), ...criteriaPropery };
    form.reset(
      {
        ...criteriaProperyRawValue,
        id: { value: criteriaProperyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CriteriaProperyFormDefaults {
    return {
      id: null,
    };
  }
}
