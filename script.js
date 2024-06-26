//VARIABLES
const punchIn = document.querySelector("#punch-in");
const punchOut = document.querySelector("#punch-out");
const reset = document.querySelector("#reset");
const lSClear = document.querySelector("#lSClear");
const buttons = document.querySelectorAll("button");
const current = document.querySelector("#current");
const output = document.querySelector("#output");
const table = document.querySelector("#table");
const thead = document.querySelector("#thead");
const tbody = document.querySelector("#tbody");
const timezoneOffset = 2 * 60 * 60 * 1000; //two hours to manualy add time and match utc+2

//IIFE
(function () {
  // let data = localStorage.getItem("shifts");
  // data = JSON.parse(data);
  // for (let item in data) {
  //   console.log(data[item]);
  // }
  if (localStorage.getItem("onShift") === "true") {
    let date = new Date(localStorage.getItem("shift-start"));
    current.innerText = `On shift since ${date.toISOString().slice(11, 19)}`;
  }
  tableFill();
})();

//EVENT LISTENERS
punchIn.addEventListener("click", () => {
  if (localStorage.getItem("onShift") === "true") {
    console.log("ERROR: Already on shift");
  } else {
    localStorage.setItem("onShift", "true");
    let date = new Date();
    date.setTime(date.getTime() + timezoneOffset);
    localStorage.setItem("shift-start", date.toISOString());
    current.innerText = `On shift since ${date.toISOString().slice(11, 19)}`;
  }
});

punchOut.addEventListener("click", () => {
  //calls endShift function
  if (localStorage.getItem("onShift") === "false" || !localStorage.getItem("onShift")) {
    console.log("ERROR: Not on shift");
  } else {
    localStorage.setItem("onShift", "false");
    let date = new Date();
    date.setTime(date.getTime() + timezoneOffset);
    localStorage.setItem("shift-end", date.toISOString());
    endShift();
  }
});

reset.addEventListener("click", () => {
  localStorage.removeItem("shift-start");
  localStorage.setItem("onShift", "false");
});

lSClear.addEventListener("click", () => {
  localStorage.clear();
});

// buttons.forEach((x) => {
//   x.addEventListener("click", () => {
//     x.classList.add("active-anim");
//     x.addEventListener("animationend", () => {
//       x.classList.remove("active-anim");
//     });
//   });
// }); For each button add class on click and remove after animation end

//FUNCTIONS
function endShift() {
  current.innerText = "";
  let date = new Date().toISOString();
  let today = date.split("T")[0];
  const date1String = localStorage.getItem("shift-start");
  const date2String = localStorage.getItem("shift-end");
  let data = localStorage.getItem("shifts") ? localStorage.getItem("shifts") : "[]";
  data = JSON.parse(data);

  let timeIn = new Date(date1String);
  let timeInFormatted = timeIn.toISOString().slice(11, 19);
  let timeOut = new Date(date2String);
  let timeOutFormatted = timeOut.toISOString().slice(11, 19);

  const timeDifference = timeOut.getTime() - timeIn.getTime();

  let secondsDifference = Math.floor(Math.abs(timeDifference / 1000));
  let minutesDifference = Math.floor(Math.abs(timeDifference / (1000 * 60)));
  let hoursDifference = Math.floor(Math.abs(timeDifference / (1000 * 60 * 60)));

  secondsDifference %= 60;
  minutesDifference %= 60;

  const hoursOutput = hoursDifference.toString().padStart(2, "0");
  const minutesOutput = minutesDifference.toString().padStart(2, "0");
  const secondsOutput = secondsDifference.toString().padStart(2, "0");

  let obj = {
    date: today,
    start: timeInFormatted,
    end: timeOutFormatted,
    duration: `${hoursOutput}:${minutesOutput}:${secondsOutput}`,
  };
  let tr = document.createElement("tr");
  for (let key in obj) {
    let td = document.createElement("td");
    let textNode = document.createTextNode(obj[key]);
    td.appendChild(textNode);
    tr.appendChild(td);
  }
  let firstRow = tbody.getElementsByTagName("tr")[0];
  tbody.insertBefore(tr, firstRow);

  data.push(obj);

  data = JSON.stringify(data);
  localStorage.setItem("shifts", data);
}

function tableFill() {
  if (!localStorage.getItem("shifts")) {
    localStorage.setItem("shifts", "[]");
  }
  let data = localStorage.getItem("shifts");
  data = JSON.parse(data);
  for (let i = data.length - 1; i >= 0; i--) {
    let tableRow = document.createElement("tr");

    let td = document.createElement("td");
    let textNode = document.createTextNode(data[i].date);
    td.appendChild(textNode);
    tableRow.appendChild(td);

    td = document.createElement("td");
    textNode = document.createTextNode(data[i].start);
    td.appendChild(textNode);
    tableRow.appendChild(td);

    td = document.createElement("td");
    textNode = document.createTextNode(data[i].end);
    td.appendChild(textNode);
    tableRow.appendChild(td);

    td = document.createElement("td");
    textNode = document.createTextNode(data[i].duration);
    td.appendChild(textNode);
    tableRow.appendChild(td);

    tbody.appendChild(tableRow);
  }
}
