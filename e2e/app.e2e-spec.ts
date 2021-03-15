import { Discussion_forumTemplatePage } from './app.po';

describe('Discussion_forum App', function() {
  let page: Discussion_forumTemplatePage;

  beforeEach(() => {
    page = new Discussion_forumTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
