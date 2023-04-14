import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CriteriaProperyComponent } from './list/criteria-propery.component';
import { CriteriaProperyDetailComponent } from './detail/criteria-propery-detail.component';
import { CriteriaProperyUpdateComponent } from './update/criteria-propery-update.component';
import { CriteriaProperyDeleteDialogComponent } from './delete/criteria-propery-delete-dialog.component';
import { CriteriaProperyRoutingModule } from './route/criteria-propery-routing.module';

@NgModule({
  imports: [SharedModule, CriteriaProperyRoutingModule],
  declarations: [
    CriteriaProperyComponent,
    CriteriaProperyDetailComponent,
    CriteriaProperyUpdateComponent,
    CriteriaProperyDeleteDialogComponent,
  ],
})
export class CriteriaProperyModule {}
