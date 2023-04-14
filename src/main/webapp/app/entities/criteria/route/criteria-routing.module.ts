import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CriteriaComponent } from '../list/criteria.component';
import { CriteriaDetailComponent } from '../detail/criteria-detail.component';
import { CriteriaUpdateComponent } from '../update/criteria-update.component';
import { CriteriaRoutingResolveService } from './criteria-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const criteriaRoute: Routes = [
  {
    path: '',
    component: CriteriaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CriteriaDetailComponent,
    resolve: {
      criteria: CriteriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CriteriaUpdateComponent,
    resolve: {
      criteria: CriteriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CriteriaUpdateComponent,
    resolve: {
      criteria: CriteriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(criteriaRoute)],
  exports: [RouterModule],
})
export class CriteriaRoutingModule {}
