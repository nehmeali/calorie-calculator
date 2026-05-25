const form = document.getElementById("calc-form");
const resultBox = document.getElementById("result");
const errorMsg = document.getElementById("error-msg");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  resultBox.style.display = "none";
  errorMsg.style.display = "none";

  const age = parseFloat(document.getElementById("age").value);
  const sex = document.querySelector('input[name="sex"]:checked')?.value;
  const weight = parseFloat(document.getElementById("weight").value);
  const height_ft = parseFloat(document.getElementById("height_ft").value);
  const height_in = parseFloat(document.getElementById("height_in").value);
  const body_fat = parseFloat(document.getElementById("body_fat").value);
  const activity = document.querySelector('input[name="activity"]:checked')?.value;

  if (!sex) {
    showError("Please select a sex.");
    return;
  }
  if (!activity) {
    showError("Please select an activity level.");
    return;
  }
  if (isNaN(age) || isNaN(weight) || isNaN(height_ft) || isNaN(height_in) || isNaN(body_fat)) {
    showError("Please fill in all fields with valid numbers.");
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent = "Calculating...";
  submitBtn.disabled = true;

  try {
    const response = await fetch("/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age, sex, weight, height_ft, height_in, body_fat, activity }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Server error");
    }

    const data = await response.json();

    document.getElementById("result-calories").textContent =
      data.maintenance_calories.toLocaleString();
    document.getElementById("result-bmr").textContent =
      data.bmr.toLocaleString();
    document.getElementById("result-lbm").textContent =
      data.lean_body_mass_lbs.toLocaleString();
    document.getElementById("result-multiplier").textContent =
      data.activity_multiplier + "x";
    document.getElementById("result-cutting").textContent =
      data.cutting_calories.toLocaleString();
    document.getElementById("result-bulking").textContent =
      data.bulking_calories.toLocaleString();

    resultBox.style.display = "block";
    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (err) {
    showError("Could not reach the backend. Make sure the Python server (main.py) is running.");
    console.error(err);
  } finally {
    submitBtn.textContent = "Calculate My Calories";
    submitBtn.disabled = false;
  }
});

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.style.display = "block";
}
