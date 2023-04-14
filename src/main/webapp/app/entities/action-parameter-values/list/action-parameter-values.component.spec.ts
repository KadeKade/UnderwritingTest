import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActionParameterValuesService } from '../service/action-parameter-values.service';

import { ActionParameterValuesComponent } from './action-parameter-values.component';

describe('ActionParameterValues Management Component', () => {
  let comp: ActionParameterValuesComponent;
  let fixture: ComponentFixture<ActionParameterValuesComponent>;
  let service: ActionParameterValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'action-parameter-values', component: ActionParameterValuesComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ActionParameterValuesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ActionParameterValuesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActionParameterValuesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ActionParameterValuesService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.actionParameterValues?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to actionParameterValuesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getActionParameterValuesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getActionParameterValuesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
