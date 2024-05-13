const punchIn = document.querySelector("#punch-in");
const punchOut = document.querySelector("#punch-out");
const output = document.querySelector("#output");
const timezoneOffset = 2 * 60 * 60 * 1000;

punchIn.addEventListener("click", () => {
  let date = new Date();
  date.setTime(date.getTime() + timezoneOffset);
  let dateString = date.toISOString();
  localStorage.setItem("in", dateString);
  console.log(localStorage.getItem("in"));
});

punchOut.addEventListener("click", () => {
  let date = new Date();
  date.setTime(date.getTime() + timezoneOffset);
  let dateString = date.toISOString();
  localStorage.setItem("out", dateString);
  console.log(localStorage.getItem("out"));
  console.log(endShift());
});

function endShift() {
  const date1String = localStorage.getItem("in");
  const date2String = localStorage.getItem("out");

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

  return `${hoursOutput}:${minutesOutput}:${secondsOutput}`;
}
