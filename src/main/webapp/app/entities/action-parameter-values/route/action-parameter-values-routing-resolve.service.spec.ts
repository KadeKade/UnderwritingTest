import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IActionParameterValues } from '../action-parameter-values.model';
import { ActionParameterValuesService } from '../service/action-parameter-values.service';

import { ActionParameterValuesRoutingResolveService } from './action-parameter-values-routing-resolve.service';

describe('ActionParameterValues routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ActionParameterValuesRoutingResolveService;
  let service: ActionParameterValuesService;
  let resultActionParameterValues: IActionParameterValues | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(ActionParameterValuesRoutingResolveService);
    service = TestBed.inject(ActionParameterValuesService);
    resultActionParameterValues = undefined;
  });

  describe('resolve', () => {
    it('should return IActionParameterValues returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultActionParameterValues = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultActionParameterValues).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultActionParameterValues = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultActionParameterValues).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IActionParameterValues>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultActionParameterValues = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultActionParameterValues).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
