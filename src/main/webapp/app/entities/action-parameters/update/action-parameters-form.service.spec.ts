import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../action-parameters.test-samples';

import { ActionParametersFormService } from './action-parameters-form.service';

describe('ActionParameters Form Service', () => {
  let service: ActionParametersFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionParametersFormService);
  });

  describe('Service methods', () => {
    describe('createActionParametersFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createActionParametersFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parameterName: expect.any(Object),
            displayNameDe: expect.any(Object),
            displayNameEn: expect.any(Object),
            displayNameFr: expect.any(Object),
            displayNameIt: expect.any(Object),
          })
        );
      });

      it('passing IActionParameters should create a new form with FormGroup', () => {
        const formGroup = service.createActionParametersFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parameterName: expect.any(Object),
            displayNameDe: expect.any(Object),
            displayNameEn: expect.any(Object),
            displayNameFr: expect.any(Object),
            displayNameIt: expect.any(Object),
          })
        );
      });
    });

    describe('getActionParameters', () => {
      it('should return NewActionParameters for default ActionParameters initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createActionParametersFormGroup(sampleWithNewData);

        const actionParameters = service.getActionParameters(formGroup) as any;

        expect(actionParameters).toMatchObject(sampleWithNewData);
      });

      it('should return NewActionParameters for empty ActionParameters initial value', () => {
        const formGroup = service.createActionParametersFormGroup();

        const actionParameters = service.getActionParameters(formGroup) as any;

        expect(actionParameters).toMatchObject({});
      });

      it('should return IActionParameters', () => {
        const formGroup = service.createActionParametersFormGroup(sampleWithRequiredData);

        const actionParameters = service.getActionParameters(formGroup) as any;

        expect(actionParameters).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IActionParameters should not enable id FormControl', () => {
        const formGroup = service.createActionParametersFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewActionParameters should disable id FormControl', () => {
        const formGroup = service.createActionParametersFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
