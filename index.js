const messageDiv = document.querySelector('#message'),
  inputTitle = document.querySelector('#input-title'),
  inputAuthor = document.querySelector('#input-author'),
  inputIsbn = document.querySelector('#input-isbn'),
  submitBtn = document.querySelector('input[type=submit]'),
  tbody = document.querySelector('#books'),
  container = document.querySelector('.container'),
  form = document.querySelector('form');

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBook(book) {
    const newEntry = `<tr>
                      <td>${book.title}</td>
                      <td>${book.author}</td>
                      <td>${book.isbn}</td>
                      <td><a href="#" class="delete">X</a></td>
                      </tr>`;

    tbody.insertAdjacentHTML('beforeend', newEntry);
  }

  clearFields() {

    inputTitle.value = '';
    inputAuthor.value = '';
    inputIsbn.value = '';

  }

  showMessage(msg, className) {

    const div = document.createElement('div');
    div.className = className;
    div.appendChild(document.createTextNode(msg));

    container.insertBefore(div, form);

    setTimeout(() => {
      div.remove();
    }, 3000);

  }

  deleteBook(target) {

    if (target.className === 'delete') {

      target.parentElement.parentElement.remove();

    }

  }
}

class Store {

  static getBooks() {

    let books;

    if (localStorage.getItem('books') === null) {

      books = [];

    } else {

      books = JSON.parse(localStorage.getItem('books'));

    }

    return books;

  }

  static displayBooks() {

    const books = Store.getBooks();

    if (books.length > 0) {

      const ui = new UI();

      books.forEach(book => {

        ui.addBook(book);

      });

    }

  }

  static addBooks(book) {

    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));

  }

  static removeBooks(isbn) {

    const books = Store.getBooks();

    books.forEach((book, index) => {

      if (book.isbn === isbn) {

        books.splice(index, 1);

      }

    });

    localStorage.setItem('books', JSON.stringify(books));

  }

}

document.addEventListener('DOMContentLoaded', Store.displayBooks);

submitBtn.addEventListener('click', (e) => {
  const book = new Book(inputTitle.value, inputAuthor.value, inputIsbn.value);

  const ui = new UI();

  e.preventDefault();

  if (inputTitle.value === '' || inputAuthor.value === '' || inputIsbn.value === '') {

    ui.showMessage('Please fill in all fields', 'message bg-red');

  } else {

    ui.addBook(book);

    Store.addBooks(book);

    ui.showMessage('Book added!', 'message bg-green');

    ui.clearFields();

  }

});

tbody.addEventListener('click', (e) => {

  e.preventDefault();

  const ui = new UI();

  ui.deleteBook(e.target);

  ui.showMessage('Book removed!', 'message bg-green');

  Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);

});