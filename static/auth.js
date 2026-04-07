function showLogin() {
  document.getElementById("signup").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
}

function showSignup() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("signup").classList.remove("hidden");
}


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

