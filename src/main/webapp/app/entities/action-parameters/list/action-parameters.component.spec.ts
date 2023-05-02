import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActionParametersService } from '../service/action-parameters.service';

import { ActionParametersComponent } from './action-parameters.component';

describe('ActionParameters Management Component', () => {
  let comp: ActionParametersComponent;
  let fixture: ComponentFixture<ActionParametersComponent>;
  let service: ActionParametersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'action-parameters', component: ActionParametersComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ActionParametersComponent],
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
      .overrideTemplate(ActionParametersComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActionParametersComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ActionParametersService);

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
    it('Should forward to actionParametersService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getActionParametersIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getActionParametersIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
