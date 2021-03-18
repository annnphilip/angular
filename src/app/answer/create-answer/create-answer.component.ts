import {Component,Injector,OnInit,EventEmitter,Output,} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import {FormControl} from '@angular/forms';

import {
  AnswerServiceProxy,
  AnswerListDto,
  CreateAnswerInput,
  PermissionDto
} from '@shared/service-proxies/service-proxies';
import { forEach as _forEach, map as _map } from 'lodash-es';

@Component({
  selector: 'app-create-answer',
  templateUrl: './create-answer.component.html',
  styleUrls: ['./create-answer.component.css']
})
export class CreateAnswerComponent   extends AppComponentBase
  implements OnInit {
  saving = false;
  answer=new CreateAnswerInput();
  permissions: PermissionDto[] = [];
  checkedPermissionsMap: { [key: string]: boolean } = {};
  defaultPermissionCheckedStatus = true;
  qid:number;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _ansService:AnswerServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(...args: []) {
    console.log(this.qid);
  }


  save(): void {
    this.saving = true;
    this.answer.questionId=this.qid;
    this._ansService
      .createAnswer(this.answer)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      });
  }
}
