import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActionParametersComponent } from '../list/action-parameters.component';
import { ActionParametersDetailComponent } from '../detail/action-parameters-detail.component';
import { ActionParametersUpdateComponent } from '../update/action-parameters-update.component';
import { ActionParametersRoutingResolveService } from './action-parameters-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const actionParametersRoute: Routes = [
  {
    path: '',
    component: ActionParametersComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActionParametersDetailComponent,
    resolve: {
      actionParameters: ActionParametersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActionParametersUpdateComponent,
    resolve: {
      actionParameters: ActionParametersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActionParametersUpdateComponent,
    resolve: {
      actionParameters: ActionParametersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(actionParametersRoute)],
  exports: [RouterModule],
})
export class ActionParametersRoutingModule {}
