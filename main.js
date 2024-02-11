let books = [], updateId, isUpdate;
const RENDER_EVENT = "bookChanged";

window.addEventListener("load", () => {
    books = JSON.parse(localStorage.getItem("books")) || [];
    listBook(books);

    const buttonInputBook = document.querySelector("#inputBook");
    buttonInputBook.addEventListener("submit", saveBook);

    const buttonSearchBook = document.querySelector("#searchBook");
    buttonSearchBook.addEventListener("submit", findBook);

    const buttonSearchClear = document.createElement("button");
    buttonSearchBook.appendChild(buttonSearchClear);
    buttonSearchClear.innerText = "Reset";
    buttonSearchClear.classList.add("green");
    buttonSearchClear.addEventListener("click", () => { searchBookTitle.value = "", findBook; });

    document.addEventListener(RENDER_EVENT, saveLocalStorage);
});

function listBook(items) {
    const incompleteBookshelfList = document.querySelector("#incompleteBookshelfList");
    const completeBookshelfList = document.querySelector("#completeBookshelfList");
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";
    for (const item of items) {
        const article = document.createElement("article");
        article.classList.add("book_item");
        const title = document.createElement("h3");
        title.innerText = item.title;
        const author = document.createElement("p");
        author.innerText = "Penulis: " + item.author;
        const year = document.createElement("p");
        if (
            (
                (year.innerText = "Tahun: " + item.year),
                article.appendChild(title),
                article.appendChild(author),
                article.appendChild(year),
                item.isComplete
            )
        ) {
            const divActionCompleteBookshelfList = document.createElement("div");
            divActionCompleteBookshelfList.classList.add("action");
            const buttonUnreadedBook = document.createElement("button");
            buttonUnreadedBook.id = item.id;
            buttonUnreadedBook.innerText = "Belum Selesai dibaca";
            buttonUnreadedBook.classList.add("green");
            buttonUnreadedBook.addEventListener("click", unreadedBook);

            const buttonDeleteBookCompleteBookshelfList = document.createElement("button");
            buttonDeleteBookCompleteBookshelfList.id = item.id;
            buttonDeleteBookCompleteBookshelfList.innerText = "Hapus buku";
            buttonDeleteBookCompleteBookshelfList.classList.add("red");
            buttonDeleteBookCompleteBookshelfList.addEventListener("click", (e) => {
                isDelete = confirm("Apakah anda yakin ingin menghapus ini ?");
                if (isDelete == true) {
                    deleteBook(e);
                }
            });
            
            const buttonEditBookCompleteBookshelfList = document.createElement("button");
            buttonEditBookCompleteBookshelfList.id = item.id;
            buttonEditBookCompleteBookshelfList.innerText = "Edit buku";
            buttonEditBookCompleteBookshelfList.classList.add("warning");
            buttonEditBookCompleteBookshelfList.addEventListener("click", editBook);

            divActionCompleteBookshelfList.appendChild(buttonUnreadedBook);
            divActionCompleteBookshelfList.appendChild(buttonDeleteBookCompleteBookshelfList);
            divActionCompleteBookshelfList.appendChild(buttonEditBookCompleteBookshelfList);
            article.appendChild(divActionCompleteBookshelfList);
            completeBookshelfList.appendChild(article);
        } else {
            const divActionIncompleteBookshelfList = document.createElement("div");
            divActionIncompleteBookshelfList.classList.add("action");
            const buttonReadedBook = document.createElement("button");
            buttonReadedBook.id = item.id;
            buttonReadedBook.innerText = "Selesai dibaca";
            buttonReadedBook.classList.add("green");
            buttonReadedBook.addEventListener("click", readedBook);

            const buttonDeleteBookIncompleteBookshelfList = document.createElement("button");
            buttonDeleteBookIncompleteBookshelfList.id = item.id;
            buttonDeleteBookIncompleteBookshelfList.innerText = "Hapus buku";
            buttonDeleteBookIncompleteBookshelfList.classList.add("red");
            buttonDeleteBookIncompleteBookshelfList.addEventListener("click", (e) => {
                isDelete = confirm("Apakah anda yakin ingin menghapus ini ?");
                if (isDelete == true) { 
                    deleteBook(e); 
                }
            });

            const buttonEditBookIncompleteBookshelfList = document.createElement("button");
            buttonEditBookIncompleteBookshelfList.id = item.id;
            buttonEditBookIncompleteBookshelfList.innerText = "Edit buku";
            buttonEditBookIncompleteBookshelfList.classList.add("warning");
            buttonEditBookIncompleteBookshelfList.addEventListener("click", editBook);

            divActionIncompleteBookshelfList.appendChild(buttonReadedBook);
            divActionIncompleteBookshelfList.appendChild(buttonDeleteBookIncompleteBookshelfList);
            divActionIncompleteBookshelfList.appendChild(buttonEditBookIncompleteBookshelfList);
            article.appendChild(divActionIncompleteBookshelfList);
            incompleteBookshelfList.appendChild(article);
        }
    }
}
function readedBook(e) {
    const id = Number(e.target.id);
    const bookId = books.findIndex((fi) => fi.id === id);
    bookId !== -1 && ((books[bookId] = { ...books[bookId], isComplete: !0 }), document.dispatchEvent(new Event(RENDER_EVENT)));
    alert("Data telah berhasil dipindahkan dalam rak selesai dibaca.");
}
function unreadedBook(e) {
    const id = Number(e.target.id);
    const bookId = books.findIndex((fi) => fi.id === id);
    bookId !== -1 && ((books[bookId] = { ...books[bookId], isComplete: !1 }), document.dispatchEvent(new Event(RENDER_EVENT)));
    alert("Data telah berhasil dipindahkan dalam rak belum selesai dibaca.");
}
function findBook(fb) {
    fb.preventDefault();
    const searchBookTitle = document.querySelector("#searchBookTitle");
    query = searchBookTitle.value;
    query
        ? listBook(
            books.filter((e) => e.title.toLowerCase().includes(query.toLowerCase()))
        )
        : listBook(books);
}
function editBook(eb) {
    const id = Number(eb.target.id);
    const bookId = books.findIndex((e) => e.id === id);

    const caption = document.querySelector(".input_section h2");
    const title = document.querySelector("#inputBookTitle");
    const author = document.querySelector("#inputBookAuthor");
    const year = document.querySelector("#inputBookYear");
    const isComplete = document.querySelector("#inputBookIsComplete");

    caption.innerText = "Perbarui Daftar Buku";
    title.value = books[bookId].title;
    author.value = books[bookId].author;
    year.value = books[bookId].year;
    isComplete.checked = books[bookId].isComplete;
    title.focus();

    updateId = books[bookId].id;
    isUpdate = true;
}
function saveBook(sb) {
    sb.preventDefault();
    const title = document.querySelector("#inputBookTitle");
    const author = document.querySelector("#inputBookAuthor");
    const year = document.querySelector("#inputBookYear");
    const isComplete = document.querySelector("#inputBookIsComplete");

    const validYear = /^\d{4}$/;
    if (!validYear.test(year.value)) {
        alert("Tahun harus 4 digit berupa angka positif.");
        return;
    }

    if (isUpdate) {
        const bookId = books.findIndex((e) => e.id === updateId);
        bookId !== -1 && (books.splice(bookId, 1), document.dispatchEvent(new Event(RENDER_EVENT)));
        books.push({
            id: updateId,
            title: title.value,
            author: author.value,
            year: Number(year.value),
            isComplete: isComplete.checked
        });
        isUpdate = false;
    } else {
        books.push({
            id: +new Date(),
            title: title.value,
            author: author.value,
            year: Number(year.value),
            isComplete: isComplete.checked
        });
    }
    document.dispatchEvent(new Event(RENDER_EVENT));

    isComplete.checked
        ? alert("Data telah berhasil disimpan dalam rak selesai dibaca.")
        : alert("Data telah berhasil disimpan dalam rak belum selesai dibaca.");

    title.value = "";
    author.value = "";
    year.value = "";
    isComplete.checked = false;
}
function deleteBook(db) {
    const id = Number(db.target.id);
    const bookId = books.findIndex((e) => e.id === id);
    bookId !== -1 && (books.splice(bookId, 1), document.dispatchEvent(new Event(RENDER_EVENT)));

}
function saveLocalStorage() {
    !((e) => {
        localStorage.setItem("books", JSON.stringify(e));
    })(books),
        listBook(books);
}