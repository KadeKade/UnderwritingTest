import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICriteriaPropery } from '../criteria-propery.model';
import { CriteriaProperyService } from '../service/criteria-propery.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './criteria-propery-delete-dialog.component.html',
})
export class CriteriaProperyDeleteDialogComponent {
  criteriaPropery?: ICriteriaPropery;

  constructor(protected criteriaProperyService: CriteriaProperyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.criteriaProperyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
