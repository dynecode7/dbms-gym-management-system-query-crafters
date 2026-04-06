// PROFILE
document.getElementById("editBtn").addEventListener("click", () => {
  fetch("http://127.0.0.1:5000/profile")
    .then((res) => res.json())
    .then((data) => console.log(data));
});

// WORKOUT
document.getElementById("planBtn").addEventListener("click", () => {
  fetch("http://127.0.0.1:5000/workout")
    .then((res) => res.json())
    .then((data) => {
      let plans = data[0];
      let list = plans.exercises.split(","); // convert to array

      let html = "";

      list.forEach((item) => {
        html += `<p>${item.trim()}</p>`;
      });

      document.getElementById("workout").innerHTML = html;
    });
});

// ATTENDANCE
document.getElementById("attendanceBtn").addEventListener("click", () => {
  fetch("http://127.0.0.1:5000/attendance")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("days").innerText = data.days + " days";
    });
});

// PAYMENTS
document.getElementById("paymentBtn").addEventListener("click", () => {
  fetch("http://127.0.0.1:5000/payments")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      for (i in data) {
        let temp = data[i];
        let element = document.createElement("p");
        element = `₹${temp.amount} - ${temp.date.slice(0, 16)} - ${temp.status}`;
        document.getElementById("paymentList").append(element);
      }
    });
});
