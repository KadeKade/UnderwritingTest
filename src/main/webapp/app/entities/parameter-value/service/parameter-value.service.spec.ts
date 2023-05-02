import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IParameterValue } from '../parameter-value.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../parameter-value.test-samples';

import { ParameterValueService } from './parameter-value.service';

const requireRestSample: IParameterValue = {
  ...sampleWithRequiredData,
};

describe('ParameterValue Service', () => {
  let service: ParameterValueService;
  let httpMock: HttpTestingController;
  let expectedResult: IParameterValue | IParameterValue[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParameterValueService);
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

    it('should create a ParameterValue', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const parameterValue = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(parameterValue).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ParameterValue', () => {
      const parameterValue = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(parameterValue).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ParameterValue', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ParameterValue', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ParameterValue', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addParameterValueToCollectionIfMissing', () => {
      it('should add a ParameterValue to an empty array', () => {
        const parameterValue: IParameterValue = sampleWithRequiredData;
        expectedResult = service.addParameterValueToCollectionIfMissing([], parameterValue);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parameterValue);
      });

      it('should not add a ParameterValue to an array that contains it', () => {
        const parameterValue: IParameterValue = sampleWithRequiredData;
        const parameterValueCollection: IParameterValue[] = [
          {
            ...parameterValue,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addParameterValueToCollectionIfMissing(parameterValueCollection, parameterValue);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ParameterValue to an array that doesn't contain it", () => {
        const parameterValue: IParameterValue = sampleWithRequiredData;
        const parameterValueCollection: IParameterValue[] = [sampleWithPartialData];
        expectedResult = service.addParameterValueToCollectionIfMissing(parameterValueCollection, parameterValue);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parameterValue);
      });

      it('should add only unique ParameterValue to an array', () => {
        const parameterValueArray: IParameterValue[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const parameterValueCollection: IParameterValue[] = [sampleWithRequiredData];
        expectedResult = service.addParameterValueToCollectionIfMissing(parameterValueCollection, ...parameterValueArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const parameterValue: IParameterValue = sampleWithRequiredData;
        const parameterValue2: IParameterValue = sampleWithPartialData;
        expectedResult = service.addParameterValueToCollectionIfMissing([], parameterValue, parameterValue2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parameterValue);
        expect(expectedResult).toContain(parameterValue2);
      });

      it('should accept null and undefined values', () => {
        const parameterValue: IParameterValue = sampleWithRequiredData;
        expectedResult = service.addParameterValueToCollectionIfMissing([], null, parameterValue, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parameterValue);
      });

      it('should return initial array if no ParameterValue is added', () => {
        const parameterValueCollection: IParameterValue[] = [sampleWithRequiredData];
        expectedResult = service.addParameterValueToCollectionIfMissing(parameterValueCollection, undefined, null);
        expect(expectedResult).toEqual(parameterValueCollection);
      });
    });

    describe('compareParameterValue', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareParameterValue(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareParameterValue(entity1, entity2);
        const compareResult2 = service.compareParameterValue(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareParameterValue(entity1, entity2);
        const compareResult2 = service.compareParameterValue(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareParameterValue(entity1, entity2);
        const compareResult2 = service.compareParameterValue(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
