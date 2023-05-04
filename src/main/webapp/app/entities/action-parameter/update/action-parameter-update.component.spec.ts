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

import { ActionParameterUpdateComponent } from './action-parameter-update.component';

describe('ActionParameter Management Update Component', () => {
  let comp: ActionParameterUpdateComponent;
  let fixture: ComponentFixture<ActionParameterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let actionParameterFormService: ActionParameterFormService;
  let actionParameterService: ActionParameterService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const actionParameter: IActionParameter = { id: 456 };

      activatedRoute.data = of({ actionParameter });
      comp.ngOnInit();

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
});
