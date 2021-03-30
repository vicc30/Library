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
            removeDisabled();
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

//function to remove disable when login
function removeDisabled() {
    var onLogginButtonsElements = document.querySelectorAll('.active-login');
    onLogginButtonsElements.forEach((button) => {
        button.removeAttribute('disabled');
    });
}

function disableButtons() {
    var onLogginButtonsElements = document.querySelectorAll('.active-login');
    onLogginButtonsElements.forEach((button) => {
        button.setAttribute('disabled', 'true');
    });
}

// function that hide elements on logout
function hideUser() {
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute('hidden', 'true');
    userPicElement.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');
    // Show sign-in button.
    signInButtonElement.removeAttribute('hidden');
}

// function that shows user
function showUser() {
    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    userPicElement.removeAttribute('hidden');
    signOutButtonElement.removeAttribute('hidden');
    // Hide sign-in button.
    signInButtonElement.setAttribute('hidden', 'true');
}

// Sign-out
function signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut().then(() => {
        hideUser();
        disableButtons();
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
        showUser();

    } else { // User is signed out!
        hideUser();
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
const mediaCaptureElement = document.getElementById('mediaCapture');
const userPicElement = document.getElementById('user-pic');
const userNameElement = document.getElementById('user-name');
const signInButtonElement = document.getElementById('sign-in');
const signOutButtonElement = document.getElementById('sign-out');
const form = document.getElementById("myForm");

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

//Start listening for real time data
myLib.orderBy("time", "desc").onSnapshot(function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
        var id = change.doc.id;
        var book = document.getElementById(id);
        var edited = change.doc.data();
        if (change.type === 'removed') {
            document.getElementById(id).remove();
        } else if (change.type === 'modified') {
            if (book != null) book.remove();
            renderItem(id, edited);
            removeDisabled();
        }
    });
});

/**
* ** Library Scripts. **
* Book Constructor
* Onclick events
* Form validation
*/

function renderItem(idx, book) {
    const { title, author, pages, addBy, userPhoto, read } = book;
    const isRead = book.read === true ? `<i class="fas fa-check-double"></i> Read` : `<i class="fas fa-times"></i> Not Read`;
    document.getElementById('mainElement').innerHTML +=
        `
        <li class="list-group-item" id=${idx}>
            <h5 class="card-title">Title: ${title}</></h5>
            <p class="card-text">Author(s): ${author}</p>
            <p class="card-text">Pages: ${pages}</p>
            <div class="row row-content ml-1 added">
                <p>Added by:</p>
                <img class="addBy"src="${userPhoto}" alt="${addBy}"/>
                <p>${addBy}</p>
            </div>
            <button type="button" class="btn btn-primary active-login" value=${idx} onclick=${`toggleRead(this.value,${read})`} disabled>${isRead}</button>
            <button type="button" class="btn btn-danger active-login" value=${idx} onclick=${`removeBook(this.value)`} disabled><i class="fas fa-trash-alt"></i></button>
        </li>
    `
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
            resetForm();
            $('#myModal').modal('toggle');
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

function addBookToLibrary() {
    //Shortcuts for Html elements
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

// Function to reset form
function resetForm() {
    form.reset();
}
