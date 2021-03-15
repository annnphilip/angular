import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import {FormControl} from '@angular/forms';

import {
  RoleServiceProxy,
  RoleDto,
  PermissionDto,
  CreateQuestionInput,QuestionServiceProxy,
  TopicListDto,
  TopicListDtoListResultDto,
  TopicServiceProxy
} from '@shared/service-proxies/service-proxies';
import { forEach as _forEach, map as _map } from 'lodash-es';


@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent  extends AppComponentBase
  implements OnInit {
  saving = false;
  role = new RoleDto();
  question=new CreateQuestionInput();
  topics : TopicListDto[];
  permissions: PermissionDto[] = [];
  checkedPermissionsMap: { [key: string]: boolean } = {};
  defaultPermissionCheckedStatus = true;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _topicService: TopicServiceProxy,
    private _roleService: RoleServiceProxy,
    private _questService:QuestionServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(...args: []) {
    this.getAllTopics();
  }

  getAllTopics(){
    this._topicService.getAllTopics()
    .pipe(
     finalize(() => {
       console.log("Error")
       // finishedCallback();
     })
   )
    .subscribe( data => {
      console.log(data)
      this.topics=data.items;

    });
  }

  save(): void {
    this.saving = true;
    this._questService
      .insertQuest(this.question)
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
