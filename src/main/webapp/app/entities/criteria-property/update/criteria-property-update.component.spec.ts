import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CriteriaPropertyFormService } from './criteria-property-form.service';
import { CriteriaPropertyService } from '../service/criteria-property.service';
import { ICriteriaProperty } from '../criteria-property.model';

import { CriteriaPropertyUpdateComponent } from './criteria-property-update.component';

describe('CriteriaProperty Management Update Component', () => {
  let comp: CriteriaPropertyUpdateComponent;
  let fixture: ComponentFixture<CriteriaPropertyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let criteriaPropertyFormService: CriteriaPropertyFormService;
  let criteriaPropertyService: CriteriaPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CriteriaPropertyUpdateComponent],
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
      .overrideTemplate(CriteriaPropertyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriteriaPropertyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    criteriaPropertyFormService = TestBed.inject(CriteriaPropertyFormService);
    criteriaPropertyService = TestBed.inject(CriteriaPropertyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const criteriaProperty: ICriteriaProperty = { id: 456 };

      activatedRoute.data = of({ criteriaProperty });
      comp.ngOnInit();

      expect(comp.criteriaProperty).toEqual(criteriaProperty);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaProperty>>();
      const criteriaProperty = { id: 123 };
      jest.spyOn(criteriaPropertyFormService, 'getCriteriaProperty').mockReturnValue(criteriaProperty);
      jest.spyOn(criteriaPropertyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaProperty });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaProperty }));
      saveSubject.complete();

      // THEN
      expect(criteriaPropertyFormService.getCriteriaProperty).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(criteriaPropertyService.update).toHaveBeenCalledWith(expect.objectContaining(criteriaProperty));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaProperty>>();
      const criteriaProperty = { id: 123 };
      jest.spyOn(criteriaPropertyFormService, 'getCriteriaProperty').mockReturnValue({ id: null });
      jest.spyOn(criteriaPropertyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaProperty: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaProperty }));
      saveSubject.complete();

      // THEN
      expect(criteriaPropertyFormService.getCriteriaProperty).toHaveBeenCalled();
      expect(criteriaPropertyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaProperty>>();
      const criteriaProperty = { id: 123 };
      jest.spyOn(criteriaPropertyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaProperty });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(criteriaPropertyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
