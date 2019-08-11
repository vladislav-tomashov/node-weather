const forecast = async address => {
  const response = await fetch(
    `/weather?address=${encodeURIComponent(address)}`
  );
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const message1 = document.getElementById("message-1");
const message2 = document.getElementById("message-2");

weatherForm.addEventListener("submit", async e => {
  e.preventDefault();
  try {
    message1.textContent = "Loading...";
    message2.textContent = "";
    const response = await forecast(search.value);
    const { location, weather } = response;
    message1.textContent = location;
    message2.textContent = weather;
  } catch (e) {
    message1.textContent = e.message;
  }
});
