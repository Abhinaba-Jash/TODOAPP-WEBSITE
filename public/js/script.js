document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("datePicker");
  const timeInput = document.getElementById("timePicker");
  const add = document.getElementById("add");
  const cTime = document.getElementById("cTime");
  const cDate = document.getElementById("cDate");
  const WEATHER_API = "d4c463e6039f4e2aa5f61942241205";
  let city = document.getElementById("city");
  let searchBtn = document.getElementById("search");
  let locationBtn = document.getElementById("location");
  let f_head = document.getElementById("forecast_heading");
  let p_cont = document.getElementById("profile_cont");
  let logout = document.getElementById("logoutBtn");
  let isLogoutVisible = false;
  p_cont.addEventListener("click", () => {
    if (!isLogoutVisible) {
      logout.classList.remove("hidden");
      logout.classList.add("visible");
      isLogoutVisible = true;
    } else {
      logout.classList.remove("visible");
      logout.classList.add("hidden");
      isLogoutVisible = false;
    }
  });
  logout.addEventListener("click", async () => {
    const response = await fetch("/auth/logout", { method: "POST" });

    if (response.ok) {
      window.location.href = "/";
    } else {
      alert("Logout failed");
    }
  });

  function deleteOperation() {
    const deleteButtons = document.getElementsByClassName("delBtn");
    Array.from(deleteButtons).forEach((button) => {
      button.addEventListener("click", async () => {
        const todoId = button.getAttribute("data-id");
        try {
          const response = await fetch(`/deleteTodo/${todoId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            button.parentElement.parentElement.parentElement.parentElement.remove();
          } else {
            console.error("Failed to delete todo");
          }
        } catch (error) {
          console.error("Error deleting todo:", error);
        }
      });
    });
  }

  async function updateTodoInDatabase(todoId, updatedTodo) {
    try {
      const response = await fetch(`/updateTodo/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: updatedTodo }),
      });
      if (response.ok) {
      } else {
        console.error("Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }
  async function convertToDiv(button, saveBtn) {
    const todoId = button.getAttribute("data-id");
    let input = button.parentElement.previousElementSibling.firstElementChild;
    const text = input.value.trim();
    const div = document.createElement("div");
    div.innerText = text;
    div.setAttribute("data-id", todoId);
    div.classList.add(
      "todoText",
      "text-sm",
      "text-white",
      "w-fit",
      "break-words",
      "lg:text-base"
    );
    input.parentElement.replaceChild(div, input);
    saveBtn.classList.add("hidden");
    await updateTodoInDatabase(todoId, text);
  }
  function editBtnClick() {
    const editButtons = document.getElementsByClassName("editBtn");
    Array.from(editButtons).forEach((button) => {
      button.addEventListener("click", async () => {
        const todoId = button.getAttribute("data-id");
        let span =
          button.parentElement.previousElementSibling.firstElementChild;
        const text = span.textContent.trim();
        const input = document.createElement("input");
        input.type = "text";
        input.value = text;
        input.setAttribute("data-id", todoId);
        input.classList.add(
          "todoText",
          "text-sm",
          "text-white",
          "w-fit",
          "break-words",
          "lg:text-base",
          "outline-none",
          "bg-[#222222]"
        );
        span.parentElement.replaceChild(input, span);
        input.focus();
        let saveBtn = button.parentElement.previousElementSibling.children[1];
        saveBtn.classList.remove("hidden");
        saveBtn.addEventListener("click", (e) => {
          e.preventDefault();
          convertToDiv(button, saveBtn);
        });
      });
    });
  }
  const todoDataElement = document.getElementById('todos-data');
  const todos = JSON.parse(todoDataElement.textContent);
  let taskList = document.getElementById("task-list");
  taskList.innerHTML = "";
  if (todos) {
    Object.keys(todos).forEach((key) => {
      let time = todos[key].task.time;
      let date = todos[key].task.date;
      let todo = todos[key].task.todo;
      let todoId = todos[key].id;
      let div = document.createElement("div");
      div.innerHTML = `<div class="flex flex-col">
            <div
              class="flex bg-[#222222] w-full py-1 px-2 rounded-lg rounded-bl-none items-center justify-between pr-3"
            >
              <div data-id="${todoId}" class="todoText text-sm text-white w-fit break-words lg:text-base flex flex-col sm:flex-row gap-1 sm:gap-5"
                >
                <span class="w-fit">${todo}</span>
                <button class = "bg-green-500 text-sm font-semibold h-full w-fit px-2 py-1 rounded-md hidden">Save<button>
                </div>
              <div class="flex items-center gap-2 sm:gap-5">
                <img data-id="${todoId}" class=" editBtn h-full cursor-pointer" src="assets/img/edit.png" alt="" />
                <img data-id="${todoId}"  class="delBtn h-6 cursor-pointer" src="assets/img/delete.png" alt="" />
              </div>
            </div>
            <div
              class="flex gap-4 bg-green-500 w-fit py-1 rounded-lg rounded-t-none px-4 font-semibold l"
            >
              <span class="text-xs text-white">Time: ${time}</span>
              <span class="text-xs text-white">Date: ${date}</span>
            </div>
          </div>`;
      taskList.appendChild(div);
    });
  }
  window.onload = function() {
    deleteOperation();
    editBtnClick();
  };

  document.getElementById("task-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    let todo = document.getElementById("task").value;
    let time = document.getElementById("timePicker").value;
    let date = document.getElementById("datePicker").value;
    const response = await fetch("/add-todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo, time, date }),
    });
    if (response.ok) {
      location.reload();
    } else {
      console.error("Some problem occurred.");
    }
  });
  getCurrentLocation();
  const weatherData = async (city, latitude, longitude) => {
    let apiUrl;
    if (latitude == null && longitude == null) {
      apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API}&q=${city}&days=1&aqi=yes&alerts=yes `;
    } else {
      apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API}&q=${latitude},${longitude}&days=1&aqi=yes&alerts=yes`;
    }
    let response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    let data = await response.json();
    setContent(data);
  };
  function setContent(data) {
    let icon = document.getElementById("w-icon");
    let temp = document.getElementById("w-temp");
    let feel = document.getElementById("w-feel");
    let wind = document.getElementById("w-wind");
    let rain = document.getElementById("w-rain");
    let position = document.getElementById("w-position");
    icon.setAttribute("src", data.current.condition.icon);
    temp.innerText = data.current.temp_c + "°C";
    feel.innerText = "Feel: " + data.current.feelslike_c + "°C";
    wind.innerText = "Wind: " + data.current.wind_kph + "km/hr";
    rain.innerText = "Rain: " + data.current.cloud + "%";
    position.innerText = data.location.name + ", " + data.location.country;
    f_head.innerText = ` Hourly forecast of ${data.location.name} :`;
    if (city.value.trim() === "") {
      city.value = data.location.name;
    }
    let forecastData = data.forecast.forecastday[0].hour;
    setForecastData(forecastData);
  }
  let setForecastData = (forecastData) => {
    let forecast_cont = document.getElementById("forecast_container");
    forecast_cont.innerHTML = "";
    for (let i = 0; i < forecastData.length; i += 3) {
      let icon = forecastData[i].condition.icon;
      let time = forecastData[i].time.split(" ")[1];
      let temp = forecastData[i].temp_c;
      let wind = forecastData[i].wind_kph;
      let rain = forecastData[i].chance_of_rain;
      let div = document.createElement("div");
      div.innerHTML = `<div class="flex flex-col bg-[#3A3434] text-white rounded-lg px-4 py-2 ">
                <div class="flex flex-col items-center">
                  <img class="w-20" src=${icon} alt="" />
                  <span class="text-sm mb-1 font-semibold">${time}</span>
                </div>
                <span>Temp: ${temp} &deg;C</span>
                <span>Wind:${wind} km/hr</span>
                <span>Rain: ${rain}% </span>
              </div>`;
      forecast_cont.appendChild(div);
    }
  };
  function getTimeAndDate() {
    let time = new Date();
    let dayArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    let moArr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let timeDate = [
      time.getHours() + " : " + time.getMinutes(),
      time.getDate() +
        " " +
        moArr[time.getMonth()] +
        " " +
        time.getFullYear() +
        ", " +
        dayArr[time.getDay()],
    ];
    return timeDate;
  }

  let tD = getTimeAndDate();
  cTime.innerText = "Time: " + tD[0];
  cDate.innerText = "Date: " + tD[1];
  const location_acc = document.getElementById("location_access");
  //Getting the users current position
  function getCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location_acc.style.color = "green";
          location_acc.innerText = "We are fetching your location...";
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;

          location_acc.innerText = "Your location is fetched.";
          weatherData(null, lat, lon);
        },
        (error) => {
          location_acc.style.color = "red";
          location_acc.innerText =
            "We are finding trouble in fetching your location.";
        }
      );
    } else {
      location_acc.style.color = "red";
      location_acc.innerText = "Network error, please try again.";
    }
  }
  locationBtn.addEventListener("click", () => {
    getCurrentLocation();
  });

  searchBtn.addEventListener("click", () => {
    let cityName = city.value;
    weatherData(cityName, null, null);
  });
});
