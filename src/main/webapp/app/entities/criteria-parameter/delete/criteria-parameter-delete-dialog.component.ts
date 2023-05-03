import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICriteriaParameter } from '../criteria-parameter.model';
import { CriteriaParameterService } from '../service/criteria-parameter.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './criteria-parameter-delete-dialog.component.html',
})
export class CriteriaParameterDeleteDialogComponent {
  criteriaParameter?: ICriteriaParameter;

  constructor(protected criteriaParameterService: CriteriaParameterService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.criteriaParameterService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
