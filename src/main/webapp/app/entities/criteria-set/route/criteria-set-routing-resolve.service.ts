import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICriteriaSet } from '../criteria-set.model';
import { CriteriaSetService } from '../service/criteria-set.service';

@Injectable({ providedIn: 'root' })
export class CriteriaSetRoutingResolveService implements Resolve<ICriteriaSet | null> {
  constructor(protected service: CriteriaSetService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICriteriaSet | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((criteriaSet: HttpResponse<ICriteriaSet>) => {
          if (criteriaSet.body) {
            return of(criteriaSet.body);
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
