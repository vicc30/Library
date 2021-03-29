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
        }).then(() => {
            var onLogginButtonsElements = document.querySelectorAll('.active-login');
            onLogginButtonsElements.forEach((button) => {
                button.removeAttribute('disabled');
            })
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
        var onLogginButtonsElements = document.querySelectorAll('.active-login');
        onLogginButtonsElements.forEach((button) => {
            button.setAttribute('disabled', 'true');
        })
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
 * Firestore
 */

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var myLib = db.collection('library');

//Get data to display library
myLib.orderBy("time", "desc").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        renderItem(doc.id, doc.data())
    });
});

/**
* ** Library Scripts. **
* Book Constructor
* Onclick events
* Form validation
*/

function renderItem(idx, book) {
    const isRead = book.read === true ? "Read" : "Not Read";
    document.getElementById('mainElement').innerHTML +=
        `
        <li class="list-group-item" id=${idx}>
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">${book.author}</p>
            <p class="card-text">${book.pages} pages</p>
            <button type="button" class="btn btn-primary active-login" value=${idx} onclick=${`toggleRead(this.value,${book.read})`} disabled>${isRead}</button>
            <button type="button" class="btn btn-danger active-login" value=${idx} onclick=${`removeBook(this.value)`} disabled>Delete</button>
        </li>
    `
}

function resetForm() {
    document.getElementById("myForm").reset();
}

function toggleRead(bookId, read) {
    myLib.doc(bookId).update({
        read: !read
    }).then(() => {
        console.log("Document successfully updated!");
    }).catch((error) => {
        console.error("Error updating document: ", error);
    })
}

function removeBook(bookId) {
    myLib.doc(`${bookId}`).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

function addToCollection(title, author, pages, read) {
    myLib.doc().set({
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
        .then(() => {
            resetForm();
            $('#myModal').modal('toggle');
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

function addBookToLibrary() {

    //Shortcuts for Html elements
    var form = document.getElementById("myForm");
    var titleInput = form.elements[0];
    var title = titleInput.value;
    var authorInput = form.elements[1];
    var author = authorInput.value;
    var pagesInput = form.elements[2];
    var pages = pagesInput.value;
    var readCheck = form.elements[3].checked;

    //Added validation
    if (title === "") {
        titleInput.setCustomValidity("Fill this with a title");
        titleInput.reportValidity();
    } else if (author === "") {
        authorInput.setCustomValidity("Put some author");
        authorInput.reportValidity();
    } else if (pages === "") {
        pagesInput.setCustomValidity("I think it have more than 0 pages");
        pagesInput.reportValidity();
    } else {
        //If valid add to fireStore collection
        addToCollection(title, author, pages, readCheck);
    }
}
