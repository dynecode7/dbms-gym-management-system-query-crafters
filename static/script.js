function showTab(id) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function toggle(id) {
  document.getElementById(id).classList.toggle("hidden");
}

let count = 0;
let lastMarked = null;

function mark(status) {
  let today = new Date().toDateString();

  if (lastMarked === today) {
    alert("Already marked today");
    return;
  }

  lastMarked = today;

  let li = document.createElement("li");
  li.textContent = today + " - " + status;
  document.getElementById("history").appendChild(li);

  if (status === "Present") {
    count++;
    document.getElementById("days").innerText = count;
  }

  document.getElementById("presentBtn").disabled = true;
  document.getElementById("absentBtn").disabled = true;

  setTimeout(() => {
    document.getElementById("presentBtn").disabled = false;
    document.getElementById("absentBtn").disabled = false;
    lastMarked = null;
  }, 86400000);
}

function editProfile() {
  document.getElementById("profileView").classList.add("hidden");
  document.getElementById("profileEdit").classList.remove("hidden");
}

function saveProfile() {
  document.getElementById("name").innerText =
    document.getElementById("nameInput").value;

  document.getElementById("phone").innerText =
    document.getElementById("phoneInput").value;

  document.getElementById("age").innerText =
    document.getElementById("ageInput").value;

  document.getElementById("profileView").classList.remove("hidden");
  document.getElementById("profileEdit").classList.add("hidden");
}


document.addEventListener("DOMContentLoaded", function () {

  const memberId = window.location.pathname.split("/").pop();

  fetch(`http://127.0.0.1:5000/givedetail/${memberId}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("name").innerHTML = data[0];
      document.getElementById("phone").innerHTML = data[1];
      document.getElementById("age").innerHTML = data[2];
      document.getElementById("trainer").innerHTML = data[3];
      document.getElementById("plan").innerHTML = data[4];
      document.getElementById("days").innerHTML = data[5];
    });

});


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
