import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActionParameterFormService } from './action-parameter-form.service';
import { ActionParameterService } from '../service/action-parameter.service';
import { IActionParameter } from '../action-parameter.model';
import { ICriteria } from 'app/entities/criteria/criteria.model';
import { CriteriaService } from 'app/entities/criteria/service/criteria.service';

import { ActionParameterUpdateComponent } from './action-parameter-update.component';

describe('ActionParameter Management Update Component', () => {
  let comp: ActionParameterUpdateComponent;
  let fixture: ComponentFixture<ActionParameterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let actionParameterFormService: ActionParameterFormService;
  let actionParameterService: ActionParameterService;
  let criteriaService: CriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ActionParameterUpdateComponent],
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
      .overrideTemplate(ActionParameterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActionParameterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    actionParameterFormService = TestBed.inject(ActionParameterFormService);
    actionParameterService = TestBed.inject(ActionParameterService);
    criteriaService = TestBed.inject(CriteriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Criteria query and add missing value', () => {
      const actionParameter: IActionParameter = { id: 456 };
      const criteria: ICriteria = { id: 2015 };
      actionParameter.criteria = criteria;

      const criteriaCollection: ICriteria[] = [{ id: 41943 }];
      jest.spyOn(criteriaService, 'query').mockReturnValue(of(new HttpResponse({ body: criteriaCollection })));
      const additionalCriteria = [criteria];
      const expectedCollection: ICriteria[] = [...additionalCriteria, ...criteriaCollection];
      jest.spyOn(criteriaService, 'addCriteriaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ actionParameter });
      comp.ngOnInit();

      expect(criteriaService.query).toHaveBeenCalled();
      expect(criteriaService.addCriteriaToCollectionIfMissing).toHaveBeenCalledWith(
        criteriaCollection,
        ...additionalCriteria.map(expect.objectContaining)
      );
      expect(comp.criteriaSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const actionParameter: IActionParameter = { id: 456 };
      const criteria: ICriteria = { id: 79414 };
      actionParameter.criteria = criteria;

      activatedRoute.data = of({ actionParameter });
      comp.ngOnInit();

      expect(comp.criteriaSharedCollection).toContain(criteria);
      expect(comp.actionParameter).toEqual(actionParameter);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActionParameter>>();
      const actionParameter = { id: 123 };
      jest.spyOn(actionParameterFormService, 'getActionParameter').mockReturnValue(actionParameter);
      jest.spyOn(actionParameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actionParameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actionParameter }));
      saveSubject.complete();

      // THEN
      expect(actionParameterFormService.getActionParameter).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(actionParameterService.update).toHaveBeenCalledWith(expect.objectContaining(actionParameter));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActionParameter>>();
      const actionParameter = { id: 123 };
      jest.spyOn(actionParameterFormService, 'getActionParameter').mockReturnValue({ id: null });
      jest.spyOn(actionParameterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actionParameter: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actionParameter }));
      saveSubject.complete();

      // THEN
      expect(actionParameterFormService.getActionParameter).toHaveBeenCalled();
      expect(actionParameterService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActionParameter>>();
      const actionParameter = { id: 123 };
      jest.spyOn(actionParameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actionParameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(actionParameterService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCriteria', () => {
      it('Should forward to criteriaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(criteriaService, 'compareCriteria');
        comp.compareCriteria(entity, entity2);
        expect(criteriaService.compareCriteria).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
