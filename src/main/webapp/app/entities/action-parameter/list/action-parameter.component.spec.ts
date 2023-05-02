import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActionParameterService } from '../service/action-parameter.service';

import { ActionParameterComponent } from './action-parameter.component';

describe('ActionParameter Management Component', () => {
  let comp: ActionParameterComponent;
  let fixture: ComponentFixture<ActionParameterComponent>;
  let service: ActionParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'action-parameter', component: ActionParameterComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ActionParameterComponent],
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
      .overrideTemplate(ActionParameterComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActionParameterComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ActionParameterService);

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
    expect(comp.actionParameters?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to actionParameterService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getActionParameterIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getActionParameterIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
