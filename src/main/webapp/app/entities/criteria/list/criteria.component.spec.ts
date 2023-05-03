import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CriteriaService } from '../service/criteria.service';

import { CriteriaComponent } from './criteria.component';

describe('Criteria Management Component', () => {
  let comp: CriteriaComponent;
  let fixture: ComponentFixture<CriteriaComponent>;
  let service: CriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'criteria', component: CriteriaComponent }]), HttpClientTestingModule],
      declarations: [CriteriaComponent],
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
      .overrideTemplate(CriteriaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriteriaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CriteriaService);

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
    expect(comp.criteria?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to criteriaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCriteriaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCriteriaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
