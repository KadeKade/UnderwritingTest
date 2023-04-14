import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICriteriaPropery } from '../criteria-propery.model';
import { CriteriaProperyService } from '../service/criteria-propery.service';

@Injectable({ providedIn: 'root' })
export class CriteriaProperyRoutingResolveService implements Resolve<ICriteriaPropery | null> {
  constructor(protected service: CriteriaProperyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICriteriaPropery | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((criteriaPropery: HttpResponse<ICriteriaPropery>) => {
          if (criteriaPropery.body) {
            return of(criteriaPropery.body);
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
