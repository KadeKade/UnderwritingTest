import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../criteria-set.test-samples';

import { CriteriaSetFormService } from './criteria-set-form.service';

describe('CriteriaSet Form Service', () => {
  let service: CriteriaSetFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriteriaSetFormService);
  });

  describe('Service methods', () => {
    describe('createCriteriaSetFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCriteriaSetFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            insurerId: expect.any(Object),
            lobId: expect.any(Object),
            automatedAction: expect.any(Object),
          })
        );
      });

      it('passing ICriteriaSet should create a new form with FormGroup', () => {
        const formGroup = service.createCriteriaSetFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            insurerId: expect.any(Object),
            lobId: expect.any(Object),
            automatedAction: expect.any(Object),
          })
        );
      });
    });

    describe('getCriteriaSet', () => {
      it('should return NewCriteriaSet for default CriteriaSet initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCriteriaSetFormGroup(sampleWithNewData);

        const criteriaSet = service.getCriteriaSet(formGroup) as any;

        expect(criteriaSet).toMatchObject(sampleWithNewData);
      });

      it('should return NewCriteriaSet for empty CriteriaSet initial value', () => {
        const formGroup = service.createCriteriaSetFormGroup();

        const criteriaSet = service.getCriteriaSet(formGroup) as any;

        expect(criteriaSet).toMatchObject({});
      });

      it('should return ICriteriaSet', () => {
        const formGroup = service.createCriteriaSetFormGroup(sampleWithRequiredData);

        const criteriaSet = service.getCriteriaSet(formGroup) as any;

        expect(criteriaSet).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICriteriaSet should not enable id FormControl', () => {
        const formGroup = service.createCriteriaSetFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCriteriaSet should disable id FormControl', () => {
        const formGroup = service.createCriteriaSetFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
