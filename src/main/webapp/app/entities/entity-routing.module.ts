import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'action',
        data: { pageTitle: 'Actions' },
        loadChildren: () => import('./action/action.module').then(m => m.ActionModule),
      },
      {
        path: 'action-parameters',
        data: { pageTitle: 'ActionParameters' },
        loadChildren: () => import('./action-parameters/action-parameters.module').then(m => m.ActionParametersModule),
      },
      {
        path: 'action-parameter-values',
        data: { pageTitle: 'ActionParameterValues' },
        loadChildren: () => import('./action-parameter-values/action-parameter-values.module').then(m => m.ActionParameterValuesModule),
      },
      {
        path: 'criteria-set',
        data: { pageTitle: 'CriteriaSets' },
        loadChildren: () => import('./criteria-set/criteria-set.module').then(m => m.CriteriaSetModule),
      },
      {
        path: 'criteria',
        data: { pageTitle: 'Criteria' },
        loadChildren: () => import('./criteria/criteria.module').then(m => m.CriteriaModule),
      },
      {
        path: 'criteria-propery',
        data: { pageTitle: 'CriteriaProperies' },
        loadChildren: () => import('./criteria-propery/criteria-propery.module').then(m => m.CriteriaProperyModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
