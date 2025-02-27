import { Observable, Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { ArticleListConfig } from '@angular-ngrx-nx-realworld-example-app/article-list';
import { articleListInitialState, ArticleListFacade } from '@angular-ngrx-nx-realworld-example-app/article-list';
import { AuthFacade } from '@angular-ngrx-nx-realworld-example-app/auth';
import { HomeFacade } from './+state/home.facade';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  listConfig$: Observable<ArticleListConfig>;
  tags$: Observable<string[]>;
  isAuthenticated: boolean;
  unsubscribe$: Subject<void> = new Subject();

  constructor(
    private facade: HomeFacade,
    private articleListFacade: ArticleListFacade,
    private authFacade: AuthFacade,
  ) {}

  ngOnInit() {
    this.authFacade.isLoggedIn$.pipe(untilDestroyed(this)).subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
      this.getArticles();
    });
    this.listConfig$ = this.articleListFacade.listConfig$;
    this.tags$ = this.facade.tags$;
  }

  setListTo(type: string = 'ALL') {
    this.articleListFacade.setListConfig(<ArticleListConfig>{
      ...articleListInitialState.listConfig,
      type,
    });
  }

  getArticles() {
    if (this.isAuthenticated) {
      this.setListTo('FEED');
    } else {
      this.setListTo('ALL');
    }
  }

  setListTag(tag: string) {
    this.articleListFacade.setListConfig(<ArticleListConfig>{
      ...articleListInitialState.listConfig,
      filters: {
        ...articleListInitialState.listConfig.filters,
        tag,
      },
    });
  }
}
