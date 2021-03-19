'use strict';
/**
 * Firebase scripts
 * Firebase sign in with google
 */

// Sign-in 
function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}

// Sign-out
function signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut();
}

// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAIVbD-5rZQ7dqwM5wsP0sVGmFeHRazlGw",
    authDomain: "library-db7b3.firebaseapp.com",
    projectId: "library-db7b3",
    storageBucket: "library-db7b3.appspot.com",
    messagingSenderId: "274780063093",
    appId: "1:274780063093:web:5485cb2f84aa2f2bc83f3c"
};

// Shortcuts to DOM Elements.
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');

// Saves message on form submit.
signOutButtonElement.addEventListener('click', signOut);
signInButtonElement.addEventListener('click', signIn);

/**
* ** Library Scripts. **
* Book Constructor
* Onclick events
* Form validation
*/

// Example books
let myLibrary = [
    {
        title: 'The Hobbit',
        author: 'J.R.R Tolkien',
        pages: '295 pages',
        read: 'Not read yet'
    },
    {
        title: 'One Hundred Years of Solitude',
        author: 'Gabriel Garcia Marquez',
        pages: '471 pages',
        read: 'Read'
    }
];

function renderItem() {
    document.getElementById('mainElement').innerHTML = myLibrary.map((book, idx) =>
        `
        <li class="list-group-item" id=Book${idx}>
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">${book.author}</p>
            <p class="card-text">${book.pages}</p>
            <button type="button" class="btn btn-primary ${book.read}" value=${idx} onclick=${`toggleRead(this.value)`}>${book.read}</button>
            <button type="button" class="btn btn-danger" value=${idx} onclick=${`removeBook(this.value)`}>Delete</button>
        </li>
    `
    ).join('');
}

function resetForm() {
    document.getElementById("myForm").reset();
}

function toggleRead(bookId) {
    myLibrary[bookId].read === 'Read' ? myLibrary[bookId].read = 'Not read yet' : myLibrary[bookId].read = 'Read';
    renderItem();
}

function removeBook(bookId) {
    console.log(bookId);
    myLibrary.splice(bookId, 1);
    console.log(myLibrary);
    renderItem();
}

function addBookToLibrary() {
    //Get form
    var form = document.getElementById("myForm");

    //Get elements from form
    var title = form.elements[0];
    var author = form.elements[1];
    var pages = form.elements[2];
    var readCheck = form.elements[3];

    //Get each value
    var newTitle = title.value;
    var newAuthor = author.value;
    var newPages = pages.value;
    var isRead = readCheck.checked;
    var newRead = isRead === true ? newRead = "Read" : newRead = "Not read yet";

    //Added validation
    if (newTitle === "") {
        title.setCustomValidity("Fill this with a title");
        title.reportValidity();
    } else if (newAuthor === "") {
        author.setCustomValidity("Put some author");
        author.reportValidity();
    } else if (newPages === "") {
        pages.setCustomValidity("I think it have more than 0 pages");
        pages.reportValidity();
    } else {
        const newBook = new Book(newTitle, newAuthor, newPages, newRead);
        myLibrary.push(newBook);
        renderItem();
    }
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

//Initialize UI
renderItem();

// Initialize Firebase
firebase.initializeApp(firebaseConfig);