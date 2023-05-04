import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActionParameter } from '../action-parameter.model';
import { ActionParameterService } from '../service/action-parameter.service';

@Injectable({ providedIn: 'root' })
export class ActionParameterRoutingResolveService implements Resolve<IActionParameter | null> {
  constructor(protected service: ActionParameterService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActionParameter | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((actionParameter: HttpResponse<IActionParameter>) => {
          if (actionParameter.body) {
            return of(actionParameter.body);
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
