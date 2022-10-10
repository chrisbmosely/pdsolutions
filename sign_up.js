let checkboxAccept = document.getElementById('checkbox-accept-terms');
let signupButtonEmail = document.getElementById('signupButtonEmail');
let signupButtonGoogle = document.getElementById('signupButtonGoogle');
let singupEmail = document.getElementById('signupEmail');
let signupPassword = document.getElementById('signupPassword');
let singupError = document.getElementsByClassName('error-message')[0];
let signupSuccess = document.getElementsByClassName('success-message')[0];

console.log("IT'S WORKING");

function clear_error() {
    singupError.style.display = "none";
}

function error_output(errorMessage) {
    singupError.innerText = errorMessage;
    singupError.style.display = "block";
}

function signup_success() {
    signupSuccess.style.display = "block";
    window.location.replace('../user-dashboard-home');
}

function signup_email() {
    clear_error();

    var email = singupEmail.value;
    var password = signupPassword.value;
    if (!checkboxAccept.checked) {
        error_output("Please tick the box to accept terms and conditions");
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            singupError.style.display = "none";
            var user = userCredential.user;
            signup_success()
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error code: " + errorCode);
            console.log("Error message: " + errorMessage);
            error_output(errorMessage)
        });
}

function signup_google() {
    clear_error();

    if (!checkboxAccept.checked) {
        error_output("Please tick the box to accept terms and conditions");
        return;
    }

    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            signup_success()
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            console.log("error code: " + error.code);
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            switch (error.code) {
                case "auth/popup-closed-by-user":
                    errorMessage="Google account login was not completed";
                    break;
                default:
            }

            var credential = error.credential;
            error_output(errorMessage)
        });
}

signupButtonEmail.addEventListener('click', signup_email);
signupButtonGoogle.addEventListener('click', signup_google);
checkboxAccept.addEventListener('click', clear_error);
singupEmail.addEventListener('click', clear_error);
signupPassword.addEventListener('click', clear_error);

