import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../parameter-value.test-samples';

import { ParameterValueFormService } from './parameter-value-form.service';

describe('ParameterValue Form Service', () => {
  let service: ParameterValueFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParameterValueFormService);
  });

  describe('Service methods', () => {
    describe('createParameterValueFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createParameterValueFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            actionParameterValue: expect.any(Object),
            actionParameter: expect.any(Object),
            criteria: expect.any(Object),
          })
        );
      });

      it('passing IParameterValue should create a new form with FormGroup', () => {
        const formGroup = service.createParameterValueFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            actionParameterValue: expect.any(Object),
            actionParameter: expect.any(Object),
            criteria: expect.any(Object),
          })
        );
      });
    });

    describe('getParameterValue', () => {
      it('should return NewParameterValue for default ParameterValue initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createParameterValueFormGroup(sampleWithNewData);

        const parameterValue = service.getParameterValue(formGroup) as any;

        expect(parameterValue).toMatchObject(sampleWithNewData);
      });

      it('should return NewParameterValue for empty ParameterValue initial value', () => {
        const formGroup = service.createParameterValueFormGroup();

        const parameterValue = service.getParameterValue(formGroup) as any;

        expect(parameterValue).toMatchObject({});
      });

      it('should return IParameterValue', () => {
        const formGroup = service.createParameterValueFormGroup(sampleWithRequiredData);

        const parameterValue = service.getParameterValue(formGroup) as any;

        expect(parameterValue).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IParameterValue should not enable id FormControl', () => {
        const formGroup = service.createParameterValueFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewParameterValue should disable id FormControl', () => {
        const formGroup = service.createParameterValueFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
