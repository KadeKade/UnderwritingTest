import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../action-parameter.test-samples';

import { ActionParameterFormService } from './action-parameter-form.service';

describe('ActionParameter Form Service', () => {
  let service: ActionParameterFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionParameterFormService);
  });

  describe('Service methods', () => {
    describe('createActionParameterFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createActionParameterFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parameterKey: expect.any(Object),
            parameterValue: expect.any(Object),
            criteria: expect.any(Object),
          })
        );
      });

      it('passing IActionParameter should create a new form with FormGroup', () => {
        const formGroup = service.createActionParameterFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parameterKey: expect.any(Object),
            parameterValue: expect.any(Object),
            criteria: expect.any(Object),
          })
        );
      });
    });

    describe('getActionParameter', () => {
      it('should return NewActionParameter for default ActionParameter initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createActionParameterFormGroup(sampleWithNewData);

        const actionParameter = service.getActionParameter(formGroup) as any;

        expect(actionParameter).toMatchObject(sampleWithNewData);
      });

      it('should return NewActionParameter for empty ActionParameter initial value', () => {
        const formGroup = service.createActionParameterFormGroup();

        const actionParameter = service.getActionParameter(formGroup) as any;

        expect(actionParameter).toMatchObject({});
      });

      it('should return IActionParameter', () => {
        const formGroup = service.createActionParameterFormGroup(sampleWithRequiredData);

        const actionParameter = service.getActionParameter(formGroup) as any;

        expect(actionParameter).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IActionParameter should not enable id FormControl', () => {
        const formGroup = service.createActionParameterFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewActionParameter should disable id FormControl', () => {
        const formGroup = service.createActionParameterFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
