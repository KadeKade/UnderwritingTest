import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CriteriaSetComponent } from '../list/criteria-set.component';
import { CriteriaSetDetailComponent } from '../detail/criteria-set-detail.component';
import { CriteriaSetUpdateComponent } from '../update/criteria-set-update.component';
import { CriteriaSetRoutingResolveService } from './criteria-set-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const criteriaSetRoute: Routes = [
  {
    path: '',
    component: CriteriaSetComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CriteriaSetDetailComponent,
    resolve: {
      criteriaSet: CriteriaSetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CriteriaSetUpdateComponent,
    resolve: {
      criteriaSet: CriteriaSetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CriteriaSetUpdateComponent,
    resolve: {
      criteriaSet: CriteriaSetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(criteriaSetRoute)],
  exports: [RouterModule],
})
export class CriteriaSetRoutingModule {}
