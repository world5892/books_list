class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  showAlert(msg, className) {
    // Removing previous alert
    document.querySelector(".success") && document.querySelector(".success").remove();

    document.querySelector(".error") && document.querySelector(".error").remove();

    // Creating alert
    const form = document.querySelector("#book-form");

    const alertPar = document.createElement("div");
    alertPar.className = className;
    alertPar.textContent = msg;
    form.insertAdjacentElement("beforebegin", alertPar);

    const removeTimer = setTimeout(() => {
      alertPar.remove();
      clearTimeout(removeTimer);
    }, 2000);
  }

  addBookToList(book) {  
    // Adding book to list
    const bookList = document.querySelector("#book-list");
    const bookHtml = `
      <tr>
        <th>${book.title}</th>
        <th>${book.author}</th>
        <th>${book.isbn}</th>
        <th><a class="delete">X</a></th>
      </tr>
    `;

    bookList.insertAdjacentHTML("beforeend", bookHtml);
  }

  clearInputs() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  deleteBookFromList(book) {
    book.remove();
  }

  deleteBooksFromList() {
    document.querySelector("#book-list").innerHTML = "";
  }

  showAndHideRemoveBtn(action) {
    if(action) {
      document.querySelector(".btn-delete").style.display = "block";
    } else {
      document.querySelector(".btn-delete").style.display = "none";
    }
  }
}

class LocalStorage {
  static getBooks() {
    let books;
    
    if(localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static displayBooks() {
    const books = LocalStorage.getBooks();
    const ui = new UI();
    books.forEach(book => ui.addBookToList(book));
  }

  static addBook(book) {
    const books = LocalStorage.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = LocalStorage.getBooks();
    const booksUpd = books.filter(book => book.isbn !== isbn);
    localStorage.setItem("books", JSON.stringify(booksUpd));
  }

  static removeBooks() {
    localStorage.setItem("books", JSON.stringify([]));
  }
}

// Instantiating UI
const ui = new UI();

// Display books from LS and show remove btn
document.addEventListener("DOMContentLoaded", () => {
  LocalStorage.displayBooks();

  if(LocalStorage.getBooks().length > 0) {
    ui.showAndHideRemoveBtn(true);
  }
});

// Event Listeners
document.querySelector("#book-form").addEventListener("submit", e => {
  e.preventDefault();

  // Book Data
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // Validation
  if(title === "" || author === "" || isbn === "") {
    ui.showAlert("Please fill in all fields", "error");
    return false;
  }

  // Book Instatiation
  const book = new Book(title, author, isbn);

  ui.addBookToList(book);

  // Add the book to LS
  LocalStorage.addBook(book);

  ui.showAlert("Book added!", "success");

  ui.clearInputs();

  // Show remove btn
  if(document.querySelector(".btn-delete").getElementsByClassName.display !== "block") {
    ui.showAndHideRemoveBtn(true);
  }
});

document.querySelector("#book-list").addEventListener("click", (e) => {
  if(e.target.classList.contains('delete')) {
    const book = e.target.parentElement.parentElement;
    
    ui.deleteBookFromList(book);

    ui.showAlert("Book deleted!", "success");

    LocalStorage.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Hide remove btn if there are no books
    if(LocalStorage.getBooks().length === 0) {
      ui.showAndHideRemoveBtn(false);
    }
  }
});

document.querySelector(".btn-delete").addEventListener("click", () => {
  ui.deleteBooksFromList();

  // Remove all from LS
  LocalStorage.removeBooks();

  // Hide remove btn
  ui.showAndHideRemoveBtn(false);
});