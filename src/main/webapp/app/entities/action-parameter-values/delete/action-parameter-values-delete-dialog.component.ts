import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActionParameterValues } from '../action-parameter-values.model';
import { ActionParameterValuesService } from '../service/action-parameter-values.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './action-parameter-values-delete-dialog.component.html',
})
export class ActionParameterValuesDeleteDialogComponent {
  actionParameterValues?: IActionParameterValues;

  constructor(protected actionParameterValuesService: ActionParameterValuesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.actionParameterValuesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
