import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICriteriaParameter } from '../criteria-parameter.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../criteria-parameter.test-samples';

import { CriteriaParameterService } from './criteria-parameter.service';

const requireRestSample: ICriteriaParameter = {
  ...sampleWithRequiredData,
};

describe('CriteriaParameter Service', () => {
  let service: CriteriaParameterService;
  let httpMock: HttpTestingController;
  let expectedResult: ICriteriaParameter | ICriteriaParameter[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CriteriaParameterService);
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

    it('should create a CriteriaParameter', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const criteriaParameter = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(criteriaParameter).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CriteriaParameter', () => {
      const criteriaParameter = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(criteriaParameter).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CriteriaParameter', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CriteriaParameter', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CriteriaParameter', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCriteriaParameterToCollectionIfMissing', () => {
      it('should add a CriteriaParameter to an empty array', () => {
        const criteriaParameter: ICriteriaParameter = sampleWithRequiredData;
        expectedResult = service.addCriteriaParameterToCollectionIfMissing([], criteriaParameter);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(criteriaParameter);
      });

      it('should not add a CriteriaParameter to an array that contains it', () => {
        const criteriaParameter: ICriteriaParameter = sampleWithRequiredData;
        const criteriaParameterCollection: ICriteriaParameter[] = [
          {
            ...criteriaParameter,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCriteriaParameterToCollectionIfMissing(criteriaParameterCollection, criteriaParameter);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CriteriaParameter to an array that doesn't contain it", () => {
        const criteriaParameter: ICriteriaParameter = sampleWithRequiredData;
        const criteriaParameterCollection: ICriteriaParameter[] = [sampleWithPartialData];
        expectedResult = service.addCriteriaParameterToCollectionIfMissing(criteriaParameterCollection, criteriaParameter);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(criteriaParameter);
      });

      it('should add only unique CriteriaParameter to an array', () => {
        const criteriaParameterArray: ICriteriaParameter[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const criteriaParameterCollection: ICriteriaParameter[] = [sampleWithRequiredData];
        expectedResult = service.addCriteriaParameterToCollectionIfMissing(criteriaParameterCollection, ...criteriaParameterArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const criteriaParameter: ICriteriaParameter = sampleWithRequiredData;
        const criteriaParameter2: ICriteriaParameter = sampleWithPartialData;
        expectedResult = service.addCriteriaParameterToCollectionIfMissing([], criteriaParameter, criteriaParameter2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(criteriaParameter);
        expect(expectedResult).toContain(criteriaParameter2);
      });

      it('should accept null and undefined values', () => {
        const criteriaParameter: ICriteriaParameter = sampleWithRequiredData;
        expectedResult = service.addCriteriaParameterToCollectionIfMissing([], null, criteriaParameter, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(criteriaParameter);
      });

      it('should return initial array if no CriteriaParameter is added', () => {
        const criteriaParameterCollection: ICriteriaParameter[] = [sampleWithRequiredData];
        expectedResult = service.addCriteriaParameterToCollectionIfMissing(criteriaParameterCollection, undefined, null);
        expect(expectedResult).toEqual(criteriaParameterCollection);
      });
    });

    describe('compareCriteriaParameter', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCriteriaParameter(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCriteriaParameter(entity1, entity2);
        const compareResult2 = service.compareCriteriaParameter(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCriteriaParameter(entity1, entity2);
        const compareResult2 = service.compareCriteriaParameter(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCriteriaParameter(entity1, entity2);
        const compareResult2 = service.compareCriteriaParameter(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
