import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IActionParameter } from '../action-parameter.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../action-parameter.test-samples';

import { ActionParameterService } from './action-parameter.service';

const requireRestSample: IActionParameter = {
  ...sampleWithRequiredData,
};

describe('ActionParameter Service', () => {
  let service: ActionParameterService;
  let httpMock: HttpTestingController;
  let expectedResult: IActionParameter | IActionParameter[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ActionParameterService);
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

    it('should create a ActionParameter', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const actionParameter = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(actionParameter).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ActionParameter', () => {
      const actionParameter = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(actionParameter).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ActionParameter', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ActionParameter', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ActionParameter', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addActionParameterToCollectionIfMissing', () => {
      it('should add a ActionParameter to an empty array', () => {
        const actionParameter: IActionParameter = sampleWithRequiredData;
        expectedResult = service.addActionParameterToCollectionIfMissing([], actionParameter);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actionParameter);
      });

      it('should not add a ActionParameter to an array that contains it', () => {
        const actionParameter: IActionParameter = sampleWithRequiredData;
        const actionParameterCollection: IActionParameter[] = [
          {
            ...actionParameter,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addActionParameterToCollectionIfMissing(actionParameterCollection, actionParameter);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ActionParameter to an array that doesn't contain it", () => {
        const actionParameter: IActionParameter = sampleWithRequiredData;
        const actionParameterCollection: IActionParameter[] = [sampleWithPartialData];
        expectedResult = service.addActionParameterToCollectionIfMissing(actionParameterCollection, actionParameter);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actionParameter);
      });

      it('should add only unique ActionParameter to an array', () => {
        const actionParameterArray: IActionParameter[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const actionParameterCollection: IActionParameter[] = [sampleWithRequiredData];
        expectedResult = service.addActionParameterToCollectionIfMissing(actionParameterCollection, ...actionParameterArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const actionParameter: IActionParameter = sampleWithRequiredData;
        const actionParameter2: IActionParameter = sampleWithPartialData;
        expectedResult = service.addActionParameterToCollectionIfMissing([], actionParameter, actionParameter2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actionParameter);
        expect(expectedResult).toContain(actionParameter2);
      });

      it('should accept null and undefined values', () => {
        const actionParameter: IActionParameter = sampleWithRequiredData;
        expectedResult = service.addActionParameterToCollectionIfMissing([], null, actionParameter, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actionParameter);
      });

      it('should return initial array if no ActionParameter is added', () => {
        const actionParameterCollection: IActionParameter[] = [sampleWithRequiredData];
        expectedResult = service.addActionParameterToCollectionIfMissing(actionParameterCollection, undefined, null);
        expect(expectedResult).toEqual(actionParameterCollection);
      });
    });

    describe('compareActionParameter', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareActionParameter(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareActionParameter(entity1, entity2);
        const compareResult2 = service.compareActionParameter(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareActionParameter(entity1, entity2);
        const compareResult2 = service.compareActionParameter(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareActionParameter(entity1, entity2);
        const compareResult2 = service.compareActionParameter(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
