const getWeather = async address => {
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
    const address = search.value;
    const response = await getWeather(address);
    console.log(response);
    const { location, forecast: { summary, temperature } = {} } = response;
    const weather = `${summary}. It is currently ${temperature} degrees out.`;
    message1.textContent = location;
    message2.textContent = weather;
  } catch (e) {
    message1.textContent = e.message;
  }
});
