import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICriteriaSet } from '../criteria-set.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../criteria-set.test-samples';

import { CriteriaSetService } from './criteria-set.service';

const requireRestSample: ICriteriaSet = {
  ...sampleWithRequiredData,
};

describe('CriteriaSet Service', () => {
  let service: CriteriaSetService;
  let httpMock: HttpTestingController;
  let expectedResult: ICriteriaSet | ICriteriaSet[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CriteriaSetService);
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

    it('should create a CriteriaSet', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const criteriaSet = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(criteriaSet).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CriteriaSet', () => {
      const criteriaSet = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(criteriaSet).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CriteriaSet', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CriteriaSet', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CriteriaSet', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCriteriaSetToCollectionIfMissing', () => {
      it('should add a CriteriaSet to an empty array', () => {
        const criteriaSet: ICriteriaSet = sampleWithRequiredData;
        expectedResult = service.addCriteriaSetToCollectionIfMissing([], criteriaSet);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(criteriaSet);
      });

      it('should not add a CriteriaSet to an array that contains it', () => {
        const criteriaSet: ICriteriaSet = sampleWithRequiredData;
        const criteriaSetCollection: ICriteriaSet[] = [
          {
            ...criteriaSet,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCriteriaSetToCollectionIfMissing(criteriaSetCollection, criteriaSet);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CriteriaSet to an array that doesn't contain it", () => {
        const criteriaSet: ICriteriaSet = sampleWithRequiredData;
        const criteriaSetCollection: ICriteriaSet[] = [sampleWithPartialData];
        expectedResult = service.addCriteriaSetToCollectionIfMissing(criteriaSetCollection, criteriaSet);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(criteriaSet);
      });

      it('should add only unique CriteriaSet to an array', () => {
        const criteriaSetArray: ICriteriaSet[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const criteriaSetCollection: ICriteriaSet[] = [sampleWithRequiredData];
        expectedResult = service.addCriteriaSetToCollectionIfMissing(criteriaSetCollection, ...criteriaSetArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const criteriaSet: ICriteriaSet = sampleWithRequiredData;
        const criteriaSet2: ICriteriaSet = sampleWithPartialData;
        expectedResult = service.addCriteriaSetToCollectionIfMissing([], criteriaSet, criteriaSet2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(criteriaSet);
        expect(expectedResult).toContain(criteriaSet2);
      });

      it('should accept null and undefined values', () => {
        const criteriaSet: ICriteriaSet = sampleWithRequiredData;
        expectedResult = service.addCriteriaSetToCollectionIfMissing([], null, criteriaSet, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(criteriaSet);
      });

      it('should return initial array if no CriteriaSet is added', () => {
        const criteriaSetCollection: ICriteriaSet[] = [sampleWithRequiredData];
        expectedResult = service.addCriteriaSetToCollectionIfMissing(criteriaSetCollection, undefined, null);
        expect(expectedResult).toEqual(criteriaSetCollection);
      });
    });

    describe('compareCriteriaSet', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCriteriaSet(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCriteriaSet(entity1, entity2);
        const compareResult2 = service.compareCriteriaSet(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCriteriaSet(entity1, entity2);
        const compareResult2 = service.compareCriteriaSet(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCriteriaSet(entity1, entity2);
        const compareResult2 = service.compareCriteriaSet(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
