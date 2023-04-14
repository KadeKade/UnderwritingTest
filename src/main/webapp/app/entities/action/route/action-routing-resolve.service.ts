import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAction } from '../action.model';
import { ActionService } from '../service/action.service';

@Injectable({ providedIn: 'root' })
export class ActionRoutingResolveService implements Resolve<IAction | null> {
  constructor(protected service: ActionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAction | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((action: HttpResponse<IAction>) => {
          if (action.body) {
            return of(action.body);
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
