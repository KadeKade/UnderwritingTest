import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AutomatedActionService } from '../service/automated-action.service';

import { AutomatedActionComponent } from './automated-action.component';

describe('AutomatedAction Management Component', () => {
  let comp: AutomatedActionComponent;
  let fixture: ComponentFixture<AutomatedActionComponent>;
  let service: AutomatedActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'automated-action', component: AutomatedActionComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [AutomatedActionComponent],
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
      .overrideTemplate(AutomatedActionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AutomatedActionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AutomatedActionService);

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
    expect(comp.automatedActions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to automatedActionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAutomatedActionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAutomatedActionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
