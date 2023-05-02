import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActionParameters } from '../action-parameters.model';
import { ActionParametersService } from '../service/action-parameters.service';

@Injectable({ providedIn: 'root' })
export class ActionParametersRoutingResolveService implements Resolve<IActionParameters | null> {
  constructor(protected service: ActionParametersService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActionParameters | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((actionParameters: HttpResponse<IActionParameters>) => {
          if (actionParameters.body) {
            return of(actionParameters.body);
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
