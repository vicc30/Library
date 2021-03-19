# Library

This is part of an excercise for the [Odin Project](https://www.theodinproject.com/) Javascript Pathway.

This is my solution for the assignment to implement a Library option to Add books to a card item with DOM manipulation.

## Assignment

* [x] Set up your project with skeleton HTML/CSS and JS files.
    * HTML file is under name `index.html`
    * JS file is under name `scripts.js`
* [x] All of your book objects are going to be stored in a simple array, so add a function to the script (not the constructor) that can take user's input and store the new book objects into an array.
    * Stored in `myLibrary` array. 
    * UPDATE: Array will be pushed to Cloud Firestore Database.
* [x] Write a function that loops through the array and displays each book on the page.
    * Function `renderItem` displays each book
* [x] Add a "NEW BOOK" button that brings up a form allowing users to input the details for the new book: author, title, number of pages, whether it's been read and anything else you might want.
    * Added in HTML body
* [x] Add a button on each book’s display to remove the book from the library.
    * Added on each book display
* [x] Add a button on each book’s display to change its read status.
    * Added on each book display.
* [x] UPDATE: JS Lesson Forms. Add simple validation to that form!
    * Basic validation is provided.
* [ ] UPDATE: Added Firebase functionalities.
  * [ ] Sign-in methods. Added a button for sign-in with google / facebook / github
  * [ ] Cloud Firestore. Save changes on library when form is submited and logged-in.
  * [ ] Update UI

## Technologies.

* Vanilla JavaScript
* HTML
* CSS
* Bootstrap

### Commands.

In order to test on local machine functionalities run `firebase serve --only hosting`

#### Made by Victor Cruz
