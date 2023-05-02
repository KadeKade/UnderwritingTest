import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'automated-action',
        data: { pageTitle: 'AutomatedActions' },
        loadChildren: () => import('./automated-action/automated-action.module').then(m => m.AutomatedActionModule),
      },
      {
        path: 'action-parameter',
        data: { pageTitle: 'ActionParameters' },
        loadChildren: () => import('./action-parameter/action-parameter.module').then(m => m.ActionParameterModule),
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
        path: 'criteria-property',
        data: { pageTitle: 'CriteriaProperties' },
        loadChildren: () => import('./criteria-property/criteria-property.module').then(m => m.CriteriaPropertyModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
