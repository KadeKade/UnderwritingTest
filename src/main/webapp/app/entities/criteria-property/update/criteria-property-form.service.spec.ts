import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../criteria-property.test-samples';

import { CriteriaPropertyFormService } from './criteria-property-form.service';

describe('CriteriaProperty Form Service', () => {
  let service: CriteriaPropertyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriteriaPropertyFormService);
  });

  describe('Service methods', () => {
    describe('createCriteriaPropertyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCriteriaPropertyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            propertyName: expect.any(Object),
            propertyType: expect.any(Object),
            displayNameDe: expect.any(Object),
            displayNameEn: expect.any(Object),
            displayNameFr: expect.any(Object),
            displayNameIt: expect.any(Object),
          })
        );
      });

      it('passing ICriteriaProperty should create a new form with FormGroup', () => {
        const formGroup = service.createCriteriaPropertyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            propertyName: expect.any(Object),
            propertyType: expect.any(Object),
            displayNameDe: expect.any(Object),
            displayNameEn: expect.any(Object),
            displayNameFr: expect.any(Object),
            displayNameIt: expect.any(Object),
          })
        );
      });
    });

    describe('getCriteriaProperty', () => {
      it('should return NewCriteriaProperty for default CriteriaProperty initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCriteriaPropertyFormGroup(sampleWithNewData);

        const criteriaProperty = service.getCriteriaProperty(formGroup) as any;

        expect(criteriaProperty).toMatchObject(sampleWithNewData);
      });

      it('should return NewCriteriaProperty for empty CriteriaProperty initial value', () => {
        const formGroup = service.createCriteriaPropertyFormGroup();

        const criteriaProperty = service.getCriteriaProperty(formGroup) as any;

        expect(criteriaProperty).toMatchObject({});
      });

      it('should return ICriteriaProperty', () => {
        const formGroup = service.createCriteriaPropertyFormGroup(sampleWithRequiredData);

        const criteriaProperty = service.getCriteriaProperty(formGroup) as any;

        expect(criteriaProperty).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICriteriaProperty should not enable id FormControl', () => {
        const formGroup = service.createCriteriaPropertyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCriteriaProperty should disable id FormControl', () => {
        const formGroup = service.createCriteriaPropertyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
