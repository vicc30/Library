let myLibrary = [
    {
        id: 1,
        title: 'The Hobbit',
        author: 'J.R.R Tolkien',
        pages: '295 pages',
        read: 'Not read yet'
    },
    {
        id: 2,
        title: 'One Hundred Years of Solitude',
        author: 'Gabriel Garcia Marquez',
        pages: '471 pages',
        read: 'Read'
    }
];

function renderItem() {
    document.getElementById('mainElement').innerHTML = myLibrary.map((book) =>
        `
        <li class="list-group-item">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">${book.author}</p>
            <p class="card-text">${book.pages}</p>
            <p class="card-text">${book.read}</p>
        </li>
    `
    ).join('');
}


function addBookToLibrary() {
    var newTitle = document.getElementById("myForm").elements[0].value;
    var newAuthor = document.getElementById("myForm").elements[1].value;
    var newPages = document.getElementById("myForm").elements[2].value;
    var isRead = document.getElementById("myForm").elements[3].checked;
    var newRead = isRead===true ? newRead="Read" : newRead="Not read yet"; 
    const newBook = new Book(newTitle, newAuthor, newPages, newRead );
    newBook.id = myLibrary.length + 1;
    myLibrary.push(newBook);
    renderItem();
}

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.info = function () {
            return (title + ', ' + author + ', ' + pages + ', ' + read + '.');
        };
    }
}

renderItem();
