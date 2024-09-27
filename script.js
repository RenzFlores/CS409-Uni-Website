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

var userArray = [];

var userObject = {
    name: "",
    birthdate: "",
    contactnum: "",
    lastschool: "",
    username: "",
    email: "",
    password: ""
}

loadUsers();

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

            if (tempUser !== null) {
                window.alert("Welcome " + (tempUser.name) + "!");
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
    userArray.push(newUser);
    saveUsers();
    console.log("User successfully added.");
}

function loadUsers() {
    userArray = [];
    let dataArray = localStorage.getItem("users");

    if (dataArray !== null) {
        dataArray = dataArray.split("||");
        for (let i = 0; i < dataArray.length-1; i++) {
            console.log(dataArray[i]);
            let parsedData = JSON.parse(dataArray[i]);

            userArray.push(parsedData);
        }
        console.log(userArray.length);
    }
}

function saveUsers() {
    let userString = "";

    for (let i = 0; i < userArray.length; i++) {
        userString = userString.concat(JSON.stringify(userArray[i]) + ("||"));
        console.log(userString);
    }

    localStorage.setItem("users", userString);
}

function authenticateLogin() {
    function matchRecords(user) {
        if (user.username.localeCompare(document.getElementById("username").value) === 0) {
            console.log("Username matched.");
        } else { 
            console.log("Username not found.");
            return false;
        }

        if (user.password.localeCompare(document.getElementById("password").value) === 0) {
            console.log("Password matched.");
        } else {
            console.log("Password not found.");
            return false;
        }

        return true;
    }

    for (var i = 0; i < userArray.length; i++) {
        if (matchRecords(userArray[i])) {
            console.log("User found");
            return userArray[i];
        }
    }
    console.log("User not found");
    return null;
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