import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ParameterValueService } from '../service/parameter-value.service';

import { ParameterValueComponent } from './parameter-value.component';

describe('ParameterValue Management Component', () => {
  let comp: ParameterValueComponent;
  let fixture: ComponentFixture<ParameterValueComponent>;
  let service: ParameterValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'parameter-value', component: ParameterValueComponent }]), HttpClientTestingModule],
      declarations: [ParameterValueComponent],
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
      .overrideTemplate(ParameterValueComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParameterValueComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ParameterValueService);

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
    expect(comp.parameterValues?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to parameterValueService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getParameterValueIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getParameterValueIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
