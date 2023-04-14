import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../action-parameter-values.test-samples';

import { ActionParameterValuesFormService } from './action-parameter-values-form.service';

describe('ActionParameterValues Form Service', () => {
  let service: ActionParameterValuesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionParameterValuesFormService);
  });

  describe('Service methods', () => {
    describe('createActionParameterValuesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createActionParameterValuesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parameterValue: expect.any(Object),
            parameter: expect.any(Object),
          })
        );
      });

      it('passing IActionParameterValues should create a new form with FormGroup', () => {
        const formGroup = service.createActionParameterValuesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parameterValue: expect.any(Object),
            parameter: expect.any(Object),
          })
        );
      });
    });

    describe('getActionParameterValues', () => {
      it('should return NewActionParameterValues for default ActionParameterValues initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createActionParameterValuesFormGroup(sampleWithNewData);

        const actionParameterValues = service.getActionParameterValues(formGroup) as any;

        expect(actionParameterValues).toMatchObject(sampleWithNewData);
      });

      it('should return NewActionParameterValues for empty ActionParameterValues initial value', () => {
        const formGroup = service.createActionParameterValuesFormGroup();

        const actionParameterValues = service.getActionParameterValues(formGroup) as any;

        expect(actionParameterValues).toMatchObject({});
      });

      it('should return IActionParameterValues', () => {
        const formGroup = service.createActionParameterValuesFormGroup(sampleWithRequiredData);

        const actionParameterValues = service.getActionParameterValues(formGroup) as any;

        expect(actionParameterValues).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IActionParameterValues should not enable id FormControl', () => {
        const formGroup = service.createActionParameterValuesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewActionParameterValues should disable id FormControl', () => {
        const formGroup = service.createActionParameterValuesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
