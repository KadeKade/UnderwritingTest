import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CriteriaComponent } from './list/criteria.component';
import { CriteriaDetailComponent } from './detail/criteria-detail.component';
import { CriteriaUpdateComponent } from './update/criteria-update.component';
import { CriteriaDeleteDialogComponent } from './delete/criteria-delete-dialog.component';
import { CriteriaRoutingModule } from './route/criteria-routing.module';

@NgModule({
  imports: [SharedModule, CriteriaRoutingModule],
  declarations: [CriteriaComponent, CriteriaDetailComponent, CriteriaUpdateComponent, CriteriaDeleteDialogComponent],
})
export class CriteriaModule {}
