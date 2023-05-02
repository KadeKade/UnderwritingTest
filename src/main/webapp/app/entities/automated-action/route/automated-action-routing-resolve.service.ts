import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAutomatedAction } from '../automated-action.model';
import { AutomatedActionService } from '../service/automated-action.service';

@Injectable({ providedIn: 'root' })
export class AutomatedActionRoutingResolveService implements Resolve<IAutomatedAction | null> {
  constructor(protected service: AutomatedActionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAutomatedAction | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((automatedAction: HttpResponse<IAutomatedAction>) => {
          if (automatedAction.body) {
            return of(automatedAction.body);
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
