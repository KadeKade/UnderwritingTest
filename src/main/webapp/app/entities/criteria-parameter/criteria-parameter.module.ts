import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CriteriaParameterComponent } from './list/criteria-parameter.component';
import { CriteriaParameterDetailComponent } from './detail/criteria-parameter-detail.component';
import { CriteriaParameterUpdateComponent } from './update/criteria-parameter-update.component';
import { CriteriaParameterDeleteDialogComponent } from './delete/criteria-parameter-delete-dialog.component';
import { CriteriaParameterRoutingModule } from './route/criteria-parameter-routing.module';

@NgModule({
  imports: [SharedModule, CriteriaParameterRoutingModule],
  declarations: [
    CriteriaParameterComponent,
    CriteriaParameterDetailComponent,
    CriteriaParameterUpdateComponent,
    CriteriaParameterDeleteDialogComponent,
  ],
})
export class CriteriaParameterModule {}
