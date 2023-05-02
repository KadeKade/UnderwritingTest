import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParameterValue } from '../parameter-value.model';
import { ParameterValueService } from '../service/parameter-value.service';

@Injectable({ providedIn: 'root' })
export class ParameterValueRoutingResolveService implements Resolve<IParameterValue | null> {
  constructor(protected service: ParameterValueService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParameterValue | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((parameterValue: HttpResponse<IParameterValue>) => {
          if (parameterValue.body) {
            return of(parameterValue.body);
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
