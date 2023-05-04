import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CriteriaParameterComponent } from '../list/criteria-parameter.component';
import { CriteriaParameterDetailComponent } from '../detail/criteria-parameter-detail.component';
import { CriteriaParameterUpdateComponent } from '../update/criteria-parameter-update.component';
import { CriteriaParameterRoutingResolveService } from './criteria-parameter-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const criteriaParameterRoute: Routes = [
  {
    path: '',
    component: CriteriaParameterComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CriteriaParameterDetailComponent,
    resolve: {
      criteriaParameter: CriteriaParameterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CriteriaParameterUpdateComponent,
    resolve: {
      criteriaParameter: CriteriaParameterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CriteriaParameterUpdateComponent,
    resolve: {
      criteriaParameter: CriteriaParameterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(criteriaParameterRoute)],
  exports: [RouterModule],
})
export class CriteriaParameterRoutingModule {}
