const getTabs = async () => {
  const windowQuery = await chrome.windows.getCurrent({populate: true});
  return windowQuery.tabs;
};

const messageUser = (message) => {
  const clearMessage = () => (messageElem.innerText = '');
  const messageElem = document.getElementById('message');
  messageElem.innerText = message;
  setTimeout(clearMessage, 3000);
};

const createBookmarksFolder = async () => {
  const folderTitle = document.getElementById('folderName').value || 'Project folder';

  const bookmarkTree = await chrome.bookmarks.getTree();
  const bookmarksBarNode = bookmarkTree[0].children[0];
  const newBookmarksFolder = await chrome.bookmarks.create({
    title: folderTitle,
    parentId: bookmarksBarNode.id,
  });
  console.debug('newBookmarksFolder', newBookmarksFolder);
  return newBookmarksFolder;
};

const closeAllTabs = (tabList) => {
  chrome.tabs.create({});
  tabList.forEach((tab) => {
    chrome.tabs.remove([tab.id]);
  });
};

const createBookmarks = (newBookmarksFolder, tabList) => {
  tabList.forEach((tab) => {
    chrome.bookmarks.create({
      title: tab.title,
      url: tab.url,
      parentId: newBookmarksFolder.id,
    });
  });
};

const buttonFunc = async () => {
  console.debug('Button click');
  const tabList = await getTabs();
  const newBookmarksFolder = await createBookmarksFolder();
  createBookmarks(newBookmarksFolder, tabList);
  closeAllTabs(tabList);
  messageUser('Tabs saved');
};

const addSaveTabsButtonFunctionality = () => {
  const button = document.getElementById('saveTabs');
  button.addEventListener('click', buttonFunc);
};

const listenForEnter = () => {
  const inputElem = document.getElementById('folderName');

  inputElem.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      buttonFunc();
    }
  });
};

const main = () => {
  console.log('Running main');
  addSaveTabsButtonFunctionality();
  listenForEnter();
};

main();
