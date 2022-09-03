/* struktur data objek JavaScript
{
    id: string | number,
    title: string,
    author: string,
    year: number,
    isComplete: boolean,
}
*/

const bookshelfs = [];
const RENDER_EVENT = 'render-bookshelf';
const inputSearchBook = document.getElementById('searchBookTitle');
const formSearchBook = document.getElementById('searchBook');

inputSearchBook.addEventListener('keyup', (event) => {
  event.preventDefault();
  searchBookByTitle();
});

formSearchBook.addEventListener('submit', (event) => {
  event.preventDefault();
  searchBookByTitle();
});

function createId() {
  return +new Date();
}

function createBookshelfObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

// change text submit
const isCheckComplete = document.getElementById('inputBookIsComplete');
isCheckComplete.addEventListener('click', function () {
  const checkbox = document.getElementById('inputBookIsComplete');
  const changeText = document.querySelector('#bookSubmit span');
  if (checkbox.checked) {
    changeText.innerHTML = 'Completed';
  } else {
    changeText.innerHTML = 'Bookmark';
  }
});

// check complete read
function checkCompleteRead() {
  const isCheckComplete = document.getElementById('inputBookIsComplete');
  if (isCheckComplete.checked) {
    return true;
  }
  return false;
}

// function search book
function searchBookByTitle() {
  const inputSearch = document.getElementById('searchBookTitle').value;
  const bookmarkBookshelf = document.getElementById('bookmarkBookshelfList');
  const completeBookshelf = document.getElementById('completeBookshelfList');
  bookmarkBookshelf.innerHTML = '';
  completeBookshelf.innerHTML = '';

  if (inputSearch == '') {
    document.dispatchEvent(new Event(RENDER_EVENT));
    return;
  }

  for (const bookItem of bookshelfs) {
    if (bookItem.title.toLowerCase().includes(inputSearch)) {
      if (bookItem.isCompleted) {
        let elementCompleted = `
              <div class="book-item">
                <div class="book-info">
                  <h2>${bookItem.title}</h2>
                  <p>Penulis : ${bookItem.author}</p>
                  <p>Tahun Terbit : ${bookItem.year}</p>
                </div>
                <div class="action">
                  <button class="button1" onclick="addBookToCompleted(${bookItem.id})"><i class="fa-solid fa-check"></i></button>
                  <button class="button2" onclick="removeBookFromCompleted(${bookItem.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>
            `;

        completeBookshelf.innerHTML += elementCompleted;
      } else {
        let elementBookmark = `
              <div class="book-item">
                <div class="book-info">
                  <h2>${bookItem.title}</h2>
                  <p>Penulis : ${bookItem.author}</p>
                  <p>Tahun Terbit : ${bookItem.year}</p>
                </div>
                <div class="action">
                  <button class="button1" onclick="addBookToCompleted(${bookItem.id})"><i class="fa-solid fa-check"></i></button>
                  <button class="button2" onclick="editBook(${bookItem.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                  <button class="button2" onclick="removeBookFromCompleted(${bookItem.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>
            `;

        bookmarkBookshelf.innerHTML += elementBookmark;
      }
    }
  }
}

function addNewToBookshelf() {
  const newBookTitle = document.getElementById('inputBookTitle').value;
  const newBookAuthor = document.getElementById('inputBookAuthor').value;
  const newBookYear = document.getElementById('inputBookYear').value;

  const isCompleted = checkCompleteRead();

  const createID = createId();
  const bookshelfObject = createBookshelfObject(createID, newBookTitle, newBookAuthor, newBookYear, isCompleted);
  bookshelfs.unshift(bookshelfObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeBookshelf(bookshelfObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = bookshelfObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = 'Author : ' + bookshelfObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = 'Year : ' + bookshelfObject.year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('book-info');
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement('div');
  container.classList.add('book-item');
  container.append(textContainer);
  container.setAttribute('id', `bookshelf-${bookshelfObject.id}`);

  if (bookshelfObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('button1');
    undoButton.innerHTML = '<i class="fa-solid fa-rotate-left"></i>';

    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(bookshelfObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('button2');
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    trashButton.addEventListener('click', function () {
      let confirmDelete = confirm("Are you sure you want to delete the book '" + bookshelfObject.title + "'?");
      if (confirmDelete) {
        removeBookFromCompleted(bookshelfObject.id);
      }
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('button1');
    checkButton.innerHTML = '<i class="fa-solid fa-check"></i>';

    checkButton.addEventListener('click', function () {
      addBookToCompleted(bookshelfObject.id);
    });

    const editButton = document.createElement('button');
    editButton.classList.add('button2');
    editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

    editButton.addEventListener('click', function () {
      editBook(bookshelfObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('button2');
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    trashButton.addEventListener('click', function () {
      let confirmDelete = confirm("Are you sure you want to delete the book '" + bookshelfObject.title + "'?");
      if (confirmDelete) {
        removeBookFromCompleted(bookshelfObject.id);
      }
    });

    container.append(checkButton, editButton, trashButton);
  }

  return container;
}

function findBookshelf(bookId) {
  for (const bookshelfItem of bookshelfs) {
    if (bookshelfItem.id === bookId) {
      return bookshelfItem;
    }
  }
  return null;
}

function findBookshelfIndex(bookId) {
  for (const index in bookshelfs) {
    if (bookshelfs[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function addBookToCompleted(bookId) {
  const bookshelfTarget = findBookshelf(bookId);
  if (bookshelfTarget == null) return;

  bookshelfTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookshelfTarget = findBookshelfIndex(bookId);
  if (bookshelfTarget === -1) return;
  bookshelfs.splice(bookshelfTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookshelfTarget = findBookshelf(bookId);
  if (bookshelfTarget == null) return;

  bookshelfTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// function edit book data
function editBook(bookId) {
  const editBookData = document.querySelector('.edit-data');
  editBookData.style.display = 'flex';
  const editBookTitle = document.getElementById('inputEditBookTitle');
  const editBookAuthor = document.getElementById('inputEditBookAuthor');
  const editBookYear = document.getElementById('inputEditBookYear');
  const formEditData = document.getElementById('editBookData');
  const cancelEdit = document.getElementById('editDataCancel');
  const submitEdit = document.getElementById('editDataSubmit');

  const bookIndex = findBookshelfIndex(bookId);

  // set current data value
  editBookTitle.setAttribute('value', bookshelfs[bookIndex].title);
  editBookAuthor.setAttribute('value', bookshelfs[bookIndex].author);
  editBookYear.setAttribute('value', bookshelfs[bookIndex].year);

  // update data
  submitEdit.addEventListener('click', () => {
    bookshelfs[bookIndex].title = editBookTitle.value;
    bookshelfs[bookIndex].author = editBookAuthor.value;
    bookshelfs[bookIndex].year = editBookYear.value;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    formEditData.reset();
    editBookData.style.display = 'none';
    alert('Success, your book have been updated !');
  });

  cancelEdit.addEventListener('click', () => {
    editBookData.style.display = 'none';
    formEditData.reset();
    alert('Are you sure want to cancel edit book data ?');
  });
}

// localStorage web requirement
const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'bookshelfApps';

// check support storage
function isSupportStorage() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

// save data to localStorage
function saveData() {
  if (isSupportStorage()) {
    const parsed = JSON.stringify(bookshelfs);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// load data from storage
function loadDataFromStorage() {
  const loadedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(loadedData);

  if (data !== null) {
    for (const bookshelf of data) {
      bookshelfs.push(bookshelf);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// input new book
document.addEventListener('DOMContentLoaded', function () {
  const inputNewBook = document.getElementById('inputBook');
  inputNewBook.addEventListener('submit', function (event) {
    event.preventDefault();
    addNewToBookshelf();
  });

  if (isSupportStorage()) {
    loadDataFromStorage();
  }
});

// set book year default
const defaultBookYear = document.getElementById('inputBookYear');
defaultBookYear.addEventListener('click', function () {
  defaultBookYear.setAttribute('value', '2022');
});

// render event
document.addEventListener(RENDER_EVENT, function () {
  const bookmarkList = document.getElementById('bookmarkBookshelfList');
  bookmarkList.innerHTML = '';

  const completedList = document.getElementById('completeBookshelfList');
  completedList.innerHTML = '';

  for (const bookshelfItem of bookshelfs) {
    const bookshelfElement = makeBookshelf(bookshelfItem);

    if (!bookshelfItem.isCompleted) {
      bookmarkList.append(bookshelfElement);
    } else {
      completedList.append(bookshelfElement);
    }
  }
});

// save event
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
