let input = document.querySelector("#input");
let duration = document.querySelector("#duration");
let form = document.querySelector("#form");
let btn = document.querySelector("#btn");
let output = document.querySelector("#output");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let obj = {
    task: input.value,
    done: false,
  };
  let list = localStorage.getItem("list") ? localStorage.getItem("list") : "[]";
  list = JSON.parse(list);
  if (!list.some((x) => x.task === obj.task)) {
    list.push(obj);
    //it has to happen
    let li = document.createElement("li");
    for (let item of list) {
      li = document.createTextNode(item.task);
      output.appendChild(li);
    }
    //here
    list = JSON.stringify(list);
    localStorage.setItem("list", list);
    console.log("new task added");
  } else {
    console.log("already exists, fuck off");
  }
});
