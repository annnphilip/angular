import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
  RoleServiceProxy,
  RoleDto,
  RoleDtoPagedResultDto,
  TopicListDto,
  TopicListDtoListResultDto,
  TopicServiceProxy
} from '@shared/service-proxies/service-proxies';
import { CreateTopicComponent } from './create-topic/create-topic.component';
import { EditTopicComponent } from './edit-topic/edit-topic.component';
import { Subscriber } from 'rxjs';

class PagedRolesRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent  extends PagedListingComponentBase<TopicListDto> {
  roles: RoleDto[] = [];
  topics: TopicListDto[] = [];
  keyword = '';

  constructor(
    injector: Injector,
    private _topicService: TopicServiceProxy,
    private _rolesService: RoleServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }
  ngOnInit(){
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

  list(
    request: PagedRolesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._rolesService
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: RoleDtoPagedResultDto) => {
        this.roles = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(topic: TopicListDto): void {
    abp.message.confirm(
      this.l('TopicDeleteWarningMessage', topic.topicName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._topicService
            .deleteTopic(topic.id,topic.topicName)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
                this.refresh();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  createTopic(): void {
    this.showCreateOrEditTopicDialog();
  }

  editTopic(topic: TopicListDto): void {
    this.showCreateOrEditTopicDialog(topic.id);
  }

  showCreateOrEditTopicDialog(id?: number): void {
    let createOrEditTopicDialog: BsModalRef;
    if (!id) {
      createOrEditTopicDialog = this._modalService.show(
        CreateTopicComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditTopicDialog = this._modalService.show(
        EditTopicComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditTopicDialog.content.onSave.subscribe(() => {
      // this.refresh();
      this.getAllTopics();
    });
  }
}
function finishedCallback() {
  throw new Error('Function not implemented.');
}

