import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBrokerCategory } from '../broker-category.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../broker-category.test-samples';

import { BrokerCategoryService } from './broker-category.service';

const requireRestSample: IBrokerCategory = {
  ...sampleWithRequiredData,
};

describe('BrokerCategory Service', () => {
  let service: BrokerCategoryService;
  let httpMock: HttpTestingController;
  let expectedResult: IBrokerCategory | IBrokerCategory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BrokerCategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a BrokerCategory', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const brokerCategory = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(brokerCategory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BrokerCategory', () => {
      const brokerCategory = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(brokerCategory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BrokerCategory', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BrokerCategory', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BrokerCategory', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBrokerCategoryToCollectionIfMissing', () => {
      it('should add a BrokerCategory to an empty array', () => {
        const brokerCategory: IBrokerCategory = sampleWithRequiredData;
        expectedResult = service.addBrokerCategoryToCollectionIfMissing([], brokerCategory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(brokerCategory);
      });

      it('should not add a BrokerCategory to an array that contains it', () => {
        const brokerCategory: IBrokerCategory = sampleWithRequiredData;
        const brokerCategoryCollection: IBrokerCategory[] = [
          {
            ...brokerCategory,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBrokerCategoryToCollectionIfMissing(brokerCategoryCollection, brokerCategory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BrokerCategory to an array that doesn't contain it", () => {
        const brokerCategory: IBrokerCategory = sampleWithRequiredData;
        const brokerCategoryCollection: IBrokerCategory[] = [sampleWithPartialData];
        expectedResult = service.addBrokerCategoryToCollectionIfMissing(brokerCategoryCollection, brokerCategory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(brokerCategory);
      });

      it('should add only unique BrokerCategory to an array', () => {
        const brokerCategoryArray: IBrokerCategory[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const brokerCategoryCollection: IBrokerCategory[] = [sampleWithRequiredData];
        expectedResult = service.addBrokerCategoryToCollectionIfMissing(brokerCategoryCollection, ...brokerCategoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const brokerCategory: IBrokerCategory = sampleWithRequiredData;
        const brokerCategory2: IBrokerCategory = sampleWithPartialData;
        expectedResult = service.addBrokerCategoryToCollectionIfMissing([], brokerCategory, brokerCategory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(brokerCategory);
        expect(expectedResult).toContain(brokerCategory2);
      });

      it('should accept null and undefined values', () => {
        const brokerCategory: IBrokerCategory = sampleWithRequiredData;
        expectedResult = service.addBrokerCategoryToCollectionIfMissing([], null, brokerCategory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(brokerCategory);
      });

      it('should return initial array if no BrokerCategory is added', () => {
        const brokerCategoryCollection: IBrokerCategory[] = [sampleWithRequiredData];
        expectedResult = service.addBrokerCategoryToCollectionIfMissing(brokerCategoryCollection, undefined, null);
        expect(expectedResult).toEqual(brokerCategoryCollection);
      });
    });

    describe('compareBrokerCategory', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBrokerCategory(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBrokerCategory(entity1, entity2);
        const compareResult2 = service.compareBrokerCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBrokerCategory(entity1, entity2);
        const compareResult2 = service.compareBrokerCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBrokerCategory(entity1, entity2);
        const compareResult2 = service.compareBrokerCategory(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
