import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BrokerCategoryDetailComponent } from './broker-category-detail.component';

describe('BrokerCategory Management Detail Component', () => {
  let comp: BrokerCategoryDetailComponent;
  let fixture: ComponentFixture<BrokerCategoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrokerCategoryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ brokerCategory: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BrokerCategoryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BrokerCategoryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load brokerCategory on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.brokerCategory).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
