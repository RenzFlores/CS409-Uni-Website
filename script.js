/*

POSSIBLE SOLUTION:
Local Storage and JSON.stringify

- All user data is stored inside local storage as one very long concatenated string
- Each time a page is loaded, all data is retrieved from local storage and parsed into objects
- Each time a new user registers, local storage is updated by encoding all objects into json strings and the page is reloaded

*/

const loginform = document.getElementById('loginform');
const regform = document.getElementById('regform');
const name = document.getElementById('name');
const birthdate = document.getElementById('birthdate');
const contactnum = document.getElementById('contactnum');
const lastschool = document.getElementById('lastschool');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

let db;
const request = indexedDB.open("UserDatabase", 1);

let transaction = db.transaction(["Users"], "readonly"); 
let users = transaction.objectStore("Users");
let request = users.getAll();
let isUserFound = false;
let userID = 0;

var currentUser = null;

request.onupgradeneeded = function(event) {
    db = event.target.result;
    // Create an object store for this database if it doesn't already exist
    const objectStore = db.createObjectStore("Users", { keyPath: "id", autoIncrement: true});
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database opened successfully");
};

request.onerror = function(event) {
    console.error("Database error: ", event.target.errorCode);
};

var userObject = {
    name: "",
    birthdate: "",
    contactnum: "",
    lastschool: "",
    username: "",
    email: "",
    password: ""
}

try {
    regform.addEventListener('submit', e => {
        e.preventDefault();
    
        if (checkRegInputs()) {
            addUser();
        }
    });
}
catch(err) {
    ;
}

try {
    loginform.addEventListener('submit', e => {
        e.preventDefault();

        if (checkLoginInputs()) {
            tempUser = authenticateLogin();

            if (tempUser !== undefined) {
                window.alert("Welcome " + (tempUser.name) + "!");
                currentUser = tempUser;
            } else {
                window.alert("Incorrect username or password.");
            }
        }
    });
}
catch(err) {
    ;
}

function addUser() {
    const newUser = {
        name: "",
        birthdate: "",
        contactnum: "",
        lastschool: "",
        username: "",
        email: "",
        password: ""
    };

    newUser.name = name.value.trim();
    newUser.birthdate = birthdate.value.trim();
    newUser.contactnum = contactnum.value.trim();
    newUser.lastschool = lastschool.value.trim();
    newUser.username = username.value.trim();
    newUser.email = email.value.trim();
    newUser.password = password.value.trim();
    saveUser(newUser);
    console.log("User successfully added.");
}

function saveUser(userObject) {
    const transaction = db.transaction(["Users"], "readwrite");
    const objectStore = transaction.objectStore("Users");

    /*
    try {
        const request = objectStore.put(userObject);
    } catch(DataError) {
        const request = objectStore.put({name: "test", password: "testpass", id: 1});
    }
    */

    const request = objectStore.put(userObject);

    request.onsuccess = function() {
        console.log("Object saved successfully");
    };

    request.onerror = function() {
        console.error("Error saving object");
    };
}

async function authenticateLogin() {
    function matchRecords(user) {
        if (user.username.localeCompare(document.getElementById("username").value) === 0) {
            //console.log("Username matched.");
        } else { 
            //console.log("Username not found.");
            return false;
        }

        if (user.password.localeCompare(document.getElementById("password").value) === 0) {
            //console.log("Password matched.");
        } else { 
            //console.log("Password not found.");
            return false;
        }

        return true;
    }

    request.onsuccess = function() {
        if (request.result !== undefined) { 
            for (var i = 0; i < request.result.length; i++) {
                if (matchRecords(request.result[i])) {
                    console.log("User found");
                    userID = i;
                }
            }
            console.log("User not found");
        } else { 
            console.log("User database is empty.");
        }
    };

    /*
    if (isUserFound) {    
        return request.result[i];
    } else {
        return null;
    }
    */
}

function checkRegInputs() {
	// trim to remove the whitespaces
    const nameValue = name.value.trim();
    const birthdateValue = birthdate.value.trim();
    const contactnumValue = contactnum.value.trim();
    const lastschoolValue = lastschool.value.trim();
	const usernameValue = username.value.trim();
	const emailValue = email.value.trim();
	const passwordValue = password.value.trim();
	const password2Value = password2.value.trim();
    var isValid = true;
	
    if(nameValue === '') {
		setErrorFor(name, 'Required');
        isValid = false;
	} else {
        revertForm(name);
    }

    if(birthdateValue === '') {
		setErrorFor(birthdate, 'Required');
        isValid = false;
	} else {
        revertForm(birthdate);
    }

	if(contactnumValue === '') {
		setErrorFor(contactnum, 'Required');
        isValid = false;
	} else {
        revertForm(contactnum);
    }

    if(lastschoolValue === '') {
		setErrorFor(lastschool, 'Required');
        isValid = false;
	} else {
        revertForm(lastschool);
    }

    if(usernameValue === '') {
		setErrorFor(username, 'Required');
        isValid = false;
	} else {
        revertForm(username);
    }
	
	if(emailValue === '') {
		setErrorFor(email, 'Required');
        isValid = false;
	} else if (!isEmail(emailValue)) {
		setErrorFor(email, 'Not a valid email');
        isValid = false;
    } else {
        revertForm(email);
    }
	
	if(passwordValue === '') {
		setErrorFor(password, 'Required');
        isValid = false;
	} else {
        revertForm(password);
    }
	
	if(password2Value === '') {
		setErrorFor(password2, 'Required');
        isValid = false;
	} else if(passwordValue !== password2Value) {
		setErrorFor(password2, 'Passwords does not match');
        isValid = false;
	} else {
        revertForm(password2);
    }

    if (isValid) {
        return true;
    } else {
        return false;
    }
}

function checkLoginInputs() {
    const usernameValue = username.value.trim();
	const passwordValue = password.value.trim();

    let isValid = true;

    // TODO: Check for matching existing records.
    if(usernameValue === '') {
		setErrorFor(username, 'Username cannot be blank');
        isValid = false;
	} else {
        revertForm(username);
    }

    if(passwordValue === '') {
		setErrorFor(password, 'Password cannot be blank');
        isValid = false;
	} else {
        revertForm(password);
    }

    if (isValid) {
        return true;
    } else {
        return false;
    }
}

function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = message;
}

function revertForm(input) {
	const formControl = input.parentElement;
	const small = formControl.querySelector("small");
	formControl.className = "form-control";
	small.innerText = "";
}
	
function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}