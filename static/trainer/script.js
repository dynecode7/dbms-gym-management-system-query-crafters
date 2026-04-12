function showPage(pageId) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

function openModal(btn) {

  document.getElementById("modal").style.display = "block";
  const parentDiv= btn.parentElement;
  document.querySelector(".assign-btn").id = btn.id;

  // console.log(document.querySelector(".assign-btn").id);
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// toggle exercise selection (chest, back, legs, shoulders)
function toggleExerciseSelection() {
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".exercise").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.toggle("active");
      });
    });
  });
}
toggleExerciseSelection() 



function assignWorkout() {

  const member_id = document.querySelector(".assign-btn").id;
  console.log(member_id);

  let selectedBtns = [];
  document.querySelectorAll(".exercise.active").forEach((btn) => {
    selectedBtns.push(btn.innerText);
    btn.classList.toggle("active");
  });
  console.log(selectedBtns);

  const rawDate = new Date();
  const todayDate = rawDate.toLocaleDateString('en-CA');

  data={
    mid: member_id,
    exercises: selectedBtns,
    date: todayDate
  };
  
  fetch(`http://127.0.0.1:5000/assignWorkout/${member_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if(data.status==1){
        alert(data.message + "--" + selectedBtns.join(", "));
      }
      else{
        alert(data.message);
      }
    });

  closeModal();
}

function logout() {
  window.location.href = "/logout";
}

// LOAD DOCUMENT ON BOARDING OF TRAINER AFTER LOGIN.

document.addEventListener("DOMContentLoaded", function () {
  const trainerId = window.location.pathname.split("/").pop();
  //   console.log(trainerId);
  const template = document.getElementById("cardTemplate");
  const homeSection = document.getElementById("home");

  fetch(`http://127.0.0.1:5000/trainer/givedetails/${trainerId}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("starting to add");

      document.getElementById("welcomeMsg").innerHTML = `${data[0]}`;
      document.getElementById("trainer_name").innerHTML = data[0];
      document.getElementById("specs").innerHTML =
        `Specialization In ${data[1]}`;

      for (let member of data[2]) {
        
        const card = template.cloneNode(true); // ✅ clone

        card.querySelector(".name").innerText = member.name;
        card.querySelector(".age").innerText = `Age: ${member.age}`;
        card.querySelector(".plan").innerText = `Plan: ${member.type}`;

        card.querySelector("#addExerciseBtn").parentElement.id = member.member_id;
        card.querySelector("#addExerciseBtn").id = member.member_id;

        card.classList.remove("hidden");

        homeSection.appendChild(card);
        
      }
      document.getElementById("money").innerText = `₹ ${data[3]}`;
    });
});
