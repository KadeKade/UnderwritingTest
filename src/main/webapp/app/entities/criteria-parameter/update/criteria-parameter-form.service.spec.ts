import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../criteria-parameter.test-samples';

import { CriteriaParameterFormService } from './criteria-parameter-form.service';

describe('CriteriaParameter Form Service', () => {
  let service: CriteriaParameterFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriteriaParameterFormService);
  });

  describe('Service methods', () => {
    describe('createCriteriaParameterFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCriteriaParameterFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parameterKey: expect.any(Object),
            parameterValue: expect.any(Object),
            criteria: expect.any(Object),
          })
        );
      });

      it('passing ICriteriaParameter should create a new form with FormGroup', () => {
        const formGroup = service.createCriteriaParameterFormGroup(sampleWithRequiredData);

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

    describe('getCriteriaParameter', () => {
      it('should return NewCriteriaParameter for default CriteriaParameter initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCriteriaParameterFormGroup(sampleWithNewData);

        const criteriaParameter = service.getCriteriaParameter(formGroup) as any;

        expect(criteriaParameter).toMatchObject(sampleWithNewData);
      });

      it('should return NewCriteriaParameter for empty CriteriaParameter initial value', () => {
        const formGroup = service.createCriteriaParameterFormGroup();

        const criteriaParameter = service.getCriteriaParameter(formGroup) as any;

        expect(criteriaParameter).toMatchObject({});
      });

      it('should return ICriteriaParameter', () => {
        const formGroup = service.createCriteriaParameterFormGroup(sampleWithRequiredData);

        const criteriaParameter = service.getCriteriaParameter(formGroup) as any;

        expect(criteriaParameter).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICriteriaParameter should not enable id FormControl', () => {
        const formGroup = service.createCriteriaParameterFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCriteriaParameter should disable id FormControl', () => {
        const formGroup = service.createCriteriaParameterFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
