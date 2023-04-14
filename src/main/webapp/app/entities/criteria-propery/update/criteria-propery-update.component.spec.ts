import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CriteriaProperyFormService } from './criteria-propery-form.service';
import { CriteriaProperyService } from '../service/criteria-propery.service';
import { ICriteriaPropery } from '../criteria-propery.model';

import { CriteriaProperyUpdateComponent } from './criteria-propery-update.component';

describe('CriteriaPropery Management Update Component', () => {
  let comp: CriteriaProperyUpdateComponent;
  let fixture: ComponentFixture<CriteriaProperyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let criteriaProperyFormService: CriteriaProperyFormService;
  let criteriaProperyService: CriteriaProperyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CriteriaProperyUpdateComponent],
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
      .overrideTemplate(CriteriaProperyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriteriaProperyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    criteriaProperyFormService = TestBed.inject(CriteriaProperyFormService);
    criteriaProperyService = TestBed.inject(CriteriaProperyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const criteriaPropery: ICriteriaPropery = { id: 456 };

      activatedRoute.data = of({ criteriaPropery });
      comp.ngOnInit();

      expect(comp.criteriaPropery).toEqual(criteriaPropery);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaPropery>>();
      const criteriaPropery = { id: 123 };
      jest.spyOn(criteriaProperyFormService, 'getCriteriaPropery').mockReturnValue(criteriaPropery);
      jest.spyOn(criteriaProperyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaPropery });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaPropery }));
      saveSubject.complete();

      // THEN
      expect(criteriaProperyFormService.getCriteriaPropery).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(criteriaProperyService.update).toHaveBeenCalledWith(expect.objectContaining(criteriaPropery));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaPropery>>();
      const criteriaPropery = { id: 123 };
      jest.spyOn(criteriaProperyFormService, 'getCriteriaPropery').mockReturnValue({ id: null });
      jest.spyOn(criteriaProperyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaPropery: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: criteriaPropery }));
      saveSubject.complete();

      // THEN
      expect(criteriaProperyFormService.getCriteriaPropery).toHaveBeenCalled();
      expect(criteriaProperyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICriteriaPropery>>();
      const criteriaPropery = { id: 123 };
      jest.spyOn(criteriaProperyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ criteriaPropery });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(criteriaProperyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
