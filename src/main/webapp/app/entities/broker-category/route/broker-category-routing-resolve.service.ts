import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBrokerCategory } from '../broker-category.model';
import { BrokerCategoryService } from '../service/broker-category.service';

@Injectable({ providedIn: 'root' })
export class BrokerCategoryRoutingResolveService implements Resolve<IBrokerCategory | null> {
  constructor(protected service: BrokerCategoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBrokerCategory | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((brokerCategory: HttpResponse<IBrokerCategory>) => {
          if (brokerCategory.body) {
            return of(brokerCategory.body);
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
