import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CriteriaSetFormService } from './criteria-set-form.service';
import { CriteriaSetService } from '../service/criteria-set.service';
import { ICriteriaSet } from '../criteria-set.model';
import { IAutomatedAction } from 'app/entities/automated-action/automated-action.model';
import { AutomatedActionService } from 'app/entities/automated-action/service/automated-action.service';
import { IBrokerCategory } from 'app/entities/broker-category/broker-category.model';
import { BrokerCategoryService } from 'app/entities/broker-category/service/broker-category.service';

import { CriteriaSetUpdateComponent } from './criteria-set-update.component';

describe('CriteriaSet Management Update Component', () => {
  let comp: CriteriaSetUpdateComponent;
  let fixture: ComponentFixture<CriteriaSetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let criteriaSetFormService: CriteriaSetFormService;
  let criteriaSetService: CriteriaSetService;
  let automatedActionService: AutomatedActionService;
  let brokerCategoryService: BrokerCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CriteriaSetUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CriteriaSetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriteriaSetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    criteriaSetFormService = TestBed.inject(CriteriaSetFormService);
    criteriaSetService = TestBed.inject(CriteriaSetService);
    automatedActionService = TestBed.inject(AutomatedActionService);
    brokerCategoryService = TestBed.inject(BrokerCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AutomatedAction query and add missing value', () => {
      const criteriaSet: ICriteriaSet = { id: 456 };
      const automatedAction: IAutomatedAction = { id: 79321 };
      criteriaSet.automatedAction = automatedAction;

      const automatedActionCollection: IAutomatedAction[] = [{ id: 42190 }];
      jest.spyOn(automatedActionService, 'query').mockReturnValue(of(new HttpResponse({ body: automatedActionCollection })));
      const additionalAutomatedActions = [automatedAction];
      const expectedCollection: IAutomatedAction[] = [...additionalAutomatedActions, ...automatedActionCollection];
      jest.spyOn(automatedActionService, 'addAutomatedActionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ criteriaSet });
      comp.ngOnInit();

      expect(automatedActionService.query).toHaveBeenCalled();
      expect(automatedActionService.addAutomatedActionToCollectionIfMissing).toHaveBeenCalledWith(
        automatedActionCollection,
        ...additionalAutomatedActions.map(expect.objectContaining)
      );
      expect(comp.automatedActionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call BrokerCategory query and add missing value', () => {
      const criteriaSet: ICriteriaSet = { id: 456 };
      const brokerCategories: IBrokerCategory[] = [{ id: 8112 }];
      criteriaSet.brokerCategories = brokerCategories;

      const brokerCategoryCollection: IBrokerCategory[] = [{ id: 70996 }];
      jest.spyOn(brokerCategoryService, 'query').mockReturnValue(of(new HttpResponse({ body: brokerCategoryCollection })));
      const additionalBrokerCategories = [...brokerCategories];
      const expectedCollection: IBrokerCategory[] = [...additionalBrokerCategories, ...brokerCategoryCollection];
      jest.spyOn(brokerCategoryService, 'addBrokerCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ criteriaSet });
      comp.ngOnInit();

      expect(brokerCategoryService.query).toHaveBeenCalled();
      expect(brokerCategoryService.addBrokerCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        brokerCategoryCollection,
        ...additionalBrokerCategories.map(expect.objectContaining)
      );
      expect(comp.brokerCategoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const criteriaSet: ICriteriaSet = { id: 456 };
      const automatedAction: IAutomatedAction = { id: 61973 };
      criteriaSet.automatedAction = automatedAction;
      const brokerCategories: IBrokerCategory = { id: 91195 };
      criteriaSet.brokerCategories = [brokerCategories];

      activatedRoute.data = of({ criteriaSet });
      comp.ngOnInit();

      expect(comp.automatedActionsSharedCollection).toContain(automatedAction);
      expect(comp.brokerCategoriesSharedCollection).toContain(brokerCategories);
      expect(comp.criteriaSet).toEqual(criteriaSet);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaSet>>();
      const criteriaSet = { id: 123 };
      jest.spyOn(criteriaSetFormService, 'getCriteriaSet').mockReturnValue(criteriaSet);
      jest.spyOn(criteriaSetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaSet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaSet }));
      saveSubject.complete();

      // THEN
      expect(criteriaSetFormService.getCriteriaSet).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(criteriaSetService.update).toHaveBeenCalledWith(expect.objectContaining(criteriaSet));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaSet>>();
      const criteriaSet = { id: 123 };
      jest.spyOn(criteriaSetFormService, 'getCriteriaSet').mockReturnValue({ id: null });
      jest.spyOn(criteriaSetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaSet: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaSet }));
      saveSubject.complete();

      // THEN
      expect(criteriaSetFormService.getCriteriaSet).toHaveBeenCalled();
      expect(criteriaSetService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaSet>>();
      const criteriaSet = { id: 123 };
      jest.spyOn(criteriaSetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaSet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(criteriaSetService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAutomatedAction', () => {
      it('Should forward to automatedActionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(automatedActionService, 'compareAutomatedAction');
        comp.compareAutomatedAction(entity, entity2);
        expect(automatedActionService.compareAutomatedAction).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareBrokerCategory', () => {
      it('Should forward to brokerCategoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(brokerCategoryService, 'compareBrokerCategory');
        comp.compareBrokerCategory(entity, entity2);
        expect(brokerCategoryService.compareBrokerCategory).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
