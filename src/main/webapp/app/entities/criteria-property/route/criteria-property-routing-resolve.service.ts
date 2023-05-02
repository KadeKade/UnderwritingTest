import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICriteriaProperty } from '../criteria-property.model';
import { CriteriaPropertyService } from '../service/criteria-property.service';

@Injectable({ providedIn: 'root' })
export class CriteriaPropertyRoutingResolveService implements Resolve<ICriteriaProperty | null> {
  constructor(protected service: CriteriaPropertyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICriteriaProperty | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((criteriaProperty: HttpResponse<ICriteriaProperty>) => {
          if (criteriaProperty.body) {
            return of(criteriaProperty.body);
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
