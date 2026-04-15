let AU_selectedTrainer = null;
let AU_selectedPlan = null;
let AU_selectedPrice = null;
let trainerID, planID, price;
let memberId;

function showTab(id) {
  document
    .querySelectorAll(".sidebar li")
    .forEach((li) => li.classList.remove("sidebar_li_selected"));
  document.getElementById(`sidebar_${id}`).classList.add("sidebar_li_selected");

  document.querySelectorAll(".tab").forEach((t) => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function toggle(id) {
  document.getElementById(id).classList.toggle("hidden");

  if (id == "exerciseList") {
    const memberId = window.location.pathname.split("/").pop();

    const rawDate = new Date();
    const todayDate = rawDate.toLocaleDateString("en-CA");

    fetch(`http://127.0.0.1:5000/giveInfo/${memberId}/exerciseList`)
      .then((res) => res.json())
      .then((data) => {
        const list = document.getElementById("exerciseList");
        list.innerHTML = "";

        for (plan of data) {
          const li = document.createElement("li");
          let content = `${plan.exercises} - ( ${plan.date.slice(5, 16)} )`;

          let d = new Date(plan.date);
          const formatted = d.toISOString().split("T")[0];

          if (formatted == todayDate) {
            content += "  ( Today )";
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
          li.textContent = `₹${amt} - ( ${day} )`;
          list.appendChild(li);
        }
      });
  }
}

function markPresent() {
  const memberId = window.location.pathname.split("/").pop();
  // let todayDate = new Date().toDateString();
  const rawDate = new Date();
  const todayDate = rawDate.toLocaleDateString("en-CA");

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
        document.getElementById("days").innerText =
          Number(document.getElementById("days").innerText) + 1;
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

function logout() {
  window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", function () {

  memberId = window.location.pathname.split("/").pop();

  const rawDate = new Date();
  const todayDate = rawDate.toLocaleDateString("en-CA");
  console.log(todayDate);

  fetch(`http://127.0.0.1:5000/givedetail/${memberId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data[3]) {
        // IF TRAINER IS SELECTED. THAT IS NOT A NEW SIGNED UP USER.
        document.querySelector("body").classList.remove("AU_style");
        document.getElementById("CompleteUser").classList.remove("hidden");
        document.getElementById("AU_container").classList.add("AU_hidden");

        document.getElementById("welcomeMsg").innerHTML = `Welcome ${data[0]},`;
        document.getElementById("name").innerHTML = data[0];
        document.getElementById("phone").innerHTML = data[1];
        document.getElementById("age").innerHTML = data[2];
        document.getElementById("trainer").innerHTML = data[3];
        document.getElementById("plan").innerHTML = data[4];
        document.getElementById("days").innerHTML = data[5];

        let dateStr = data[6];
        let date = new Date(dateStr);
        let formatted = date.toISOString().split("T")[0];

        console.log(formatted); // 2026-04-01

        let d1 = new Date(todayDate)
        let d2 = new Date(formatted);

        let diff = (d1 - d2) / (1000 * 60 * 60 * 24);

        console.log(diff); // 14
        
        if(diff>0){
          if(data[4]=="Monthly") document.getElementById("expiry").innerText = `${30-diff} days`;
          else if(data[4]=="Quarterly") document.getElementById("expiry").innerText = `${90-diff} days`;
          else if(data[4]=="Yearly") document.getElementById("expiry").innerText = `${365-diff} days`;
          else document.getElementById("expiry").innerText = "Invalid Subscription";
        }
        
        } else {
        document.getElementById("CompleteUser").classList.add("hidden");
        document.getElementById("AU_container").classList.remove("AU_hidden");
        document.querySelector("body").classList.add("AU_style");
        document.getElementById("AU_memberName").innerText = data[0];
        LoadPlansTrainersPayments();
      }
    });
});

let LoadPTMdata;

function LoadPlansTrainersPayments() {
  let template = document.querySelector(".AU_trainerCard");
  let parent = document.getElementById("AU_trainerContainer");

  fetch(`http://127.0.0.1:5000/LoadPTM`)
    .then((res) => res.json())
    .then((data) => {
      LoadPTMdata = data;
      for (let trainer of data[0]) {
        const card = template.cloneNode(true); // ✅ clone

        card.id = trainer.trainer_id;
        card.querySelector("h3").innerText = trainer.name;
        card.querySelector("p").innerText = trainer.specialization;

        card.classList.remove("hidden");
        parent.appendChild(card);
      }

      template = document.querySelector(".AU_PlanCard");
      parent = document.getElementById("AU_planContainer");

      for (let plan of data[1]) {
        const card = template.cloneNode(true); // ✅ clone

        card.id = plan.plan_id;
        card.querySelector("h3").innerText = plan.type;
        card.querySelector("p").innerText = plan.price;

        card.classList.remove("hidden");
        parent.appendChild(card);
      }
    });
}

function AU_selectTrainer(card) {
  document.querySelectorAll("#AU_trainerContainer .AU_card").forEach((c) => {
    if (c != card) {
      c.classList.remove("AU_selected");
    }
  });

  card.classList.toggle("AU_selected");
  if (card.classList[2] == "AU_selected") {
    AU_selectedTrainer = card.id;
  } else AU_selectedTrainer = null;
  AU_checkProceed();
}

function AU_selectPlan(card) {
  document.querySelectorAll("#AU_planContainer .AU_card").forEach((c) => {
    if (c != card) {
      c.classList.remove("AU_selected");
    }
  });

  card.classList.toggle("AU_selected");

  if (card.classList[2] == "AU_selected") {
    AU_selectedPlan = card.id;
  } else AU_selectedPlan = null;
  AU_checkProceed();
}

function AU_checkProceed() {
  if (AU_selectedTrainer != null && AU_selectedPlan != null) {
    document.getElementById("AU_proceedBtn").classList.remove("AU_hidden");
  } else {
    document.getElementById("AU_proceedBtn").classList.add("AU_hidden");
    document.getElementById("AU_proceedBtn").classList.remove("AU_selected");
  }
}

function AU_showPayment() {
  // hide sections
  document
    .querySelectorAll(".AU_section")
    .forEach((sec) => (sec.style.display = "none"));

  document.getElementById("AU_proceedBtn").style.display = "none";

  // change heading
  document.querySelector("h1").innerText = "Make Payment";

  // show payment section
  document.getElementById("AU_paymentSection").classList.remove("AU_hidden");

  function getID() {
    document.querySelectorAll(".AU_selected").forEach((card) => {
      if (card.parentElement.id === "AU_trainerContainer") {
        trainerID = card.id;
      } else {
        planID = card.id;
      }
    });
  }

  getID();

  for (let e of LoadPTMdata[1]) {
    if (e.plan_id == planID) {
      price = e.price;
      document.getElementById("AU_amount").placeholder = price;
      document.getElementById("AU_amount").placeholder = price;
      document.getElementById("AU_amount").disabled = true;
    }
  }
}

function AU_makePayment() {
  const rawDate = new Date();
  const todayDate = rawDate.toLocaleDateString("en-CA");

  const data = {
    member: memberId,
    trainer: trainerID,
    plan: planID,
    amount: price,
    date: todayDate,
  };
  console.log(data);

  fetch("http://127.0.0.1:5000/makePayment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.href = data.url;
      alert("Payment Successful!");
    });
}
