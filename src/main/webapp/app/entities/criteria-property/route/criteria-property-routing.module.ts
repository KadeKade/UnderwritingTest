import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CriteriaPropertyComponent } from '../list/criteria-property.component';
import { CriteriaPropertyDetailComponent } from '../detail/criteria-property-detail.component';
import { CriteriaPropertyUpdateComponent } from '../update/criteria-property-update.component';
import { CriteriaPropertyRoutingResolveService } from './criteria-property-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const criteriaPropertyRoute: Routes = [
  {
    path: '',
    component: CriteriaPropertyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CriteriaPropertyDetailComponent,
    resolve: {
      criteriaProperty: CriteriaPropertyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CriteriaPropertyUpdateComponent,
    resolve: {
      criteriaProperty: CriteriaPropertyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CriteriaPropertyUpdateComponent,
    resolve: {
      criteriaProperty: CriteriaPropertyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(criteriaPropertyRoute)],
  exports: [RouterModule],
})
export class CriteriaPropertyRoutingModule {}
