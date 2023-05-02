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
import { ICriteriaProperty } from 'app/entities/criteria-property/criteria-property.model';
import { CriteriaPropertyService } from 'app/entities/criteria-property/service/criteria-property.service';
import { ICriteriaSet } from 'app/entities/criteria-set/criteria-set.model';
import { CriteriaSetService } from 'app/entities/criteria-set/service/criteria-set.service';

import { CriteriaUpdateComponent } from './criteria-update.component';

describe('Criteria Management Update Component', () => {
  let comp: CriteriaUpdateComponent;
  let fixture: ComponentFixture<CriteriaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let criteriaFormService: CriteriaFormService;
  let criteriaService: CriteriaService;
  let criteriaPropertyService: CriteriaPropertyService;
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
    criteriaPropertyService = TestBed.inject(CriteriaPropertyService);
    criteriaSetService = TestBed.inject(CriteriaSetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CriteriaProperty query and add missing value', () => {
      const criteria: ICriteria = { id: 456 };
      const property: ICriteriaProperty = { id: 22216 };
      criteria.property = property;

      const criteriaPropertyCollection: ICriteriaProperty[] = [{ id: 83389 }];
      jest.spyOn(criteriaPropertyService, 'query').mockReturnValue(of(new HttpResponse({ body: criteriaPropertyCollection })));
      const additionalCriteriaProperties = [property];
      const expectedCollection: ICriteriaProperty[] = [...additionalCriteriaProperties, ...criteriaPropertyCollection];
      jest.spyOn(criteriaPropertyService, 'addCriteriaPropertyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ criteria });
      comp.ngOnInit();

      expect(criteriaPropertyService.query).toHaveBeenCalled();
      expect(criteriaPropertyService.addCriteriaPropertyToCollectionIfMissing).toHaveBeenCalledWith(
        criteriaPropertyCollection,
        ...additionalCriteriaProperties.map(expect.objectContaining)
      );
      expect(comp.criteriaPropertiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CriteriaSet query and add missing value', () => {
      const criteria: ICriteria = { id: 456 };
      const criteriaSet: ICriteriaSet = { id: 13163 };
      criteria.criteriaSet = criteriaSet;

      const criteriaSetCollection: ICriteriaSet[] = [{ id: 6475 }];
      jest.spyOn(criteriaSetService, 'query').mockReturnValue(of(new HttpResponse({ body: criteriaSetCollection })));
      const additionalCriteriaSets = [criteriaSet];
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
      const property: ICriteriaProperty = { id: 40263 };
      criteria.property = property;
      const criteriaSet: ICriteriaSet = { id: 90725 };
      criteria.criteriaSet = criteriaSet;

      activatedRoute.data = of({ criteria });
      comp.ngOnInit();

      expect(comp.criteriaPropertiesSharedCollection).toContain(property);
      expect(comp.criteriaSetsSharedCollection).toContain(criteriaSet);
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
    describe('compareCriteriaProperty', () => {
      it('Should forward to criteriaPropertyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(criteriaPropertyService, 'compareCriteriaProperty');
        comp.compareCriteriaProperty(entity, entity2);
        expect(criteriaPropertyService.compareCriteriaProperty).toHaveBeenCalledWith(entity, entity2);
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
