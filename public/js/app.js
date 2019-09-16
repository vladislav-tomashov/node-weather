const forecastByAddress = async address => {
  const response = await fetch(
    `/weather?address=${encodeURIComponent(address)}`
  );
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

const forecastByLocation = async ({ longitude, latitude }) => {
  const response = await fetch(
    `/weatherbylocation?longitude=${encodeURIComponent(
      longitude
    )}&latitude=${encodeURIComponent(latitude)}`
  );
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

const $weatherForm = document.querySelector("form");
const $address = document.querySelector("input");
const $currentLocationButton = document.querySelector("#current-location");
const $submitButton = $weatherForm.querySelector("button");
const $message1 = document.getElementById("message-1");
const $message2 = document.getElementById("message-2");

$currentLocationButton.addEventListener("click", async e => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  navigator.geolocation.getCurrentPosition(async function(position) {
    try {
      $currentLocationButton.setAttribute("disabled", "disabled");
      $submitButton.setAttribute("disabled", "disabled");
      $message1.textContent = "Loading...";
      $message2.textContent = "";
      const { longitude, latitude } = position.coords;
      const response = await forecastByLocation({ longitude, latitude });
      const { location, weather } = response;
      $message1.textContent = location;
      $message2.textContent = weather;
    } catch (e) {
      $message1.textContent = e.message;
    } finally {
      $currentLocationButton.removeAttribute("disabled");
      $submitButton.removeAttribute("disabled");
    }
  });
});

$weatherForm.addEventListener("submit", async e => {
  e.preventDefault();
  try {
    $submitButton.setAttribute("disabled", "disabled");
    $message1.textContent = "Loading...";
    $message2.textContent = "";
    const response = await forecastByAddress($address.value);
    const { location, weather } = response;
    $message1.textContent = location;
    $message2.textContent = weather;
  } catch (e) {
    $message1.textContent = e.message;
  } finally {
    $currentLocationButton.removeAttribute("disabled");
    $submitButton.removeAttribute("disabled");
  }
});
