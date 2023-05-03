import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICriteriaParameter } from '../criteria-parameter.model';
import { CriteriaParameterService } from '../service/criteria-parameter.service';

@Injectable({ providedIn: 'root' })
export class CriteriaParameterRoutingResolveService implements Resolve<ICriteriaParameter | null> {
  constructor(protected service: CriteriaParameterService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICriteriaParameter | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((criteriaParameter: HttpResponse<ICriteriaParameter>) => {
          if (criteriaParameter.body) {
            return of(criteriaParameter.body);
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
