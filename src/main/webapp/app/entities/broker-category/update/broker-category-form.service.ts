import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBrokerCategory, NewBrokerCategory } from '../broker-category.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBrokerCategory for edit and NewBrokerCategoryFormGroupInput for create.
 */
type BrokerCategoryFormGroupInput = IBrokerCategory | PartialWithRequiredKeyOf<NewBrokerCategory>;

type BrokerCategoryFormDefaults = Pick<NewBrokerCategory, 'id' | 'criteriaSets'>;

type BrokerCategoryFormGroupContent = {
  id: FormControl<IBrokerCategory['id'] | NewBrokerCategory['id']>;
  displayName: FormControl<IBrokerCategory['displayName']>;
  criteriaSets: FormControl<IBrokerCategory['criteriaSets']>;
};

export type BrokerCategoryFormGroup = FormGroup<BrokerCategoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BrokerCategoryFormService {
  createBrokerCategoryFormGroup(brokerCategory: BrokerCategoryFormGroupInput = { id: null }): BrokerCategoryFormGroup {
    const brokerCategoryRawValue = {
      ...this.getFormDefaults(),
      ...brokerCategory,
    };
    return new FormGroup<BrokerCategoryFormGroupContent>({
      id: new FormControl(
        { value: brokerCategoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      displayName: new FormControl(brokerCategoryRawValue.displayName),
      criteriaSets: new FormControl(brokerCategoryRawValue.criteriaSets ?? []),
    });
  }

  getBrokerCategory(form: BrokerCategoryFormGroup): IBrokerCategory | NewBrokerCategory {
    return form.getRawValue() as IBrokerCategory | NewBrokerCategory;
  }

  resetForm(form: BrokerCategoryFormGroup, brokerCategory: BrokerCategoryFormGroupInput): void {
    const brokerCategoryRawValue = { ...this.getFormDefaults(), ...brokerCategory };
    form.reset(
      {
        ...brokerCategoryRawValue,
        id: { value: brokerCategoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BrokerCategoryFormDefaults {
    return {
      id: null,
      criteriaSets: [],
    };
  }
}
