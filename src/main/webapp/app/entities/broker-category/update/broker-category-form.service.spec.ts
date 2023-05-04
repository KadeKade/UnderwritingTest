import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../broker-category.test-samples';

import { BrokerCategoryFormService } from './broker-category-form.service';

describe('BrokerCategory Form Service', () => {
  let service: BrokerCategoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokerCategoryFormService);
  });

  describe('Service methods', () => {
    describe('createBrokerCategoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBrokerCategoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            displayName: expect.any(Object),
            criteriaSets: expect.any(Object),
          })
        );
      });

      it('passing IBrokerCategory should create a new form with FormGroup', () => {
        const formGroup = service.createBrokerCategoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            displayName: expect.any(Object),
            criteriaSets: expect.any(Object),
          })
        );
      });
    });

    describe('getBrokerCategory', () => {
      it('should return NewBrokerCategory for default BrokerCategory initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBrokerCategoryFormGroup(sampleWithNewData);

        const brokerCategory = service.getBrokerCategory(formGroup) as any;

        expect(brokerCategory).toMatchObject(sampleWithNewData);
      });

      it('should return NewBrokerCategory for empty BrokerCategory initial value', () => {
        const formGroup = service.createBrokerCategoryFormGroup();

        const brokerCategory = service.getBrokerCategory(formGroup) as any;

        expect(brokerCategory).toMatchObject({});
      });

      it('should return IBrokerCategory', () => {
        const formGroup = service.createBrokerCategoryFormGroup(sampleWithRequiredData);

        const brokerCategory = service.getBrokerCategory(formGroup) as any;

        expect(brokerCategory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBrokerCategory should not enable id FormControl', () => {
        const formGroup = service.createBrokerCategoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBrokerCategory should disable id FormControl', () => {
        const formGroup = service.createBrokerCategoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
