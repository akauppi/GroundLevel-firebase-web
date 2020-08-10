/*
* fns-test/docs.js
*
* Initial data used for the functions test cases
*/
const anyPastDate = new Date();

/*
* Modeled as:
*   [<document path>]: { <document field>: <value> }
*
* This means sub-collections are shown at the same level (flat hierarchy) as their logical parent; the path indicates
* the parenthood (this is quite suiting Firestore's view).
*
* WARNING: Do NOT use 'Date.now()' or 'Date.parse()' - they return a number instead of a 'Date' instance!
*/
const docs = {
  // Project 1 - active project
  "/projects/1": {
    // no 'removed'
    authors: ["abc"],
    members: ["abc","def"]
  },
  //"/projects/1/userInfo/{uid}": initially empty

  /*** not implemented
  // Invites (just one)
  "/invites/a@b.com:1": {
    email: "a@b.com",
    project: "1",
    asAuthor: false,
    by: "abc",
    at: new Date('07 Apr 2020 15:12:00 GMT')
  }
  ***/

  // UserInfo (initially empty)
  //"/userInfo/abc": {
  //  name: "...",
  //  photoURL: "..."
  //}
};

export { docs };
