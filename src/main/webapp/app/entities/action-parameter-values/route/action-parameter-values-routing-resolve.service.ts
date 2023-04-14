import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActionParameterValues } from '../action-parameter-values.model';
import { ActionParameterValuesService } from '../service/action-parameter-values.service';

@Injectable({ providedIn: 'root' })
export class ActionParameterValuesRoutingResolveService implements Resolve<IActionParameterValues | null> {
  constructor(protected service: ActionParameterValuesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActionParameterValues | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((actionParameterValues: HttpResponse<IActionParameterValues>) => {
          if (actionParameterValues.body) {
            return of(actionParameterValues.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
