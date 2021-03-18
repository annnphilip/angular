import { Component, Injector ,OnInit} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';

import {
  PagedListingComponentBase,
  PagedRequestDto
} from 'shared/paged-listing-component-base';
import {
  QuestionListDto,
  QuestionServiceProxy,
  QuestionListDtoListResultDto,
  QuestionOutputDto,
  QuestionOutputDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { AbpSessionService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/app-component-base';

class PagedQuestionsRequestDto extends PagedRequestDto {
  keyword: string;
  //isActive: boolean | null;
}

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent extends PagedListingComponentBase<QuestionOutputDto> {
  questions: QuestionOutputDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;
  loading:boolean;
  router: any;
  userId:number;

  constructor(
    injector: Injector,
    private _questService: QuestionServiceProxy,
    private _modalService: BsModalService,
    private _router: Router,
    private _sessionService:AbpSessionService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    console.log(this._sessionService.userId
    );
    this.userId=this._sessionService.userId;
    this.getAllQuestion("",0,10);
  }

  getAllQuestion(questkeyword: string,skipCount: number,maxResultCount: number){
    // this.loading = true;
    this._questService.getPaginatedQuestions(questkeyword,skipCount,maxResultCount)
    .pipe(
     finalize(() => {
      this.loading = false;
       //console.log("Error")
       finishedCallback();
     })
   )
    .subscribe( data => {
      console.log(data)
      this.questions=data.items;
      this.totalItems=data.totalCount;
    });

   }

  createQuestion(): void {
    this.showCreateOrEditQuestion();
  }

  editQuestio(questions: QuestionListDto): void {
    this.showCreateOrEditQuestion(questions.id);
  }

  
  viewAnswers(questions: QuestionOutputDto):void{
    console.log(questions.id);
    this._router.navigate(['app/answer'],{queryParams:{questionId: questions.id}});
    // new AnswerComponent();(questions.id);
  }


  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }

  protected list(
    request: PagedQuestionsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    // request.isActive = this.isActive;
    // this._questService.getAllQuestion()
    // .pipe(
    //  finalize(() => {
    //   // console.log("Error")
    //     finishedCallback();
    //  })
    // )
    //  .subscribe( data => {
    //   console.log(data)
    //   this.questions=data.items;

    // });
    this._questService
      .getPaginatedQuestions(
        request.keyword,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result:QuestionOutputDtoPagedResultDto) => {
        this.questions = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(questions: QuestionOutputDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', questions.questionsText),
      undefined,
      (result: boolean) => {
        if (result) {
          this._questService.deleteQuestion(questions.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }


  private showCreateOrEditQuestion(id?: number): void {
    let createOrEditQuestion: BsModalRef;
    if (!id) {
      createOrEditQuestion = this._modalService.show(
        CreateQuestionComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditQuestion = this._modalService.show(
        EditQuestionComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditQuestion.content.onSave.subscribe(() => {
      this.refresh();
      // this.getAllQuestion();
    });
  }
}
function finishedCallback() {
  throw new Error('Function not implemented.');
}

