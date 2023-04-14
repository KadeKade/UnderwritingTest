import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CriteriaFormService } from './criteria-form.service';
import { CriteriaService } from '../service/criteria.service';
import { ICriteria } from '../criteria.model';
import { ICriteriaPropery } from 'app/entities/criteria-propery/criteria-propery.model';
import { CriteriaProperyService } from 'app/entities/criteria-propery/service/criteria-propery.service';
import { ICriteriaSet } from 'app/entities/criteria-set/criteria-set.model';
import { CriteriaSetService } from 'app/entities/criteria-set/service/criteria-set.service';

import { CriteriaUpdateComponent } from './criteria-update.component';

describe('Criteria Management Update Component', () => {
  let comp: CriteriaUpdateComponent;
  let fixture: ComponentFixture<CriteriaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let criteriaFormService: CriteriaFormService;
  let criteriaService: CriteriaService;
  let criteriaProperyService: CriteriaProperyService;
  let criteriaSetService: CriteriaSetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CriteriaUpdateComponent],
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
      .overrideTemplate(CriteriaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriteriaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    criteriaFormService = TestBed.inject(CriteriaFormService);
    criteriaService = TestBed.inject(CriteriaService);
    criteriaProperyService = TestBed.inject(CriteriaProperyService);
    criteriaSetService = TestBed.inject(CriteriaSetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CriteriaPropery query and add missing value', () => {
      const criteria: ICriteria = { id: 456 };
      const property: ICriteriaPropery = { id: 8478 };
      criteria.property = property;

      const criteriaProperyCollection: ICriteriaPropery[] = [{ id: 62065 }];
      jest.spyOn(criteriaProperyService, 'query').mockReturnValue(of(new HttpResponse({ body: criteriaProperyCollection })));
      const additionalCriteriaProperies = [property];
      const expectedCollection: ICriteriaPropery[] = [...additionalCriteriaProperies, ...criteriaProperyCollection];
      jest.spyOn(criteriaProperyService, 'addCriteriaProperyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ criteria });
      comp.ngOnInit();

      expect(criteriaProperyService.query).toHaveBeenCalled();
      expect(criteriaProperyService.addCriteriaProperyToCollectionIfMissing).toHaveBeenCalledWith(
        criteriaProperyCollection,
        ...additionalCriteriaProperies.map(expect.objectContaining)
      );
      expect(comp.criteriaProperiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CriteriaSet query and add missing value', () => {
      const criteria: ICriteria = { id: 456 };
      const criteria: ICriteriaSet = { id: 13163 };
      criteria.criteria = criteria;

      const criteriaSetCollection: ICriteriaSet[] = [{ id: 6475 }];
      jest.spyOn(criteriaSetService, 'query').mockReturnValue(of(new HttpResponse({ body: criteriaSetCollection })));
      const additionalCriteriaSets = [criteria];
      const expectedCollection: ICriteriaSet[] = [...additionalCriteriaSets, ...criteriaSetCollection];
      jest.spyOn(criteriaSetService, 'addCriteriaSetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ criteria });
      comp.ngOnInit();

      expect(criteriaSetService.query).toHaveBeenCalled();
      expect(criteriaSetService.addCriteriaSetToCollectionIfMissing).toHaveBeenCalledWith(
        criteriaSetCollection,
        ...additionalCriteriaSets.map(expect.objectContaining)
      );
      expect(comp.criteriaSetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const criteria: ICriteria = { id: 456 };
      const property: ICriteriaPropery = { id: 60389 };
      criteria.property = property;
      const criteria: ICriteriaSet = { id: 90725 };
      criteria.criteria = criteria;

      activatedRoute.data = of({ criteria });
      comp.ngOnInit();

      expect(comp.criteriaProperiesSharedCollection).toContain(property);
      expect(comp.criteriaSetsSharedCollection).toContain(criteria);
      expect(comp.criteria).toEqual(criteria);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteria>>();
      const criteria = { id: 123 };
      jest.spyOn(criteriaFormService, 'getCriteria').mockReturnValue(criteria);
      jest.spyOn(criteriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteria }));
      saveSubject.complete();

      // THEN
      expect(criteriaFormService.getCriteria).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(criteriaService.update).toHaveBeenCalledWith(expect.objectContaining(criteria));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteria>>();
      const criteria = { id: 123 };
      jest.spyOn(criteriaFormService, 'getCriteria').mockReturnValue({ id: null });
      jest.spyOn(criteriaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteria: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteria }));
      saveSubject.complete();

      // THEN
      expect(criteriaFormService.getCriteria).toHaveBeenCalled();
      expect(criteriaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteria>>();
      const criteria = { id: 123 };
      jest.spyOn(criteriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(criteriaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCriteriaPropery', () => {
      it('Should forward to criteriaProperyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(criteriaProperyService, 'compareCriteriaPropery');
        comp.compareCriteriaPropery(entity, entity2);
        expect(criteriaProperyService.compareCriteriaPropery).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCriteriaSet', () => {
      it('Should forward to criteriaSetService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(criteriaSetService, 'compareCriteriaSet');
        comp.compareCriteriaSet(entity, entity2);
        expect(criteriaSetService.compareCriteriaSet).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
