import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CriteriaSetComponent } from './list/criteria-set.component';
import { CriteriaSetDetailComponent } from './detail/criteria-set-detail.component';
import { CriteriaSetUpdateComponent } from './update/criteria-set-update.component';
import { CriteriaSetDeleteDialogComponent } from './delete/criteria-set-delete-dialog.component';
import { CriteriaSetRoutingModule } from './route/criteria-set-routing.module';

@NgModule({
  imports: [SharedModule, CriteriaSetRoutingModule],
  declarations: [CriteriaSetComponent, CriteriaSetDetailComponent, CriteriaSetUpdateComponent, CriteriaSetDeleteDialogComponent],
})
export class CriteriaSetModule {}
