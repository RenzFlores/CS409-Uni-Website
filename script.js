// CONSTANTS
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

// Array containing user objects
var userArray = [];

// User object
var userObject = {
    name: "",
    birthdate: "",
    contactnum: "",
    lastschool: "",
    username: "",
    email: "",
    password: ""
}

// Users from localStorage is retrieved every time a page loads
loadUsers();

// Event handler for registration form
try {
    regform.addEventListener('submit', e => {
        e.preventDefault();
    
        // Validate inputs and add user
        if (validateRegistration()) {
            addUser();
            window.alert("User successfully registered!");
        }
    });
}
catch(err) {
    ;
}

// Event handler for login form
try {
    loginform.addEventListener('submit', e => {
        e.preventDefault();

        // Validate inputs and authenticate login attempt
        if (validateLogin()) {
            let user = authenticateLogin();

            if (user !== null) {
                window.alert("Welcome " + (user.name) + "!");
            } else {
                window.alert("Incorrect username or password.");
            }
        }
    });
}
catch(err) {
    ;
}

// Add user based on the current values in the registration form. Assumes all inputs are valid
// so form must be validated first before calling addUser()
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

    userArray.push(newUser);    // Add user to list of registered users
    saveUsers();                // Save all data to localStorage
}

// Load all users from localStorage. Data is parsed into objects and stored in userArray
function loadUsers() {
    userArray = [];
    let dataString = localStorage.getItem("users");

    // Check if "users" key exists
    if (dataString !== null) {
        // Split the string by delimiter and store inside array
        let dataArray = dataString.split("||");

        // Parse all strings into objects and add to userArray
        for (let i = 0; i < dataArray.length-1 /* Last index is an empty string */ ; i++) {
            let parsedData = JSON.parse(dataArray[i]);

            userArray.push(parsedData);
        }
    }
}

// Save all user data from userArray to localStorage. All objects are serialized into JSON and stored as
// one very long concatenated string inside the "users" key
function saveUsers() {
    let userString = "";

    for (let i = 0; i < userArray.length; i++) {
        userString = userString.concat(JSON.stringify(userArray[i]) + ("||")); /* Delimiter is || */
    }

    localStorage.setItem("users", userString);
}

// Authenticate login attempt by checking for all matching records from existing users. Returns an object if
// a user is found or null if not
function authenticateLogin() {
    // Compare if inputted username AND password match a given user's info
    function matchRecords(user) {
        if (user.username.localeCompare(document.getElementById("username").value) !== 0) {
            return false;
        }

        if (user.password.localeCompare(document.getElementById("password").value) !== 0) {
            return false;
        }

        return true;
    }

    // Check for matching records on every registered user
    // If found, return the user object
    // If not, return null
    for (var i = 0; i < userArray.length; i++) {
        if (matchRecords(userArray[i])) {
            return userArray[i];
        }
    }

    return null;
}

// Validate all inputs from the registration form and set for errors accordingly
function validateRegistration() {
	// Trim to remove the whitespaces
    const nameValue = name.value.trim();
    const birthdateValue = birthdate.value.trim();
    const contactnumValue = contactnum.value.trim();
    const lastschoolValue = lastschool.value.trim();
	const usernameValue = username.value.trim();
	const emailValue = email.value.trim();
	const passwordValue = password.value.trim();
	const password2Value = password2.value.trim();
    
    var isValid = true;     // Flag indicating whether a form is valid or not
	
    /*
     *   If input is invalid, set form to display an error and set isValid to false
     *   If input is valid, revert form to normal look
     */
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
	} 
    // Check if username is unique
    else if (usernameValue !== '') {
        for (let i = 0; i < userArray.length; i++) {
            if (usernameValue.localeCompare(userArray[i].username) === 0) {
                setErrorFor(username, "Username is already taken");
                isValid = false;
                break;
            }
        }
    } else {
        revertForm(username);
    }
	
	if(emailValue === '') {
		setErrorFor(email, 'Required');
        isValid = false;
	} 
    else if (!isEmail(emailValue)) {
		setErrorFor(email, 'Not a valid email');
        isValid = false;
    } 
    // Check if email is unique
    else if (isEmail(emailValue)) {
        for (let i = 0; i < userArray.length; i++) {
            if (emailValue.localeCompare(userArray[i].email) === 0) {
                setErrorFor(email, "Email is already taken");
                isValid = false;
                break;
            }
        }
    } else {
        revertForm(email);
    }
	
	if(passwordValue === '') {
		setErrorFor(password, 'Required');
        isValid = false;
    } else if (passwordValue !== '') {
        let status = isValidPass(passwordValue);

        switch (status) {
            case 1:
                setErrorFor(password, 'Password must  be minimum of 8 characters');
                isValid = false;
                break;
            case 2:
                setErrorFor(password, 'Password must contain at least one uppercase letter');
                isValid = false;
                break;
            case 3:
                setErrorFor(password, 'Password must contain at least one lowercase letter');
                isValid = false;
                break;
            case 4:
                setErrorFor(password, 'Password must contain at least one number');
                isValid = false;
                break;
            case 5:
                revertForm(password);
        }
    }
	
	if(password2Value === '') {
		setErrorFor(password2, 'Required');
        isValid = false;
	} else if(passwordValue !== password2Value) {
		setErrorFor(password2, 'Password does not match');
        isValid = false;
	} else {
        revertForm(password2);
    }

    // Check if all inputs passed the validation and return the corresponding truth value
    if (isValid) {
        return true;
    } else {
        return false;
    }
}

// Validate all inputs from the login form and set for errors accordingly
function validateLogin() {
    const usernameValue = username.value.trim();
	const passwordValue = password.value.trim();

    let isValid = true;

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

// Set input to display error message
function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = message;
}

// Remove error message and revert form
function revertForm(input) {
	const formControl = input.parentElement;
	const small = formControl.querySelector("small");
	formControl.className = "form-control";
	small.innerText = "";
}

// Email validation using regex
function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

// Password validation using regex. Returns an integer indicating error status
// 1 = Less than 8 characters
// 2 = No uppercase letter
// 3 = No lowercase letter
// 4 = No number
// 5 = Valid
function isValidPass(password) {
    // Minimum 8 characters
    if (!/^[A-Za-z\d$&+,:;=?@#|'<>.^*()%!-]{8,}$/.test(password)) {
        return 1;
    } 
    // At least one uppercase letter
    else if (!/^(?=.*?[A-Z])/.test(password)) {
        return 2;
    } 
    // At least one lowercase letter
    else if (!/^(?=.*?[a-z])/.test(password)) {
        return 3;
    }
    // At least one number
    else if (!/^(?=.*?[0-9])/.test(password)) {
        return 4;
    }
    // All criterias met
    else {
        return 5;
    }
}