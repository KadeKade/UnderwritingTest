import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAutomatedAction } from '../automated-action.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../automated-action.test-samples';

import { AutomatedActionService } from './automated-action.service';

const requireRestSample: IAutomatedAction = {
  ...sampleWithRequiredData,
};

describe('AutomatedAction Service', () => {
  let service: AutomatedActionService;
  let httpMock: HttpTestingController;
  let expectedResult: IAutomatedAction | IAutomatedAction[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AutomatedActionService);
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

    it('should create a AutomatedAction', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const automatedAction = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(automatedAction).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AutomatedAction', () => {
      const automatedAction = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(automatedAction).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AutomatedAction', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AutomatedAction', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AutomatedAction', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAutomatedActionToCollectionIfMissing', () => {
      it('should add a AutomatedAction to an empty array', () => {
        const automatedAction: IAutomatedAction = sampleWithRequiredData;
        expectedResult = service.addAutomatedActionToCollectionIfMissing([], automatedAction);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(automatedAction);
      });

      it('should not add a AutomatedAction to an array that contains it', () => {
        const automatedAction: IAutomatedAction = sampleWithRequiredData;
        const automatedActionCollection: IAutomatedAction[] = [
          {
            ...automatedAction,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAutomatedActionToCollectionIfMissing(automatedActionCollection, automatedAction);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AutomatedAction to an array that doesn't contain it", () => {
        const automatedAction: IAutomatedAction = sampleWithRequiredData;
        const automatedActionCollection: IAutomatedAction[] = [sampleWithPartialData];
        expectedResult = service.addAutomatedActionToCollectionIfMissing(automatedActionCollection, automatedAction);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(automatedAction);
      });

      it('should add only unique AutomatedAction to an array', () => {
        const automatedActionArray: IAutomatedAction[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const automatedActionCollection: IAutomatedAction[] = [sampleWithRequiredData];
        expectedResult = service.addAutomatedActionToCollectionIfMissing(automatedActionCollection, ...automatedActionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const automatedAction: IAutomatedAction = sampleWithRequiredData;
        const automatedAction2: IAutomatedAction = sampleWithPartialData;
        expectedResult = service.addAutomatedActionToCollectionIfMissing([], automatedAction, automatedAction2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(automatedAction);
        expect(expectedResult).toContain(automatedAction2);
      });

      it('should accept null and undefined values', () => {
        const automatedAction: IAutomatedAction = sampleWithRequiredData;
        expectedResult = service.addAutomatedActionToCollectionIfMissing([], null, automatedAction, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(automatedAction);
      });

      it('should return initial array if no AutomatedAction is added', () => {
        const automatedActionCollection: IAutomatedAction[] = [sampleWithRequiredData];
        expectedResult = service.addAutomatedActionToCollectionIfMissing(automatedActionCollection, undefined, null);
        expect(expectedResult).toEqual(automatedActionCollection);
      });
    });

    describe('compareAutomatedAction', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAutomatedAction(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAutomatedAction(entity1, entity2);
        const compareResult2 = service.compareAutomatedAction(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAutomatedAction(entity1, entity2);
        const compareResult2 = service.compareAutomatedAction(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAutomatedAction(entity1, entity2);
        const compareResult2 = service.compareAutomatedAction(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
