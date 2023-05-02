import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../automated-action.test-samples';

import { AutomatedActionFormService } from './automated-action-form.service';

describe('AutomatedAction Form Service', () => {
  let service: AutomatedActionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomatedActionFormService);
  });

  describe('Service methods', () => {
    describe('createAutomatedActionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAutomatedActionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            positiveActionDefinition: expect.any(Object),
            negativeActionDefinition: expect.any(Object),
            displayNameDe: expect.any(Object),
            displayNameEn: expect.any(Object),
            displayNameFr: expect.any(Object),
            displayNameIt: expect.any(Object),
          })
        );
      });

      it('passing IAutomatedAction should create a new form with FormGroup', () => {
        const formGroup = service.createAutomatedActionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            positiveActionDefinition: expect.any(Object),
            negativeActionDefinition: expect.any(Object),
            displayNameDe: expect.any(Object),
            displayNameEn: expect.any(Object),
            displayNameFr: expect.any(Object),
            displayNameIt: expect.any(Object),
          })
        );
      });
    });

    describe('getAutomatedAction', () => {
      it('should return NewAutomatedAction for default AutomatedAction initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAutomatedActionFormGroup(sampleWithNewData);

        const automatedAction = service.getAutomatedAction(formGroup) as any;

        expect(automatedAction).toMatchObject(sampleWithNewData);
      });

      it('should return NewAutomatedAction for empty AutomatedAction initial value', () => {
        const formGroup = service.createAutomatedActionFormGroup();

        const automatedAction = service.getAutomatedAction(formGroup) as any;

        expect(automatedAction).toMatchObject({});
      });

      it('should return IAutomatedAction', () => {
        const formGroup = service.createAutomatedActionFormGroup(sampleWithRequiredData);

        const automatedAction = service.getAutomatedAction(formGroup) as any;

        expect(automatedAction).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAutomatedAction should not enable id FormControl', () => {
        const formGroup = service.createAutomatedActionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAutomatedAction should disable id FormControl', () => {
        const formGroup = service.createAutomatedActionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
