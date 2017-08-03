import { TaskManagementPage } from './app.po';

describe('task-management App', () => {
  let page: TaskManagementPage;

  beforeEach(() => {
    page = new TaskManagementPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
