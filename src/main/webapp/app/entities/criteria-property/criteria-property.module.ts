import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CriteriaPropertyComponent } from './list/criteria-property.component';
import { CriteriaPropertyDetailComponent } from './detail/criteria-property-detail.component';
import { CriteriaPropertyUpdateComponent } from './update/criteria-property-update.component';
import { CriteriaPropertyDeleteDialogComponent } from './delete/criteria-property-delete-dialog.component';
import { CriteriaPropertyRoutingModule } from './route/criteria-property-routing.module';

@NgModule({
  imports: [SharedModule, CriteriaPropertyRoutingModule],
  declarations: [
    CriteriaPropertyComponent,
    CriteriaPropertyDetailComponent,
    CriteriaPropertyUpdateComponent,
    CriteriaPropertyDeleteDialogComponent,
  ],
})
export class CriteriaPropertyModule {}
