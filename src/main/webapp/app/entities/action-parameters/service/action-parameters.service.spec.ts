import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IActionParameters } from '../action-parameters.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../action-parameters.test-samples';

import { ActionParametersService } from './action-parameters.service';

const requireRestSample: IActionParameters = {
  ...sampleWithRequiredData,
};

describe('ActionParameters Service', () => {
  let service: ActionParametersService;
  let httpMock: HttpTestingController;
  let expectedResult: IActionParameters | IActionParameters[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ActionParametersService);
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

    it('should create a ActionParameters', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const actionParameters = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(actionParameters).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ActionParameters', () => {
      const actionParameters = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(actionParameters).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ActionParameters', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ActionParameters', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ActionParameters', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addActionParametersToCollectionIfMissing', () => {
      it('should add a ActionParameters to an empty array', () => {
        const actionParameters: IActionParameters = sampleWithRequiredData;
        expectedResult = service.addActionParametersToCollectionIfMissing([], actionParameters);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actionParameters);
      });

      it('should not add a ActionParameters to an array that contains it', () => {
        const actionParameters: IActionParameters = sampleWithRequiredData;
        const actionParametersCollection: IActionParameters[] = [
          {
            ...actionParameters,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addActionParametersToCollectionIfMissing(actionParametersCollection, actionParameters);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ActionParameters to an array that doesn't contain it", () => {
        const actionParameters: IActionParameters = sampleWithRequiredData;
        const actionParametersCollection: IActionParameters[] = [sampleWithPartialData];
        expectedResult = service.addActionParametersToCollectionIfMissing(actionParametersCollection, actionParameters);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actionParameters);
      });

      it('should add only unique ActionParameters to an array', () => {
        const actionParametersArray: IActionParameters[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const actionParametersCollection: IActionParameters[] = [sampleWithRequiredData];
        expectedResult = service.addActionParametersToCollectionIfMissing(actionParametersCollection, ...actionParametersArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const actionParameters: IActionParameters = sampleWithRequiredData;
        const actionParameters2: IActionParameters = sampleWithPartialData;
        expectedResult = service.addActionParametersToCollectionIfMissing([], actionParameters, actionParameters2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actionParameters);
        expect(expectedResult).toContain(actionParameters2);
      });

      it('should accept null and undefined values', () => {
        const actionParameters: IActionParameters = sampleWithRequiredData;
        expectedResult = service.addActionParametersToCollectionIfMissing([], null, actionParameters, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actionParameters);
      });

      it('should return initial array if no ActionParameters is added', () => {
        const actionParametersCollection: IActionParameters[] = [sampleWithRequiredData];
        expectedResult = service.addActionParametersToCollectionIfMissing(actionParametersCollection, undefined, null);
        expect(expectedResult).toEqual(actionParametersCollection);
      });
    });

    describe('compareActionParameters', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareActionParameters(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareActionParameters(entity1, entity2);
        const compareResult2 = service.compareActionParameters(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareActionParameters(entity1, entity2);
        const compareResult2 = service.compareActionParameters(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareActionParameters(entity1, entity2);
        const compareResult2 = service.compareActionParameters(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
