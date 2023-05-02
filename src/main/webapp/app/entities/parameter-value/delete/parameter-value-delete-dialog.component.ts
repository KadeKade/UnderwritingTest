import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParameterValue } from '../parameter-value.model';
import { ParameterValueService } from '../service/parameter-value.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './parameter-value-delete-dialog.component.html',
})
export class ParameterValueDeleteDialogComponent {
  parameterValue?: IParameterValue;

  constructor(protected parameterValueService: ParameterValueService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.parameterValueService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
