const addBookBtn = document.querySelector(".add_btn");
const containerForBooks = document.querySelector(".container");
const modal = document.querySelector(".modal");
const modalInputs = document.querySelectorAll(".inp");
const checkbox = document.querySelector("#read");
const submitBtn = document.querySelector("#submit");
const myLibrary = [];

function Book(bookTitle, bookAuthor, bookPages, read) {
  this.bookTitle = bookTitle;
  this.bookAuthor = bookAuthor;
  this.bookPages = bookPages;
  this.read = read;
}

function getValueAboutBook(e) {
  e.preventDefault();
  const arrWithInputs = [...modalInputs];
  const arrWithValidValues = [];
  const userRead = checkbox.checked;
  const books = document.querySelectorAll(".book");

  for (let i = 0; i < arrWithInputs.length; i++) {
    if (arrWithInputs[i].classList[1] === "valid") {
      arrWithValidValues.push(arrWithInputs[i]);
    }
  }

  if (arrWithValidValues.length === 3) {
    myLibrary.push(
      new Book(
        arrWithValidValues[0].value,
        arrWithValidValues[1].value,
        arrWithValidValues[2].value,
        userRead
      )
    );
  } else {
    alert("Please check the correctness of the filled fields");
  }

  for (let i = books.length; i < myLibrary.length; i++) {
    showTheBookCard(myLibrary[i], i);
  }

  modalInputs.forEach((inp) => {
    inp.value = "";
    inp.classList.remove("valid");
    inp.removeEventListener("input", getInput);
    inp.addEventListener("blur", getInput);
  });

  checkbox.checked = false;
  modal.classList.remove("active");
}

function removeBookCard(e) {
  if (e.target.classList[1] === "remove") {
    myLibrary.splice(this.dataset.id, 1);
    this.remove();
    const books = document.querySelectorAll(".book");
    const arrWithBooks = [...books];
    for (let i = 0; i < arrWithBooks.length; i++) {
      arrWithBooks[i].dataset.id = i;
    }
  }
}

function changeBookStatus(e) {
  if (e.target.classList[1] === "read") {
    e.target.classList.remove("read");
    e.target.classList.add("notread");
    e.target.textContent = "Not read";
    myLibrary[this.dataset.id].read = false;
  } else if (e.target.classList[1] === "notread") {
    e.target.classList.remove("notread");
    e.target.classList.add("read");
    e.target.textContent = "Read";
    myLibrary[this.dataset.id].read = true;
  }
}

function showTheBookCard(bookObj, idOfBook) {
  const div = document.createElement("div");

  div.classList.add("book");
  div.dataset.id = idOfBook;
  div.innerHTML = `
    <p class='book_title'>"${bookObj.bookTitle}"</p>
    <p class='book_author'>${bookObj.bookAuthor}</p>
    <p class='book_pages'>${bookObj.bookPages}</p>
    <div class='btn_box'>
      <button type='button' class='btn ${bookObj.read ? "read" : "notread"}'>${
    bookObj.read ? "Read" : "Not read"
  }</button>
      <button type='button' class="btn remove">Remove</button>
    </div>
  `;

  containerForBooks.appendChild(div);
  const books = document.querySelectorAll(".book");
  books.forEach((book) => book.addEventListener("click", removeBookCard));
  books.forEach((book) => book.addEventListener("click", changeBookStatus));
}

function showInputStatus(value, type) {
  switch (type) {
    case "title":
      if (checkTitleAndAuthorValidation(value)) {
        modalInputs[0].classList.remove("invalid");
        modalInputs[0].classList.add("valid");
      } else {
        modalInputs[0].classList.remove("valid");
        modalInputs[0].classList.add("invalid");
      }
      break;
    case "author":
      if (checkTitleAndAuthorValidation(value)) {
        modalInputs[1].classList.remove("invalid");
        modalInputs[1].classList.add("valid");
      } else {
        modalInputs[1].classList.remove("valid");
        modalInputs[1].classList.add("invalid");
      }
      break;
    case "pages":
      if (checkNumbersOfPages(value)) {
        modalInputs[2].classList.remove("invalid");
        modalInputs[2].classList.add("valid");
      } else {
        modalInputs[2].classList.remove("valid");
        modalInputs[2].classList.add("invalid");
      }
      break;
    default:
      alert("Ups! Something went wrong!\n Please, Refresh page.");
  }
}

function checkTitleAndAuthorValidation(str) {
  const regex = /^[A-Za-z0-9\s\-_,.;:()]+$/;

  return regex.test(str) && str.length >= 5;
}

function checkNumbersOfPages(nums) {
  const regex = /[0-9]/;

  return regex.test(+nums) && +nums > 10;
}

function getInput() {
  this.removeEventListener("blur", getInput);
  this.addEventListener("input", getInput);

  showInputStatus(this.value, this.id);
}

function openModal() {
  modal.classList.add("active");
}

function closeModal(e) {
  if (e.target.classList.value === "modal active") {
    modal.classList.remove("active");
  }
}

addBookBtn.addEventListener("click", openModal);
window.addEventListener("click", closeModal);
modalInputs.forEach((inp) => inp.addEventListener("blur", getInput));
submitBtn.addEventListener("click", getValueAboutBook);
