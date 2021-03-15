
import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forEach as _forEach, includes as _includes, map as _map } from 'lodash-es';
import { AppComponentBase } from '@shared/app-component-base';
import {
  TopicServiceProxy,
  EditTopicInput,
  TopicListDto,
  TopicListDtoListResultDto
} from '@shared/service-proxies/service-proxies';
@Component({
  selector: 'app-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.css']
})
export class EditTopicComponent   extends AppComponentBase
  implements OnInit {
  saving = false;
  id: number;
  // topic = new EditTopicInput();
  topic:EditTopicInput;
  grantedPermissionNames: string[];
  checkedPermissionsMap: { [key: string]: boolean } = {};

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _topicService: TopicServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._topicService.getAll(this.id)
      .subscribe((result) => {
        this.topic = result.items[0];
        console.log(this.topic);
      });
  }

  

  save(): void {
    this.saving = true;
    //const topic = new TopicListDto();
    //role.init(this.role);

    this._topicService
      .updateTopic(this.topic)
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
