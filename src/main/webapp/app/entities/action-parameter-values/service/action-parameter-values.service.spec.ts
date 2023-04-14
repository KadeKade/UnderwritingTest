import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IActionParameterValues } from '../action-parameter-values.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../action-parameter-values.test-samples';

import { ActionParameterValuesService } from './action-parameter-values.service';

const requireRestSample: IActionParameterValues = {
  ...sampleWithRequiredData,
};

describe('ActionParameterValues Service', () => {
  let service: ActionParameterValuesService;
  let httpMock: HttpTestingController;
  let expectedResult: IActionParameterValues | IActionParameterValues[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ActionParameterValuesService);
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

    it('should create a ActionParameterValues', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const actionParameterValues = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(actionParameterValues).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ActionParameterValues', () => {
      const actionParameterValues = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(actionParameterValues).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ActionParameterValues', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ActionParameterValues', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ActionParameterValues', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addActionParameterValuesToCollectionIfMissing', () => {
      it('should add a ActionParameterValues to an empty array', () => {
        const actionParameterValues: IActionParameterValues = sampleWithRequiredData;
        expectedResult = service.addActionParameterValuesToCollectionIfMissing([], actionParameterValues);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actionParameterValues);
      });

      it('should not add a ActionParameterValues to an array that contains it', () => {
        const actionParameterValues: IActionParameterValues = sampleWithRequiredData;
        const actionParameterValuesCollection: IActionParameterValues[] = [
          {
            ...actionParameterValues,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addActionParameterValuesToCollectionIfMissing(actionParameterValuesCollection, actionParameterValues);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ActionParameterValues to an array that doesn't contain it", () => {
        const actionParameterValues: IActionParameterValues = sampleWithRequiredData;
        const actionParameterValuesCollection: IActionParameterValues[] = [sampleWithPartialData];
        expectedResult = service.addActionParameterValuesToCollectionIfMissing(actionParameterValuesCollection, actionParameterValues);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actionParameterValues);
      });

      it('should add only unique ActionParameterValues to an array', () => {
        const actionParameterValuesArray: IActionParameterValues[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const actionParameterValuesCollection: IActionParameterValues[] = [sampleWithRequiredData];
        expectedResult = service.addActionParameterValuesToCollectionIfMissing(
          actionParameterValuesCollection,
          ...actionParameterValuesArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const actionParameterValues: IActionParameterValues = sampleWithRequiredData;
        const actionParameterValues2: IActionParameterValues = sampleWithPartialData;
        expectedResult = service.addActionParameterValuesToCollectionIfMissing([], actionParameterValues, actionParameterValues2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actionParameterValues);
        expect(expectedResult).toContain(actionParameterValues2);
      });

      it('should accept null and undefined values', () => {
        const actionParameterValues: IActionParameterValues = sampleWithRequiredData;
        expectedResult = service.addActionParameterValuesToCollectionIfMissing([], null, actionParameterValues, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actionParameterValues);
      });

      it('should return initial array if no ActionParameterValues is added', () => {
        const actionParameterValuesCollection: IActionParameterValues[] = [sampleWithRequiredData];
        expectedResult = service.addActionParameterValuesToCollectionIfMissing(actionParameterValuesCollection, undefined, null);
        expect(expectedResult).toEqual(actionParameterValuesCollection);
      });
    });

    describe('compareActionParameterValues', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareActionParameterValues(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareActionParameterValues(entity1, entity2);
        const compareResult2 = service.compareActionParameterValues(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareActionParameterValues(entity1, entity2);
        const compareResult2 = service.compareActionParameterValues(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareActionParameterValues(entity1, entity2);
        const compareResult2 = service.compareActionParameterValues(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
