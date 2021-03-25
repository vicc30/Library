'use strict';
/**
 * Firebase scripts
 * Firebase sign in with google
 */

// Sign-in 
function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            var credential = result.credential;
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            //Show user login info
            authStateObserver(user);
            // Hide sign-in button.
            signInButtonElement.setAttribute('hidden', 'true');
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            console.log(`Error code: ${errorCode}\n Message: ${errorMessage} \n Mail ${email} - Credential ${credential}`);
        })
}

// Sign-out
function signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut().then(() => {
        // Hide user's profile and sign-out button.
        userNameElement.setAttribute('hidden', 'true');
        userPicElement.setAttribute('hidden', 'true');
        signOutButtonElement.setAttribute('hidden', 'true');

        // Show sign-in button.
        signInButtonElement.removeAttribute('hidden');
    })
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
    if (user) { // User is signed in!
        // Get the signed-in user's profile pic and name.
        var profilePicUrl = getProfilePicUrl();
        var userName = getUserName();

        // Set the user's profile pic and name.
        userPicElement.style.backgroundImage = `url(${profilePicUrl})`;
        userNameElement.textContent = userName;

        // Show user's profile and sign-out button.
        userNameElement.removeAttribute('hidden');
        userPicElement.removeAttribute('hidden');
        signOutButtonElement.removeAttribute('hidden');

        // Hide sign-in button.
        signInButtonElement.setAttribute('hidden', 'true');

    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        userNameElement.setAttribute('hidden', 'true');
        userPicElement.setAttribute('hidden', 'true');
        signOutButtonElement.setAttribute('hidden', 'true');

        // Show sign-in button.
        signInButtonElement.removeAttribute('hidden');
    }
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

// Returns the signed-in user's profile pic URL.
function getProfilePicUrl() {
    return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
    return firebase.auth().currentUser.displayName;
}

// Shortcuts to DOM Elements.
var mediaCaptureElement = document.getElementById('mediaCapture');
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
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

function addToCollection(title, author, pages, read) {
    db.collection("library").doc().set({
        title: title,
        author: author,
        pages: pages,
        read: read,
        time: firebase.firestore.FieldValue.serverTimestamp(),
        addBy: getUserName(),
        userPhoto: getProfilePicUrl()
    })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

function addBookToLibrary() {
    //Shortcuts for Html elements
    var form = document.getElementById("myForm");
    var title = form.elements[0].value;
    var author = form.elements[1].value;
    var pages = form.elements[2].value;
    var readCheck = form.elements[3].checked;
    var newRead = readCheck === true ? newRead = "Read" : newRead = "Not read yet";

    //Added validation
    if (title === "") {
        title.setCustomValidity("Fill this with a title");
        title.reportValidity();
    } else if (author === "") {
        author.setCustomValidity("Put some author");
        author.reportValidity();
    } else if (pages === "") {
        pages.setCustomValidity("I think it have more than 0 pages");
        pages.reportValidity();
    } else {
        //If valid add to fireStore collection
        addToCollection(title,author,pages,newRead);
        renderItem();
    }
}

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

//Initialize UI
renderItem();

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//Initialize firebase
const db = firebase.firestore();
