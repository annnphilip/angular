import { Component, Injector ,OnInit} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';
import{ ActivatedRoute } from '@angular/router';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from 'shared/paged-listing-component-base';
import {
  QuestionServiceProxy,
  QuestionOutputDto,
  QuestionOutputDtoListResultDto,
  AnswerOutputDto,
  AnswerOutputDtoPagedResultDto,
  AnswerServiceProxy
} from '@shared/service-proxies/service-proxies';


class PagedAnswerRequestDto extends PagedRequestDto {
  keyword: string;
  //isActive: boolean | null;
}

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent extends PagedListingComponentBase<AnswerOutputDto> {
  protected delete(entity: AnswerOutputDto): void {
    throw new Error('Method not implemented.');
  }
  question: QuestionOutputDto[] = [];
  answers: AnswerOutputDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;
  //loading:boolean;
  router: any;
  questId:number=0;

  constructor(
    injector: Injector,
    private _questService: QuestionServiceProxy,
    private _answerService: AnswerServiceProxy,
    private _modalService: BsModalService,
    private _activatedRoute: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnInit(): void {
    const id=this._activatedRoute.snapshot.queryParams['questionId'];
    this.questId=id;
    console.log(id);
    this.getQuestionbyId(id);
    this.getAllAnswers(id,"",0,10);
  }

  getQuestionbyId(qid){
    // this.loading = true;
    this._questService.getAllQuestionByID(qid)
    .pipe(
     finalize(() => {
        finishedCallback();
     })
   )
    .subscribe(( data:QuestionOutputDtoListResultDto )=> {
      console.log(data)
      this.question=data.items;
      console.log(this.question);
    });
   }

   getAllAnswers(qid,questkeyword: string,skipCount: number,maxResultCount: number){
    // this.loading = true;
    this._answerService.getPaginatedAnswers(qid,questkeyword,skipCount,maxResultCount)
    .pipe(
     finalize(() => {
       finishedCallback();
     })
   )
    .subscribe( data => {
      console.log(data)
      this.answers=data.items;
      this.totalItems=data.totalCount;
    });

   }

  
  // editQuestio(questions: QuestionListDto): void {
  //   // this.showCreateOrEditQuestion(questions.id);
  // }

  
  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }

  protected list(
    request: PagedAnswerRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this._answerService
      .getPaginatedAnswers(
        this.questId,
        request.keyword,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result:AnswerOutputDtoPagedResultDto) => {
        this.answers = result.items;
        console.log(this.answers)
        this.showPaging(result, pageNumber);
      });
  }
}
function finishedCallback() {
  throw new Error('Function not implemented.');
}

