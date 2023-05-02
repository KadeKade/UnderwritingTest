import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CriteriaPropertyService } from '../service/criteria-property.service';

import { CriteriaPropertyComponent } from './criteria-property.component';

describe('CriteriaProperty Management Component', () => {
  let comp: CriteriaPropertyComponent;
  let fixture: ComponentFixture<CriteriaPropertyComponent>;
  let service: CriteriaPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'criteria-property', component: CriteriaPropertyComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [CriteriaPropertyComponent],
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
      .overrideTemplate(CriteriaPropertyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriteriaPropertyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CriteriaPropertyService);

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
    expect(comp.criteriaProperties?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to criteriaPropertyService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCriteriaPropertyIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCriteriaPropertyIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
