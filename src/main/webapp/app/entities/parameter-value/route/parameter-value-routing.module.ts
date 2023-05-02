import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParameterValueComponent } from '../list/parameter-value.component';
import { ParameterValueDetailComponent } from '../detail/parameter-value-detail.component';
import { ParameterValueUpdateComponent } from '../update/parameter-value-update.component';
import { ParameterValueRoutingResolveService } from './parameter-value-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const parameterValueRoute: Routes = [
  {
    path: '',
    component: ParameterValueComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParameterValueDetailComponent,
    resolve: {
      parameterValue: ParameterValueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParameterValueUpdateComponent,
    resolve: {
      parameterValue: ParameterValueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParameterValueUpdateComponent,
    resolve: {
      parameterValue: ParameterValueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(parameterValueRoute)],
  exports: [RouterModule],
})
export class ParameterValueRoutingModule {}
