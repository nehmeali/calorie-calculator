from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

ACTIVITY_MULTIPLIERS = {
    "very_active": 1.725,
    "moderate": 1.55,
    "low_none": 1.2,
}

@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json()

    age = float(data.get("age", 0))
    sex = data.get("sex", "male").lower()
    weight_lbs = float(data.get("weight", 0))
    height_ft = float(data.get("height_ft", 5))
    height_in = float(data.get("height_in", 0))
    body_fat_pct = float(data.get("body_fat", 0))
    activity = data.get("activity", "moderate")

    weight_kg = weight_lbs * 0.453592
    height_cm = (height_ft * 12 + height_in) * 2.54

    lean_body_mass_kg = weight_kg * (1 - body_fat_pct / 100)

    if sex == "male":
        bmr_mifflin = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    else:
        bmr_mifflin = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161

    bmr_katch = 370 + (21.6 * lean_body_mass_kg)

    bmr = (bmr_mifflin + bmr_katch) / 2

    multiplier = ACTIVITY_MULTIPLIERS.get(activity, 1.55)
    maintenance_calories = round(bmr * multiplier)

    cutting_calories = maintenance_calories - 400
    bulking_calories = maintenance_calories + 350

    return jsonify({
        "maintenance_calories": maintenance_calories,
        "cutting_calories": cutting_calories,
        "bulking_calories": bulking_calories,
        "bmr": round(bmr),
        "lean_body_mass_lbs": round(lean_body_mass_kg * 2.20462, 1),
        "activity_multiplier": multiplier,
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=False)
