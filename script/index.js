const addBookBtn = document.querySelector(".add_btn");
const containerForBooks = document.querySelector(".container");
const modal = document.querySelector(".modal");
const modalInputs = document.querySelectorAll(".inp");
const checkbox = document.querySelector("#read");
const submitBtn = document.querySelector("#submit");
const myLibrary = [];

class Book {
  constructor(bookTitle, bookAuthor, bookPages, read) {
    this.bookTitle = bookTitle;
    this.bookAuthor = bookAuthor;
    this.bookPages = bookPages;
    this.read = read;
  }
}

function getValueAboutBook(e) {
  if (!modalInputs[0].validity.valid) {
    getInput.call(modalInputs[0]);
  }

  if (!modalInputs[1].validity.valid) {
    getInput.call(modalInputs[1]);
  }

  if (!modalInputs[2].validity.valid) {
    getInput.call(modalInputs[2]);
    e.preventDefault();
    return;
  }

  if ([...modalInputs].every((input) => input.className === "inp valid")) {
    myLibrary.push(
      new Book(
        modalInputs[0].value,
        modalInputs[1].value,
        modalInputs[2].value,
        checkbox.checked
      )
    );

    renderTheBookCard();
    e.preventDefault();
    modal.classList.remove("active");
    clearInputs();
  }
}

function removeBookCard(e) {
  if (e.target.classList[1] === "remove") {
    myLibrary.splice(this.dataset.index, 1);
    this.remove();
  }
  renderTheBookCard();
}

function changeBookStatus(e) {
  if (e.target.classList[1] === "read") {
    myLibrary[this.dataset.index].read = false;
  } else if (e.target.classList[1] === "notread") {
    myLibrary[this.dataset.index].read = true;
  }
  renderTheBookCard();
}

function renderTheBookCard() {
  containerForBooks.innerHTML = "";

  for (let i = 0; i < myLibrary.length; i++) {
    containerForBooks.innerHTML += `
      <div class='book' data-index='${i}'>
        <p class='book_title'>"${myLibrary[i].bookTitle}"</p>
        <p class='book_author'>${myLibrary[i].bookAuthor}</p>
        <p class='book_pages'>${myLibrary[i].bookPages}</p>
        <div class='btn_box'>
          <button type='button' class='btn ${
            myLibrary[i].read ? "read" : "notread"
          }'>${myLibrary[i].read ? "Read" : "Not read"}</button>
          <button type='button' class="btn remove">Remove</button>
        </div>
      </div>
    `;
  }

  const books = document.querySelectorAll(".book");
  books.forEach((book) => book.addEventListener("click", removeBookCard));
  books.forEach((book) => book.addEventListener("click", changeBookStatus));
}

function showError(input) {
  if (input.validity.valueMissing) {
    input.className = "inp invalid";
    input.parentElement.lastElementChild.textContent = "Please fill this field";
  } else if (input.type === "text") {
    if (input.validity.tooShort) {
      input.className = "inp invalid";
      input.parentElement.lastElementChild.textContent = `Book ${input.id} should be at least ${input.minLength} characters; you entered ${input.value.length}.`;
    }
  } else if (input.type === "number") {
    if (input.validity.rangeUnderflow) {
      input.className = "inp invalid";
      input.parentElement.lastElementChild.textContent = `Number of pages should be at least ${input.min}; you entered ${input.value}.`;
    }
  }
}

function validateInput(input) {
  if (input.validity.valid) {
    input.className = "inp valid";
    input.parentElement.lastElementChild.textContent = "";
  } else {
    showError(input);
  }
}

function getInput() {
  this.removeEventListener("blur", getInput);
  this.addEventListener("input", getInput);

  validateInput(this);
}

function openModal() {
  modal.classList.add("active");
}

function clearInputs() {
  modalInputs.forEach((input) => {
    input.value = "";
    input.removeEventListener("input", getInput);
    input.addEventListener("blur", getInput);
    input.className = "inp";
  });
  checkbox.checked = false;
}

function closeModal(e) {
  if (e.target.className === "modal active") {
    modal.classList.remove("active");
    clearInputs();
  }
}

addBookBtn.addEventListener("click", openModal);
window.addEventListener("click", closeModal);
modalInputs.forEach((inp) => inp.addEventListener("blur", getInput));
submitBtn.addEventListener("click", getValueAboutBook);
