function showTab(id) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function toggle(id) {
  document.getElementById(id).classList.toggle("hidden");

  if (id == "exerciseList") {
    const memberId = window.location.pathname.split("/").pop();

    const rawDate = new Date();
    const todayDate = rawDate.toLocaleDateString('en-CA');

    fetch(`http://127.0.0.1:5000/giveInfo/${memberId}/exerciseList`)
      .then((res) => res.json())
      .then((data) => {
        const list = document.getElementById("exerciseList");
        list.innerHTML = "";
        
        for(plan of data){

          const li = document.createElement("li");
          let content = `${plan.exercises} -------- ${plan.date.slice(5,16)}`;

          let d = new Date(plan.date);
          const formatted = d.toISOString().split('T')[0];

          if(formatted==todayDate){
            content+="  ( Today )";
          }
          li.textContent = content;
          list.appendChild(li);
        }
        
      });
  } else if (id == "historyList") {
    const memberId = window.location.pathname.split("/").pop();

    fetch(`http://127.0.0.1:5000/giveInfo/${memberId}/historyList`)
      .then((res) => res.json())
      .then((data) => {
        const list = document.getElementById("historyList");
        list.innerHTML = "";

        for (ex in data) {
          const day = data[ex]["date"].slice(5, 16);
          const li = document.createElement("li");
          li.textContent = day;
          list.appendChild(li);
        }
      });
  } else if (id == "paymentList") {
    const memberId = window.location.pathname.split("/").pop();

    fetch(`http://127.0.0.1:5000/giveInfo/${memberId}/paymentList`)
      .then((res) => res.json())
      .then((data) => {
        const list = document.getElementById("paymentList");
        list.innerHTML = "";

        for (ex in data) {
          const amt = data[ex]["amount"];
          const day = data[ex]["date"].slice(5, 16);
          const li = document.createElement("li");
          li.textContent = `₹${amt} ------ ${day}`;
          list.appendChild(li);
        }
      });
  }
}

function markPresent() {
  const memberId = window.location.pathname.split("/").pop();
  // let todayDate = new Date().toDateString();
  const rawDate = new Date();
  const todayDate = rawDate.toLocaleDateString('en-CA');

  data = {
    date: todayDate,
  };
  fetch(`http://127.0.0.1:5000/markPresent/${memberId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      if (data.message === "Already marked") {
        return;
      } else {
        let li = document.createElement("li");
        li.textContent = "Today";
        document.getElementById("historyList").appendChild(li);
        document.getElementById("days").innerText = Number(document.getElementById("days").innerText) + 1;
      }
    });

  document.getElementById("presentBtn").disabled = true;
  setTimeout(() => {
    document.getElementById("presentBtn").disabled = false;
  }, 86400000);
}

function editProfile() {
  document.getElementById("profileView").classList.add("hidden");
  document.getElementById("profileEdit").classList.remove("hidden");
}

function saveProfile() {
  const memberId = window.location.pathname.split("/").pop();

  document.getElementById("name").innerText =
    document.getElementById("nameInput").value;

  document.getElementById("phone").innerText =
    document.getElementById("phoneInput").value;

  document.getElementById("age").innerText =
    document.getElementById("ageInput").value;

  document.getElementById("profileView").classList.remove("hidden");
  document.getElementById("profileEdit").classList.add("hidden");

  const data = {
    name: document.getElementById("name").innerText,
    phone: document.getElementById("phone").innerText,
    age: document.getElementById("age").innerText,
  };

  fetch(`http://127.0.0.1:5000/updateProfile/${memberId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Profile Updated ✅");
    });
}

// LOAD DOCUMENT ON BOARDING WHEN MEMBER BOARDS AFTER LOGIN.

document.addEventListener("DOMContentLoaded", function () {
  const memberId = window.location.pathname.split("/").pop();

  fetch(`http://127.0.0.1:5000/givedetail/${memberId}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("welcomeMsg").innerHTML = `Welcome ${data[0]},`;
      document.getElementById("name").innerHTML = data[0];
      document.getElementById("phone").innerHTML = data[1];
      document.getElementById("age").innerHTML = data[2];
      document.getElementById("trainer").innerHTML = data[3];
      document.getElementById("plan").innerHTML = data[4];
      document.getElementById("days").innerHTML = data[5];
    });
});


function logout() {
    window.location.href = "/";
}

// document.addEventListener("DOMContentLoaded", function () {
//   console.log("page");
//   fetch("http://127.0.0.1:5000/onboard")
//     .then((res) => res.json())
//     .then((data) => {
//       document.getElementById("name").innerHTML = data[0];
//       document.getElementById("phone").innerHTML = data[1];
//       document.getElementById("age").innerHTML = data[2];
//       document.getElementById("trainer").innerHTML = data[3];
//       document.getElementById("plan").innerHTML = data[4];
//       document.getElementById("days").innerHTML = data[5];
//     });
// });

// // PROFILE
// document.getElementById("editBtn").addEventListener("click", () => {
//   fetch("http://127.0.0.1:5000/profile")
//     .then((res) => res.json())
//     .then((data) => console.log(data));
// });

// // WORKOUT
// document.getElementById("planBtn").addEventListener("click", () => {
//   fetch("http://127.0.0.1:5000/workout")
//     .then((res) => res.json())
//     .then((data) => {
//       let plans = data[0];
//       let list = plans.exercises.split(","); // convert to array

//       let html = "";

//       list.forEach((item) => {
//         html += `<p>${item.trim()}</p>`;
//       });

//       document.getElementById("workout").innerHTML = html;
//     });
// });

// // ATTENDANCE
// document.getElementById("attendanceBtn").addEventListener("click", () => {
//   fetch("http://127.0.0.1:5000/attendance")
//     .then((res) => res.json())
//     .then((data) => {
//       document.getElementById("days").innerText = data.days + " days";
//     });
// });

// // PAYMENTS
// document.getElementById("paymentBtn").addEventListener("click", () => {
//   fetch("http://127.0.0.1:5000/payments")
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data);

//       for (i in data) {
//         let temp = data[i];
//         let element = document.createElement("p");
//         element = `₹${temp.amount} - ${temp.date.slice(0, 16)} - ${temp.status}`;
//         document.getElementById("paymentList").append(element);
//       }
//     });
// });
