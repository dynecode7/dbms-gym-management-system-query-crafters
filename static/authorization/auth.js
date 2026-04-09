
// SHOW MEMBER LOGIN BY DEFAULT WHEN ROUTED TO '/'
document.addEventListener("DOMContentLoaded", function () {
  hideAll();
  document.getElementById("login").classList.remove("hidden");
  
});


//FUNCTION TO SHOW AND HIDE LOGIN/SIGNUP OF MEMBER/TRAINER
function hideAll() {
  document.getElementById("signup").classList.add("hidden");
  document.getElementById("login").classList.add("hidden");
  document.getElementById("signUpTrainer").classList.add("hidden");
  document.getElementById("loginTrainer").classList.add("hidden");
  
}

function showLogin() {
  hideAll();
  document.getElementById("login").classList.remove("hidden");
  document.querySelector("body").classList.remove('TrainerBody');
}

function showSignup() {
  hideAll();
  document.getElementById("signup").classList.remove("hidden");
  document.querySelector("body").classList.remove('TrainerBody');
}

function showTrainerLogin() {
  hideAll();
  document.getElementById("loginTrainer").classList.remove("hidden");
  document.querySelector("body").classList.add('TrainerBody');
}

function showTrainerSignup() {
  hideAll();
  document.getElementById("signUpTrainer").classList.remove("hidden");
  document.querySelector("body").classList.add('TrainerBody');
}



// MEMBER SIGUP AND LOGIN

function signup() {
  const data = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    phone: document.getElementById("phone").value,
    password: document.getElementById("password").value
  };

  fetch("http://127.0.0.1:5000/signup", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (res.redirected) {
      window.location.href = res.url; // go to dashboard
    }
  });
}

function login() {
  const data = {
    phone: document.getElementById("login_phone").value,
    password: document.getElementById("login_password").value
  };

  fetch('http://127.0.0.1:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (res.redirected) {
      window.location.href = res.url;
      console.log(res.url);
    } else {
      alert("Invalid credentials");
    }
  });
}


// TRAINER SIGUP AND LOGIN

function Trainersignup() {
  const data = {
    name: document.getElementById("trainer_name").value,
    spec: document.getElementById("trainer_spec").value,
    phone: document.getElementById("trainer_phone").value,
    password: document.getElementById("trainer_password").value
  };

  fetch("http://127.0.0.1:5000/trainer/signup", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (res.redirected) {
      alert("ACCOUNT CREATED SUCCESFULLY!");
      window.location.href = res.url; 
    }
  });
}

function Trainerlogin() {
  const data = {
    phone: document.getElementById("trainer_login_phone").value,
    password: document.getElementById("trainer_login_password").value
  };
  
  fetch('http://127.0.0.1:5000/trainer/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (res.redirected) {
      window.location.href = res.url;
      console.log(res.url);
    } else {
      alert("Invalid credentials");
    }
  });
}

