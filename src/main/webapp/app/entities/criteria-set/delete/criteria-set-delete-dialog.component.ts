import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICriteriaSet } from '../criteria-set.model';
import { CriteriaSetService } from '../service/criteria-set.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './criteria-set-delete-dialog.component.html',
})
export class CriteriaSetDeleteDialogComponent {
  criteriaSet?: ICriteriaSet;

  constructor(protected criteriaSetService: CriteriaSetService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.criteriaSetService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
