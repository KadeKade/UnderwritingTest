import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActionFormService } from './action-form.service';
import { ActionService } from '../service/action.service';
import { IAction } from '../action.model';

import { ActionUpdateComponent } from './action-update.component';

describe('Action Management Update Component', () => {
  let comp: ActionUpdateComponent;
  let fixture: ComponentFixture<ActionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let actionFormService: ActionFormService;
  let actionService: ActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ActionUpdateComponent],
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
      .overrideTemplate(ActionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    actionFormService = TestBed.inject(ActionFormService);
    actionService = TestBed.inject(ActionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const action: IAction = { id: 456 };

      activatedRoute.data = of({ action });
      comp.ngOnInit();

      expect(comp.action).toEqual(action);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAction>>();
      const action = { id: 123 };
      jest.spyOn(actionFormService, 'getAction').mockReturnValue(action);
      jest.spyOn(actionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ action });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: action }));
      saveSubject.complete();

      // THEN
      expect(actionFormService.getAction).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(actionService.update).toHaveBeenCalledWith(expect.objectContaining(action));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAction>>();
      const action = { id: 123 };
      jest.spyOn(actionFormService, 'getAction').mockReturnValue({ id: null });
      jest.spyOn(actionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ action: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: action }));
      saveSubject.complete();

      // THEN
      expect(actionFormService.getAction).toHaveBeenCalled();
      expect(actionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAction>>();
      const action = { id: 123 };
      jest.spyOn(actionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ action });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(actionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
