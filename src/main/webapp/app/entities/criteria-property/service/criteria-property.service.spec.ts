import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICriteriaProperty } from '../criteria-property.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../criteria-property.test-samples';

import { CriteriaPropertyService } from './criteria-property.service';

const requireRestSample: ICriteriaProperty = {
  ...sampleWithRequiredData,
};

describe('CriteriaProperty Service', () => {
  let service: CriteriaPropertyService;
  let httpMock: HttpTestingController;
  let expectedResult: ICriteriaProperty | ICriteriaProperty[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CriteriaPropertyService);
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

    it('should create a CriteriaProperty', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const criteriaProperty = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(criteriaProperty).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CriteriaProperty', () => {
      const criteriaProperty = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(criteriaProperty).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CriteriaProperty', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CriteriaProperty', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CriteriaProperty', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCriteriaPropertyToCollectionIfMissing', () => {
      it('should add a CriteriaProperty to an empty array', () => {
        const criteriaProperty: ICriteriaProperty = sampleWithRequiredData;
        expectedResult = service.addCriteriaPropertyToCollectionIfMissing([], criteriaProperty);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(criteriaProperty);
      });

      it('should not add a CriteriaProperty to an array that contains it', () => {
        const criteriaProperty: ICriteriaProperty = sampleWithRequiredData;
        const criteriaPropertyCollection: ICriteriaProperty[] = [
          {
            ...criteriaProperty,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCriteriaPropertyToCollectionIfMissing(criteriaPropertyCollection, criteriaProperty);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CriteriaProperty to an array that doesn't contain it", () => {
        const criteriaProperty: ICriteriaProperty = sampleWithRequiredData;
        const criteriaPropertyCollection: ICriteriaProperty[] = [sampleWithPartialData];
        expectedResult = service.addCriteriaPropertyToCollectionIfMissing(criteriaPropertyCollection, criteriaProperty);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(criteriaProperty);
      });

      it('should add only unique CriteriaProperty to an array', () => {
        const criteriaPropertyArray: ICriteriaProperty[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const criteriaPropertyCollection: ICriteriaProperty[] = [sampleWithRequiredData];
        expectedResult = service.addCriteriaPropertyToCollectionIfMissing(criteriaPropertyCollection, ...criteriaPropertyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const criteriaProperty: ICriteriaProperty = sampleWithRequiredData;
        const criteriaProperty2: ICriteriaProperty = sampleWithPartialData;
        expectedResult = service.addCriteriaPropertyToCollectionIfMissing([], criteriaProperty, criteriaProperty2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(criteriaProperty);
        expect(expectedResult).toContain(criteriaProperty2);
      });

      it('should accept null and undefined values', () => {
        const criteriaProperty: ICriteriaProperty = sampleWithRequiredData;
        expectedResult = service.addCriteriaPropertyToCollectionIfMissing([], null, criteriaProperty, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(criteriaProperty);
      });

      it('should return initial array if no CriteriaProperty is added', () => {
        const criteriaPropertyCollection: ICriteriaProperty[] = [sampleWithRequiredData];
        expectedResult = service.addCriteriaPropertyToCollectionIfMissing(criteriaPropertyCollection, undefined, null);
        expect(expectedResult).toEqual(criteriaPropertyCollection);
      });
    });

    describe('compareCriteriaProperty', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCriteriaProperty(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCriteriaProperty(entity1, entity2);
        const compareResult2 = service.compareCriteriaProperty(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCriteriaProperty(entity1, entity2);
        const compareResult2 = service.compareCriteriaProperty(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCriteriaProperty(entity1, entity2);
        const compareResult2 = service.compareCriteriaProperty(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
