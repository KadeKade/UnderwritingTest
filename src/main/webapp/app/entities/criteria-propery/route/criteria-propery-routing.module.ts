import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CriteriaProperyComponent } from '../list/criteria-propery.component';
import { CriteriaProperyDetailComponent } from '../detail/criteria-propery-detail.component';
import { CriteriaProperyUpdateComponent } from '../update/criteria-propery-update.component';
import { CriteriaProperyRoutingResolveService } from './criteria-propery-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const criteriaProperyRoute: Routes = [
  {
    path: '',
    component: CriteriaProperyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CriteriaProperyDetailComponent,
    resolve: {
      criteriaPropery: CriteriaProperyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CriteriaProperyUpdateComponent,
    resolve: {
      criteriaPropery: CriteriaProperyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CriteriaProperyUpdateComponent,
    resolve: {
      criteriaPropery: CriteriaProperyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(criteriaProperyRoute)],
  exports: [RouterModule],
})
export class CriteriaProperyRoutingModule {}
