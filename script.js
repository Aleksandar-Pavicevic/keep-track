const punchIn = document.querySelector("#punch-in");
const punchOut = document.querySelector("#punch-out");
const reset = document.querySelector("#reset");
const output = document.querySelector("#output");
const table = document.querySelector("#table");
const thead = document.querySelector("#thead");
const tbody = document.querySelector("#tbody");
const timezoneOffset = 2 * 60 * 60 * 1000;
(function () {
  // let data = localStorage.getItem("shifts");
  // data = JSON.parse(data);
  // for (let item in data) {
  //   console.log(data[item]);
  // }
  tableFill();
})();

//TODO
//sort stringify/parse and add database
//on time start fill out table for time start
//on time end fill out table for time end
//custom fill table
//retroactively fill shifts
//onShift = true/false currently working, set in iife, localStorage string. figure out better way
//track other things i.e. reading / language learning / exercising

punchIn.addEventListener("click", () => {
  //if lS 'onShift' is not defined or is false, it sets it to true, if it already is true, console.logs error message
  //sets new date, converts it to local time zone and stores it to lS
  if (localStorage.getItem("onShift") === "true") {
    console.log("ERROR: Already on shift");
  } else {
    localStorage.setItem("onShift", "true");
    let date = new Date();
    date.setTime(date.getTime() + timezoneOffset);
    localStorage.setItem("shift-start", date.toISOString());
  }
});

punchOut.addEventListener("click", () => {
  //if lS 'onShift' is false or not defined, sets it to false, console.logs an error
  //sets new date, converts it to local time zone and stores it to lS
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

function endShift() {
  let date = new Date().toISOString();
  let today = date.split("T")[0];
  const date1String = localStorage.getItem("shift-start");
  const date2String = localStorage.getItem("shift-end");
  let data = localStorage.getItem("shifts") ? localStorage.getItem("shifts") : "[]";
  data = JSON.parse(data);

  let timeIn = new Date(date1String);
  let timeOut = new Date(date2String);

  const timeDifference = timeOut.getTime() - timeIn.getTime();

  let secondsDifference = Math.floor(Math.abs(timeDifference / 1000));
  let minutesDifference = Math.floor(Math.abs(timeDifference / (1000 * 60)));
  let hoursDifference = Math.floor(Math.abs(timeDifference / (1000 * 60 * 60)));

  secondsDifference %= 60;
  minutesDifference %= 60;

  const hoursOutput = hoursDifference.toString().padStart(2, "0");
  const minutesOutput = minutesDifference.toString().padStart(2, "0");
  const secondsOutput = secondsDifference.toString().padStart(2, "0");

  output.innerText = `${hoursOutput}:${minutesOutput}:${secondsOutput}`;

  let obj = {
    date: today,
    start: timeIn,
    end: timeOut,
    duration: `${hoursOutput}:${minutesOutput}:${secondsOutput}`,
  };

  data.push(obj);
  data = JSON.stringify(data);
  localStorage.setItem("shifts", data);
  //append only this shift
  //add row
  //add tds
  //fill tds
  //append tds to row

  //from database, repeat above for each shift and append to table
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
