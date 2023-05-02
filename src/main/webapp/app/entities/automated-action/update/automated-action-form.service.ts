import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAutomatedAction, NewAutomatedAction } from '../automated-action.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAutomatedAction for edit and NewAutomatedActionFormGroupInput for create.
 */
type AutomatedActionFormGroupInput = IAutomatedAction | PartialWithRequiredKeyOf<NewAutomatedAction>;

type AutomatedActionFormDefaults = Pick<NewAutomatedAction, 'id'>;

type AutomatedActionFormGroupContent = {
  id: FormControl<IAutomatedAction['id'] | NewAutomatedAction['id']>;
  type: FormControl<IAutomatedAction['type']>;
  positiveActionDefinition: FormControl<IAutomatedAction['positiveActionDefinition']>;
  negativeActionDefinition: FormControl<IAutomatedAction['negativeActionDefinition']>;
  negativeActionPropertyValue: FormControl<IAutomatedAction['negativeActionPropertyValue']>;
  displayNameDe: FormControl<IAutomatedAction['displayNameDe']>;
  displayNameEn: FormControl<IAutomatedAction['displayNameEn']>;
  displayNameFr: FormControl<IAutomatedAction['displayNameFr']>;
  displayNameIt: FormControl<IAutomatedAction['displayNameIt']>;
};

export type AutomatedActionFormGroup = FormGroup<AutomatedActionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AutomatedActionFormService {
  createAutomatedActionFormGroup(automatedAction: AutomatedActionFormGroupInput = { id: null }): AutomatedActionFormGroup {
    const automatedActionRawValue = {
      ...this.getFormDefaults(),
      ...automatedAction,
    };
    return new FormGroup<AutomatedActionFormGroupContent>({
      id: new FormControl(
        { value: automatedActionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      type: new FormControl(automatedActionRawValue.type),
      positiveActionDefinition: new FormControl(automatedActionRawValue.positiveActionDefinition),
      negativeActionDefinition: new FormControl(automatedActionRawValue.negativeActionDefinition),
      negativeActionPropertyValue: new FormControl(automatedActionRawValue.negativeActionPropertyValue),
      displayNameDe: new FormControl(automatedActionRawValue.displayNameDe),
      displayNameEn: new FormControl(automatedActionRawValue.displayNameEn),
      displayNameFr: new FormControl(automatedActionRawValue.displayNameFr),
      displayNameIt: new FormControl(automatedActionRawValue.displayNameIt),
    });
  }

  getAutomatedAction(form: AutomatedActionFormGroup): IAutomatedAction | NewAutomatedAction {
    return form.getRawValue() as IAutomatedAction | NewAutomatedAction;
  }

  resetForm(form: AutomatedActionFormGroup, automatedAction: AutomatedActionFormGroupInput): void {
    const automatedActionRawValue = { ...this.getFormDefaults(), ...automatedAction };
    form.reset(
      {
        ...automatedActionRawValue,
        id: { value: automatedActionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AutomatedActionFormDefaults {
    return {
      id: null,
    };
  }
}
