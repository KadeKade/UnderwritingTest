import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CriteriaParameterFormService } from './criteria-parameter-form.service';
import { CriteriaParameterService } from '../service/criteria-parameter.service';
import { ICriteriaParameter } from '../criteria-parameter.model';
import { ICriteria } from 'app/entities/criteria/criteria.model';
import { CriteriaService } from 'app/entities/criteria/service/criteria.service';

import { CriteriaParameterUpdateComponent } from './criteria-parameter-update.component';

describe('CriteriaParameter Management Update Component', () => {
  let comp: CriteriaParameterUpdateComponent;
  let fixture: ComponentFixture<CriteriaParameterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let criteriaParameterFormService: CriteriaParameterFormService;
  let criteriaParameterService: CriteriaParameterService;
  let criteriaService: CriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CriteriaParameterUpdateComponent],
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
      .overrideTemplate(CriteriaParameterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriteriaParameterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    criteriaParameterFormService = TestBed.inject(CriteriaParameterFormService);
    criteriaParameterService = TestBed.inject(CriteriaParameterService);
    criteriaService = TestBed.inject(CriteriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Criteria query and add missing value', () => {
      const criteriaParameter: ICriteriaParameter = { id: 456 };
      const criteria: ICriteria = { id: 11759 };
      criteriaParameter.criteria = criteria;

      const criteriaCollection: ICriteria[] = [{ id: 21548 }];
      jest.spyOn(criteriaService, 'query').mockReturnValue(of(new HttpResponse({ body: criteriaCollection })));
      const additionalCriteria = [criteria];
      const expectedCollection: ICriteria[] = [...additionalCriteria, ...criteriaCollection];
      jest.spyOn(criteriaService, 'addCriteriaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ criteriaParameter });
      comp.ngOnInit();

      expect(criteriaService.query).toHaveBeenCalled();
      expect(criteriaService.addCriteriaToCollectionIfMissing).toHaveBeenCalledWith(
        criteriaCollection,
        ...additionalCriteria.map(expect.objectContaining)
      );
      expect(comp.criteriaSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const criteriaParameter: ICriteriaParameter = { id: 456 };
      const criteria: ICriteria = { id: 46147 };
      criteriaParameter.criteria = criteria;

      activatedRoute.data = of({ criteriaParameter });
      comp.ngOnInit();

      expect(comp.criteriaSharedCollection).toContain(criteria);
      expect(comp.criteriaParameter).toEqual(criteriaParameter);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaParameter>>();
      const criteriaParameter = { id: 123 };
      jest.spyOn(criteriaParameterFormService, 'getCriteriaParameter').mockReturnValue(criteriaParameter);
      jest.spyOn(criteriaParameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaParameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaParameter }));
      saveSubject.complete();

      // THEN
      expect(criteriaParameterFormService.getCriteriaParameter).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(criteriaParameterService.update).toHaveBeenCalledWith(expect.objectContaining(criteriaParameter));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaParameter>>();
      const criteriaParameter = { id: 123 };
      jest.spyOn(criteriaParameterFormService, 'getCriteriaParameter').mockReturnValue({ id: null });
      jest.spyOn(criteriaParameterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaParameter: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaParameter }));
      saveSubject.complete();

      // THEN
      expect(criteriaParameterFormService.getCriteriaParameter).toHaveBeenCalled();
      expect(criteriaParameterService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaParameter>>();
      const criteriaParameter = { id: 123 };
      jest.spyOn(criteriaParameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaParameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(criteriaParameterService.update).toHaveBeenCalled();
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
