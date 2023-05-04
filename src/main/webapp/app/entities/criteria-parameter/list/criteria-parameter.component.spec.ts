import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CriteriaParameterService } from '../service/criteria-parameter.service';

import { CriteriaParameterComponent } from './criteria-parameter.component';

describe('CriteriaParameter Management Component', () => {
  let comp: CriteriaParameterComponent;
  let fixture: ComponentFixture<CriteriaParameterComponent>;
  let service: CriteriaParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'criteria-parameter', component: CriteriaParameterComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [CriteriaParameterComponent],
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
      .overrideTemplate(CriteriaParameterComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriteriaParameterComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CriteriaParameterService);

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
    expect(comp.criteriaParameters?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to criteriaParameterService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCriteriaParameterIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCriteriaParameterIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
