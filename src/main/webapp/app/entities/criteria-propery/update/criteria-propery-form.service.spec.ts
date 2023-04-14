import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../criteria-propery.test-samples';

import { CriteriaProperyFormService } from './criteria-propery-form.service';

describe('CriteriaPropery Form Service', () => {
  let service: CriteriaProperyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriteriaProperyFormService);
  });

  describe('Service methods', () => {
    describe('createCriteriaProperyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCriteriaProperyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            propertyName: expect.any(Object),
            displayNameDe: expect.any(Object),
            displayNameEn: expect.any(Object),
            displayNameFr: expect.any(Object),
            displayNameIt: expect.any(Object),
          })
        );
      });

      it('passing ICriteriaPropery should create a new form with FormGroup', () => {
        const formGroup = service.createCriteriaProperyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            propertyName: expect.any(Object),
            displayNameDe: expect.any(Object),
            displayNameEn: expect.any(Object),
            displayNameFr: expect.any(Object),
            displayNameIt: expect.any(Object),
          })
        );
      });
    });

    describe('getCriteriaPropery', () => {
      it('should return NewCriteriaPropery for default CriteriaPropery initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCriteriaProperyFormGroup(sampleWithNewData);

        const criteriaPropery = service.getCriteriaPropery(formGroup) as any;

        expect(criteriaPropery).toMatchObject(sampleWithNewData);
      });

      it('should return NewCriteriaPropery for empty CriteriaPropery initial value', () => {
        const formGroup = service.createCriteriaProperyFormGroup();

        const criteriaPropery = service.getCriteriaPropery(formGroup) as any;

        expect(criteriaPropery).toMatchObject({});
      });

      it('should return ICriteriaPropery', () => {
        const formGroup = service.createCriteriaProperyFormGroup(sampleWithRequiredData);

        const criteriaPropery = service.getCriteriaPropery(formGroup) as any;

        expect(criteriaPropery).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICriteriaPropery should not enable id FormControl', () => {
        const formGroup = service.createCriteriaProperyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCriteriaPropery should disable id FormControl', () => {
        const formGroup = service.createCriteriaProperyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
