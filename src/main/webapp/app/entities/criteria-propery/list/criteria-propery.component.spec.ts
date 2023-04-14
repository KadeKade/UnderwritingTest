import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CriteriaProperyService } from '../service/criteria-propery.service';

import { CriteriaProperyComponent } from './criteria-propery.component';

describe('CriteriaPropery Management Component', () => {
  let comp: CriteriaProperyComponent;
  let fixture: ComponentFixture<CriteriaProperyComponent>;
  let service: CriteriaProperyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'criteria-propery', component: CriteriaProperyComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [CriteriaProperyComponent],
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
      .overrideTemplate(CriteriaProperyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriteriaProperyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CriteriaProperyService);

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
    expect(comp.criteriaProperies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to criteriaProperyService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCriteriaProperyIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCriteriaProperyIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
