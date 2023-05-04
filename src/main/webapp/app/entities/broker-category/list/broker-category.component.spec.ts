import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BrokerCategoryService } from '../service/broker-category.service';

import { BrokerCategoryComponent } from './broker-category.component';

describe('BrokerCategory Management Component', () => {
  let comp: BrokerCategoryComponent;
  let fixture: ComponentFixture<BrokerCategoryComponent>;
  let service: BrokerCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'broker-category', component: BrokerCategoryComponent }]), HttpClientTestingModule],
      declarations: [BrokerCategoryComponent],
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
      .overrideTemplate(BrokerCategoryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BrokerCategoryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BrokerCategoryService);

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
    expect(comp.brokerCategories?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to brokerCategoryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBrokerCategoryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBrokerCategoryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
