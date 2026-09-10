# ============================================================
# LANDSLIDE INTELLIGENCE ENGINE
# COMPLETE OFFLINE AI SYSTEM - SINGLE FILE
# ============================================================
#
# FEATURES:
#
# 🤖 Machine Learning Landslide Prediction
# 🏔️ Landslide Risk Analysis
# 💬 Offline Landslide Assistant
# 🧠 Intent Detection
# 📚 Offline Knowledge Base
# 🚨 Risk Alert Engine
# 🔔 Notification Generator
# 🗜️ Compressed Offline Data Storage
# 📴 Offline Prediction History
# 🚗 Travel Safety Analysis
# 📈 Historical Risk Analysis
# 💾 Local Model Storage
#
# ============================================================


import os
import json
import gzip
from datetime import datetime

import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score


# ============================================================
# PATH CONFIGURATION
# ============================================================

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

PROJECT_DIR = os.path.dirname(CURRENT_DIR)


DATASET_PATH = os.path.join(
    PROJECT_DIR,
    "dataset",
    "landslide_data.csv"
)


AI_DATA_DIR = os.path.join(
    CURRENT_DIR,
    "ai_data"
)


MODEL_DIR = os.path.join(
    CURRENT_DIR,
    "trained_model"
)


MODEL_PATH = os.path.join(
    MODEL_DIR,
    "landslide_model.pkl"
)


KNOWLEDGE_PATH = os.path.join(
    AI_DATA_DIR,
    "knowledge.json.gz"
)


HISTORY_PATH = os.path.join(
    AI_DATA_DIR,
    "prediction_history.json.gz"
)


ALERTS_PATH = os.path.join(
    AI_DATA_DIR,
    "alerts.json.gz"
)


os.makedirs(
    AI_DATA_DIR,
    exist_ok=True
)


os.makedirs(
    MODEL_DIR,
    exist_ok=True
)


# ============================================================
# MACHINE LEARNING CONFIGURATION
# ============================================================

FEATURES = [

    "rainfall",

    "slope",

    "soil_moisture"

]


TARGET = "landslide"


_cached_model = None


# ============================================================
# COMPRESSED JSON STORAGE
# ============================================================

def save_compressed_json(path, data):

    try:

        with gzip.open(
            path,
            "wt",
            encoding="utf-8"
        ) as file:

            json.dump(
                data,
                file,
                ensure_ascii=False,
                indent=2
            )

        return True

    except Exception as error:

        print(
            "Storage error:",
            error
        )

        return False


def load_compressed_json(path, default=None):

    if default is None:

        default = {}


    if not os.path.exists(path):

        return default


    try:

        with gzip.open(
            path,
            "rt",
            encoding="utf-8"
        ) as file:

            return json.load(file)

    except Exception:

        return default


# ============================================================
# OFFLINE KNOWLEDGE BASE
# ============================================================

DEFAULT_KNOWLEDGE = {

    "what is a landslide":

        "A landslide is the movement of rock, soil, or debris down a slope because of gravity.",


    "what causes landslides":

        "Landslides can be caused by heavy rainfall, earthquakes, erosion, steep slopes, deforestation, construction activity, and unstable soil.",


    "warning signs":

        "Warning signs include new cracks in the ground, leaning trees, falling rocks, unusual rumbling sounds, damaged roads, and sudden changes in water flow.",


    "during landslide":

        "Move away from the landslide path immediately. Avoid valleys and river channels. Follow instructions from local emergency authorities.",


    "after landslide":

        "Stay away from the affected area, watch for additional landslides, avoid damaged roads, and follow instructions from authorities.",


    "heavy rainfall":

        "Heavy rainfall can saturate soil and reduce slope stability, significantly increasing the possibility of a landslide.",


    "travel safety":

        "Avoid unnecessary travel through landslide-prone areas during heavy rainfall or when high-risk alerts are active.",


    "prevention":

        "Landslide risk can be reduced through proper drainage, vegetation protection, slope stabilization, avoiding unsafe construction, and monitoring vulnerable areas."

}


def initialize_knowledge():

    if not os.path.exists(KNOWLEDGE_PATH):

        save_compressed_json(

            KNOWLEDGE_PATH,

            DEFAULT_KNOWLEDGE

        )


def load_knowledge():

    initialize_knowledge()


    return load_compressed_json(

        KNOWLEDGE_PATH,

        DEFAULT_KNOWLEDGE

    )


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(text):

    text = str(text).lower().strip()


    characters = [

        "?",

        "!",

        ".",

        ",",

        ";",

        ":"

    ]


    for character in characters:

        text = text.replace(
            character,
            ""
        )


    return text


# ============================================================
# INTENT DETECTION
# ============================================================

def detect_intent(message):

    text = normalize_text(message)


    if any(

        word in text

        for word in [

            "cause",

            "causes",

            "why",

            "happen",

            "happens"

        ]

    ):

        return "CAUSES"


    if any(

        word in text

        for word in [

            "warning",

            "sign",

            "signs",

            "symptom",

            "symptoms"

        ]

    ):

        return "WARNING_SIGNS"


    if any(

        word in text

        for word in [

            "travel",

            "road",

            "journey",

            "drive",

            "safe to go"

        ]

    ):

        return "TRAVEL"


    if any(

        word in text

        for word in [

            "emergency",

            "during",

            "help",

            "trapped"

        ]

    ):

        return "EMERGENCY"


    if any(

        word in text

        for word in [

            "prevent",

            "prevention",

            "avoid"

        ]

    ):

        return "PREVENTION"


    if any(

        word in text

        for word in [

            "rain",

            "rainfall",

            "weather"

        ]

    ):

        return "RAIN"


    if any(

        word in text

        for word in [

            "risk",

            "danger",

            "probability",

            "prediction"

        ]

    ):

        return "RISK"


    return "GENERAL"


# ============================================================
# OFFLINE CHATBOT
# ============================================================

def chat(message, latest_risk=None):

    intent = detect_intent(message)

    knowledge = load_knowledge()


    if intent == "CAUSES":

        answer = knowledge.get(
            "what causes landslides"
        )


    elif intent == "WARNING_SIGNS":

        answer = knowledge.get(
            "warning signs"
        )


    elif intent == "TRAVEL":

        answer = knowledge.get(
            "travel safety"
        )


        if latest_risk:

            level = latest_risk.get(
                "risk_level",
                "UNKNOWN"
            )


            answer += (
                f" Current local risk level: {level}."
            )


    elif intent == "EMERGENCY":

        answer = knowledge.get(
            "during landslide"
        )


    elif intent == "PREVENTION":

        answer = knowledge.get(
            "prevention"
        )


    elif intent == "RAIN":

        answer = knowledge.get(
            "heavy rainfall"
        )


    elif intent == "RISK":

        if latest_risk:

            answer = (

                f"The latest analyzed risk level is "

                f"{latest_risk.get('risk_level')} "

                f"with a risk score of "

                f"{latest_risk.get('risk_score')}%."

            )

        else:

            answer = (

                "I need environmental data such as rainfall, "

                "slope and soil moisture to analyze landslide risk."

            )


    else:

        answer = (

            "I am an offline Landslide Assistant. "

            "You can ask me about landslide causes, warning signs, "

            "rainfall, prevention, emergency safety, travel safety, "

            "and landslide risk."

        )


    return {

        "success": True,

        "intent": intent,

        "answer": answer

    }


# ============================================================
# DATA PREPROCESSING
# ============================================================

def preprocess_dataset(data):

    required_columns = FEATURES + [TARGET]


    missing_columns = [

        column

        for column in required_columns

        if column not in data.columns

    ]


    if missing_columns:

        raise ValueError(

            f"Dataset missing columns: {missing_columns}"

        )


    data = data[
        required_columns
    ].copy()


    for column in required_columns:

        data[column] = pd.to_numeric(

            data[column],

            errors="coerce"

        )


    data = data.dropna()


    return data


# ============================================================
# TRAIN LANDSLIDE AI
# ============================================================

def train_ai():

    print("\n" + "=" * 60)

    print("TRAINING OFFLINE LANDSLIDE AI")

    print("=" * 60)


    if not os.path.exists(DATASET_PATH):

        raise FileNotFoundError(

            f"Dataset not found:\n{DATASET_PATH}"

        )


    data = pd.read_csv(
        DATASET_PATH
    )


    data = preprocess_dataset(
        data
    )


    if len(data) < 10:

        raise ValueError(

            "Dataset needs at least 10 valid records."

        )


    X = data[
        FEATURES
    ]


    y = data[
        TARGET
    ]


    if len(y.unique()) < 2:

        raise ValueError(

            "Dataset must contain both 0 and 1."

        )


    print(

        f"\nTraining records: {len(data)}"

    )


    # --------------------------------------------------------
    # TRAIN / TEST SPLIT
    # --------------------------------------------------------

    try:

        X_train, X_test, y_train, y_test = train_test_split(

            X,

            y,

            test_size=0.20,

            random_state=42,

            stratify=y

        )


    except ValueError:

        X_train, X_test, y_train, y_test = train_test_split(

            X,

            y,

            test_size=0.20,

            random_state=42

        )


    # --------------------------------------------------------
    # RANDOM FOREST MODEL
    # --------------------------------------------------------

    model = RandomForestClassifier(

        n_estimators=200,

        random_state=42,

        class_weight="balanced"

    )


    print(
        "\nTraining model..."
    )


    model.fit(
        X_train,
        y_train
    )


    predictions = model.predict(
        X_test
    )


    accuracy = accuracy_score(

        y_test,

        predictions

    )


    print(

        f"\nAccuracy: {accuracy * 100:.2f}%"

    )


    # --------------------------------------------------------
    # SAVE MODEL
    # --------------------------------------------------------

    model_data = {

        "model": model,

        "features": FEATURES,

        "accuracy": float(accuracy),

        "trained_at":

            datetime.now().isoformat()

    }


    joblib.dump(

        model_data,

        MODEL_PATH

    )


    print(

        "\nModel saved successfully!"

    )


    return {

        "success": True,

        "accuracy":

            round(

                accuracy * 100,

                2

            ),

        "records":

            len(data)

    }


# ============================================================
# LOAD AI MODEL
# ============================================================

def load_ai():

    global _cached_model


    if _cached_model is not None:

        return _cached_model


    if not os.path.exists(MODEL_PATH):

        print(

            "\nNo trained model found."

        )


        train_ai()


    model_data = joblib.load(
        MODEL_PATH
    )


    if isinstance(model_data, dict):

        _cached_model = model_data[
            "model"
        ]

    else:

        _cached_model = model_data


    return _cached_model


# ============================================================
# MACHINE LEARNING PREDICTION
# ============================================================

def predict_landslide(

    rainfall,

    slope,

    soil_moisture

):

    model = load_ai()


    rainfall = float(
        rainfall
    )

    slope = float(
        slope
    )

    soil_moisture = float(
        soil_moisture
    )


    input_data = pd.DataFrame(

        [[

            rainfall,

            slope,

            soil_moisture

        ]],

        columns=FEATURES

    )


    prediction = int(

        model.predict(
            input_data
        )[0]

    )


    probabilities = model.predict_proba(
        input_data
    )[0]


    classes = list(
        model.classes_
    )


    probability = 0.0


    if 1 in classes:

        index = classes.index(
            1
        )

        probability = float(
            probabilities[index]
        )


    return {

        "prediction":

            prediction,

        "landslide_probability":

            round(

                probability * 100,

                2

            )

    }


# ============================================================
# RISK ENGINE
# ============================================================

def calculate_risk(

    rainfall,

    slope,

    soil_moisture

):

    prediction = predict_landslide(

        rainfall,

        slope,

        soil_moisture

    )


    score = prediction[
        "landslide_probability"
    ]


    if score < 25:

        level = "LOW"


    elif score < 50:

        level = "MODERATE"


    elif score < 75:

        level = "HIGH"


    else:

        level = "VERY HIGH"


    return {

        "prediction":

            prediction["prediction"],

        "risk_score":

            score,

        "risk_level":

            level,

        "rainfall":

            float(rainfall),

        "slope":

            float(slope),

        "soil_moisture":

            float(soil_moisture),

        "timestamp":

            datetime.now().isoformat()

    }


# ============================================================
# ALERT ENGINE
# ============================================================

def generate_alert(risk):

    level = risk.get(
        "risk_level"
    )


    if level == "VERY HIGH":

        return {

            "alert": True,

            "priority": "EMERGENCY",

            "title": "VERY HIGH LANDSLIDE RISK",

            "message":

                "Emergency warning: Very high landslide risk detected. Avoid dangerous slopes and follow official safety instructions."

        }


    elif level == "HIGH":

        return {

            "alert": True,

            "priority": "HIGH",

            "title": "HIGH LANDSLIDE RISK",

            "message":

                "High landslide risk detected. Avoid unnecessary travel through vulnerable areas."

        }


    elif level == "MODERATE":

        return {

            "alert": True,

            "priority": "MODERATE",

            "title": "MODERATE LANDSLIDE RISK",

            "message":

                "Moderate landslide risk detected. Stay alert and monitor local conditions."

        }


    return {

        "alert": False,

        "priority": "LOW",

        "title": "LOW LANDSLIDE RISK",

        "message":

            "Current analyzed landslide risk is low."

    }


# ============================================================
# NOTIFICATION ENGINE
# ============================================================

def create_notification(risk):

    alert = generate_alert(
        risk
    )


    return {

        "send":

            alert["alert"],

        "title":

            alert["title"],

        "message":

            alert["message"],

        "priority":

            alert["priority"],

        "timestamp":

            datetime.now().isoformat()

    }


# ============================================================
# OFFLINE HISTORY STORAGE
# ============================================================

def save_prediction_history(result):

    history = load_compressed_json(

        HISTORY_PATH,

        []

    )


    history.append(
        result
    )


    # Keep latest 1000 records only

    history = history[-1000:]


    save_compressed_json(

        HISTORY_PATH,

        history

    )


def get_prediction_history():

    return load_compressed_json(

        HISTORY_PATH,

        []

    )


# ============================================================
# ALERT STORAGE
# ============================================================

def save_alert(alert):

    alerts = load_compressed_json(

        ALERTS_PATH,

        []

    )


    alerts.append(
        alert
    )


    # Keep latest 500 alerts

    alerts = alerts[-500:]


    save_compressed_json(

        ALERTS_PATH,

        alerts

    )


def get_alerts():

    return load_compressed_json(

        ALERTS_PATH,

        []

    )


# ============================================================
# TRAVEL SAFETY ENGINE
# ============================================================

def analyze_travel_safety(risk):

    level = risk.get(
        "risk_level"
    )


    if level == "VERY HIGH":

        return {

            "safe_to_travel": False,

            "recommendation":

                "Do not travel through landslide-prone areas."

        }


    elif level == "HIGH":

        return {

            "safe_to_travel": False,

            "recommendation":

                "Avoid unnecessary travel. Consider postponing your journey."

        }


    elif level == "MODERATE":

        return {

            "safe_to_travel": True,

            "recommendation":

                "Travel carefully and remain alert for changing conditions."

        }


    return {

        "safe_to_travel": True,

        "recommendation":

            "Current conditions indicate relatively low landslide risk."

    }


# ============================================================
# HISTORICAL DATA ANALYSIS
# ============================================================

def analyze_history():

    history = get_prediction_history()


    if not history:

        return {

            "total_predictions": 0,

            "message":

                "No offline history available."

        }


    scores = []


    for item in history:

        if "risk_score" in item:

            scores.append(
                float(
                    item["risk_score"]
                )
            )


    if not scores:

        return {

            "total_predictions":

                len(history),

            "message":

                "No valid risk scores available."

        }


    average_risk = sum(
        scores
    ) / len(scores)


    highest_risk = max(
        scores
    )


    lowest_risk = min(
        scores
    )


    return {

        "total_predictions":

            len(history),

        "average_risk":

            round(

                average_risk,

                2

            ),

        "highest_risk":

            highest_risk,

        "lowest_risk":

            lowest_risk

    }


# ============================================================
# DATA COMPRESSION INFORMATION
# ============================================================

def get_storage_info():

    files = [

        HISTORY_PATH,

        ALERTS_PATH,

        KNOWLEDGE_PATH

    ]


    total_size = 0


    information = {}


    for path in files:

        if os.path.exists(path):

            size = os.path.getsize(
                path
            )


            information[
                os.path.basename(path)
            ] = size


            total_size += size


    return {

        "files":

            information,

        "total_bytes":

            total_size,

        "total_kb":

            round(

                total_size / 1024,

                2

            )

    }


# ============================================================
# COMPLETE LANDSLIDE PROCESSING ENGINE
# ============================================================

def process_landslide_data(

    rainfall,

    slope,

    soil_moisture

):

    # --------------------------------------------------------
    # 1. AI PREDICTION
    # --------------------------------------------------------

    risk = calculate_risk(

        rainfall,

        slope,

        soil_moisture

    )


    # --------------------------------------------------------
    # 2. ALERT
    # --------------------------------------------------------

    alert = generate_alert(
        risk
    )


    # --------------------------------------------------------
    # 3. NOTIFICATION
    # --------------------------------------------------------

    notification = create_notification(
        risk
    )


    # --------------------------------------------------------
    # 4. TRAVEL SAFETY
    # --------------------------------------------------------

    travel = analyze_travel_safety(
        risk
    )


    # --------------------------------------------------------
    # 5. SAVE HISTORY
    # --------------------------------------------------------

    save_prediction_history(
        risk
    )


    # --------------------------------------------------------
    # 6. SAVE ALERT
    # --------------------------------------------------------

    if alert["alert"]:

        save_alert({

            **risk,

            **alert

        })


    # --------------------------------------------------------
    # COMPLETE RESULT
    # --------------------------------------------------------

    return {

        "success": True,

        "risk": risk,

        "alert": alert,

        "notification": notification,

        "travel_safety": travel

    }


# ============================================================
# AI STATUS
# ============================================================

def get_ai_status():

    model_exists = os.path.exists(
        MODEL_PATH
    )


    history = get_prediction_history()


    alerts = get_alerts()


    return {

        "ai_name":

            "Offline Landslide Intelligence Engine",

        "model_available":

            model_exists,

        "offline_mode":

            True,

        "total_predictions":

            len(history),

        "total_alerts":

            len(alerts),

        "storage":

            get_storage_info()

    }


# ============================================================
# COMPLETE USER REQUEST PROCESSOR
# ============================================================

def process_user_request(

    message=None,

    rainfall=None,

    slope=None,

    soil_moisture=None

):

    # --------------------------------------------------------
    # CHAT REQUEST
    # --------------------------------------------------------

    if message:

        latest_risk = None


        history = get_prediction_history()


        if history:

            latest_risk = history[-1]


        return {

            "type":

                "chat",

            "response":

                chat(

                    message,

                    latest_risk

                )

        }


    # --------------------------------------------------------
    # LANDSLIDE ANALYSIS
    # --------------------------------------------------------

    if (

        rainfall is not None

        and slope is not None

        and soil_moisture is not None

    ):

        return {

            "type":

                "analysis",

            "response":

                process_landslide_data(

                    rainfall,

                    slope,

                    soil_moisture

                )

        }


    return {

        "success": False,

        "error":

            "Provide either a message or rainfall, slope and soil_moisture."

    }


# ============================================================
# COMMAND LINE TEST SYSTEM
# ============================================================

def run_demo():

    print("\n")

    print("=" * 65)

    print("LANDSLIDE INTELLIGENCE ENGINE")

    print("OFFLINE AI + CHAT + RISK + ALERT SYSTEM")

    print("=" * 65)


    # --------------------------------------------------------
    # AI STATUS
    # --------------------------------------------------------

    print("\nAI STATUS:\n")


    try:

        status = get_ai_status()


        for key, value in status.items():

            print(

                f"{key}: {value}"

            )

    except Exception as error:

        print(

            "Status error:",

            error

        )


    # --------------------------------------------------------
    # CHAT DEMO
    # --------------------------------------------------------

    print("\n" + "-" * 65)

    print("CHATBOT DEMO")

    print("-" * 65)


    questions = [

        "What causes landslides?",

        "What are the warning signs?",

        "Is it safe to travel?"

    ]


    for question in questions:

        response = chat(
            question
        )


        print(

            f"\nUser: {question}"

        )


        print(

            f"AI: {response['answer']}"

        )


    # --------------------------------------------------------
    # RISK ANALYSIS DEMO
    # --------------------------------------------------------

    print("\n" + "-" * 65)

    print("LANDSLIDE RISK ANALYSIS")

    print("-" * 65)


    try:

        result = process_landslide_data(

            rainfall=180,

            slope=35,

            soil_moisture=85

        )


        print(
            "\nRESULT:\n"
        )


        for key, value in result.items():

            print(

                f"{key}:"

            )

            print(
                value
            )


    except Exception as error:

        print(

            "\nAI analysis error:"

        )

        print(
            error
        )


    print("\n" + "=" * 65)

    print("SYSTEM DEMO FINISHED")

    print("=" * 65)

# ============================================================
# ADVANCED ENVIRONMENTAL ANALYSIS
# ============================================================

def analyze_rainfall(rainfall):

    rainfall = float(rainfall)


    if rainfall < 20:

        level = "LOW"

        description = (
            "Rainfall is currently low and is unlikely to "
            "significantly increase landslide risk."
        )


    elif rainfall < 50:

        level = "MODERATE"

        description = (
            "Moderate rainfall is present. Continue monitoring "
            "conditions in landslide-prone areas."
        )


    elif rainfall < 100:

        level = "HIGH"

        description = (
            "Heavy rainfall may increase soil saturation and "
            "landslide probability."
        )


    else:

        level = "VERY HIGH"

        description = (
            "Extremely heavy rainfall detected. Soil saturation "
            "may significantly increase landslide risk."
        )


    return {

        "rainfall": rainfall,

        "level": level,

        "description": description

    }


# ============================================================
# ADVANCED SLOPE ANALYSIS
# ============================================================

def analyze_slope(slope):

    slope = float(slope)


    if slope < 10:

        level = "LOW"

        description = (
            "The slope is relatively gentle."
        )


    elif slope < 20:

        level = "MODERATE"

        description = (
            "The slope has moderate steepness."
        )


    elif slope < 35:

        level = "HIGH"

        description = (
            "The slope is steep and may increase landslide risk."
        )


    else:

        level = "VERY HIGH"

        description = (
            "The slope is extremely steep and vulnerable to "
            "land movement."
        )


    return {

        "slope": slope,

        "level": level,

        "description": description

    }


# ============================================================
# SOIL MOISTURE ANALYSIS
# ============================================================

def analyze_soil_moisture(soil_moisture):

    soil_moisture = float(soil_moisture)


    if soil_moisture < 30:

        level = "LOW"

        description = (
            "Soil moisture is low."
        )


    elif soil_moisture < 60:

        level = "MODERATE"

        description = (
            "Soil moisture is moderate."
        )


    elif soil_moisture < 80:

        level = "HIGH"

        description = (
            "High soil moisture may reduce slope stability."
        )


    else:

        level = "VERY HIGH"

        description = (
            "Very high soil moisture detected. The soil may be "
            "saturated and unstable."
        )


    return {

        "soil_moisture": soil_moisture,

        "level": level,

        "description": description

    }


# ============================================================
# COMPLETE ENVIRONMENT ANALYSIS
# ============================================================

def analyze_environment(

    rainfall,

    slope,

    soil_moisture

):

    rainfall_result = analyze_rainfall(
        rainfall
    )


    slope_result = analyze_slope(
        slope
    )


    moisture_result = analyze_soil_moisture(
        soil_moisture
    )


    return {

        "rainfall_analysis":

            rainfall_result,

        "slope_analysis":

            slope_result,

        "soil_analysis":

            moisture_result

    }


# ============================================================
# RISK EXPLANATION ENGINE
# ============================================================

def explain_risk(risk):

    explanations = []


    rainfall = risk.get(
        "rainfall",
        0
    )


    slope = risk.get(
        "slope",
        0
    )


    soil_moisture = risk.get(
        "soil_moisture",
        0
    )


    if rainfall >= 100:

        explanations.append(
            "Extremely heavy rainfall is increasing soil saturation."
        )


    elif rainfall >= 50:

        explanations.append(
            "Heavy rainfall is contributing to landslide risk."
        )


    if slope >= 35:

        explanations.append(
            "The terrain has a very steep slope."
        )


    elif slope >= 20:

        explanations.append(
            "The slope steepness is contributing to instability."
        )


    if soil_moisture >= 80:

        explanations.append(
            "The soil appears highly saturated."
        )


    elif soil_moisture >= 60:

        explanations.append(
            "High soil moisture may reduce slope stability."
        )


    if not explanations:

        explanations.append(
            "Current environmental indicators show relatively "
            "stable conditions."
        )


    return explanations


# ============================================================
# AI SAFETY RECOMMENDATION ENGINE
# ============================================================

def generate_recommendations(risk):

    level = risk.get(
        "risk_level",
        "UNKNOWN"
    )


    recommendations = []


    if level == "VERY HIGH":

        recommendations.extend([

            "Avoid travelling through landslide-prone areas.",

            "Stay away from steep slopes.",

            "Monitor official emergency announcements.",

            "Prepare an emergency kit.",

            "Move to a safer location if authorities advise evacuation."

        ])


    elif level == "HIGH":

        recommendations.extend([

            "Avoid unnecessary travel.",

            "Stay alert for cracks, falling rocks, or unusual sounds.",

            "Avoid parking near unstable slopes.",

            "Monitor rainfall and local warnings."

        ])


    elif level == "MODERATE":

        recommendations.extend([

            "Remain alert to changing weather conditions.",

            "Monitor rainfall in your area.",

            "Avoid risky routes if rainfall increases."

        ])


    else:

        recommendations.extend([

            "Current risk appears relatively low.",

            "Continue monitoring weather conditions.",

            "Stay aware when travelling through mountainous areas."

        ])


    return recommendations


# ============================================================
# EMERGENCY GUIDE
# ============================================================

def emergency_guide():

    return {

        "during_landslide": [

            "Move away from the landslide path immediately.",

            "Do not stay near river valleys or unstable slopes.",

            "Protect your head from falling debris.",

            "Follow official emergency instructions."

        ],

        "if_travelling": [

            "Do not drive through falling debris.",

            "Turn around if the road is blocked.",

            "Avoid bridges near unstable areas.",

            "Do not attempt to cross a landslide."

        ],

        "after_landslide": [

            "Stay away from the affected area.",

            "Watch for secondary landslides.",

            "Avoid damaged roads and structures.",

            "Follow instructions from emergency authorities."

        ]

    }


# ============================================================
# RISK TREND ANALYSIS
# ============================================================

def analyze_risk_trend():

    history = get_prediction_history()


    if len(history) < 2:

        return {

            "trend": "UNKNOWN",

            "message":

                "Not enough historical data to determine a trend."

        }


    recent = history[-5:]


    scores = [

        item.get(
            "risk_score",
            0
        )

        for item in recent

    ]


    first_score = scores[0]

    last_score = scores[-1]


    difference = last_score - first_score


    if difference > 10:

        trend = "INCREASING"

        message = (
            "Landslide risk appears to be increasing."
        )


    elif difference < -10:

        trend = "DECREASING"

        message = (
            "Landslide risk appears to be decreasing."
        )


    else:

        trend = "STABLE"

        message = (
            "Landslide risk appears relatively stable."
        )


    return {

        "trend": trend,

        "message": message,

        "recent_scores": scores

    }


# ============================================================
# LOCATION RECORD SYSTEM
# ============================================================

LOCATION_HISTORY_PATH = os.path.join(

    AI_DATA_DIR,

    "location_history.json.gz"

)


def save_location_prediction(

    location,

    result

):

    records = load_compressed_json(

        LOCATION_HISTORY_PATH,

        []

    )


    record = {

        "location": location,

        "timestamp":

            datetime.now().isoformat(),

        "result": result

    }


    records.append(
        record
    )


    records = records[-1000:]


    save_compressed_json(

        LOCATION_HISTORY_PATH,

        records

    )


    return record


# ============================================================
# SEARCH LOCATION HISTORY
# ============================================================

def get_location_history(location):

    records = load_compressed_json(

        LOCATION_HISTORY_PATH,

        []

    )


    location = str(
        location
    ).lower()


    results = []


    for record in records:

        record_location = str(

            record.get(
                "location",
                ""
            )

        ).lower()


        if location in record_location:

            results.append(
                record
            )


    return results


# ============================================================
# RISK STATISTICS
# ============================================================

def calculate_risk_statistics():

    history = get_prediction_history()


    if not history:

        return {

            "total": 0,

            "low": 0,

            "moderate": 0,

            "high": 0,

            "very_high": 0

        }


    statistics = {

        "total":

            len(history),

        "low": 0,

        "moderate": 0,

        "high": 0,

        "very_high": 0

    }


    for record in history:

        level = record.get(
            "risk_level",
            ""
        )


        if level == "LOW":

            statistics["low"] += 1


        elif level == "MODERATE":

            statistics["moderate"] += 1


        elif level == "HIGH":

            statistics["high"] += 1


        elif level == "VERY HIGH":

            statistics["very_high"] += 1


    return statistics


# ============================================================
# COMPARE TWO LOCATIONS
# ============================================================

def compare_locations(

    location_one,

    location_one_risk,

    location_two,

    location_two_risk

):

    score_one = float(

        location_one_risk.get(
            "risk_score",
            0
        )

    )


    score_two = float(

        location_two_risk.get(
            "risk_score",
            0
        )

    )


    if score_one > score_two:

        safer_location = location_two

        dangerous_location = location_one


    elif score_two > score_one:

        safer_location = location_one

        dangerous_location = location_two


    else:

        safer_location = "Both locations"

        dangerous_location = "Both locations have equal risk"


    return {

        "location_one": location_one,

        "location_one_score": score_one,

        "location_two": location_two,

        "location_two_score": score_two,

        "safer_location": safer_location,

        "higher_risk_location": dangerous_location

    }


# ============================================================
# DAILY REPORT GENERATOR
# ============================================================

def generate_daily_report():

    history = get_prediction_history()


    today = datetime.now().date()


    today_records = []


    for record in history:

        try:

            timestamp = record.get(
                "timestamp"
            )


            record_date = datetime.fromisoformat(
                timestamp
            ).date()


            if record_date == today:

                today_records.append(
                    record
                )


        except Exception:

            continue


    if not today_records:

        return {

            "date": str(today),

            "total_predictions": 0,

            "message":

                "No predictions recorded today."

        }


    scores = [

        record.get(
            "risk_score",
            0
        )

        for record in today_records

    ]


    return {

        "date": str(today),

        "total_predictions":

            len(today_records),

        "average_risk":

            round(

                sum(scores) / len(scores),

                2

            ),

        "highest_risk":

            max(scores),

        "lowest_risk":

            min(scores)

    }


# ============================================================
# DATA CLEANUP SYSTEM
# ============================================================

def cleanup_old_history(max_records=1000):

    history = get_prediction_history()


    if len(history) > max_records:

        history = history[-max_records:]


        save_compressed_json(

            HISTORY_PATH,

            history

        )


    return {

        "remaining_records":

            len(history)

    }


# ============================================================
# ADVANCED FULL ANALYSIS
# ============================================================

def advanced_landslide_analysis(

    rainfall,

    slope,

    soil_moisture,

    location=None

):

    # Core AI prediction

    result = process_landslide_data(

        rainfall,

        slope,

        soil_moisture

    )


    risk = result["risk"]


    # Environmental analysis

    environment = analyze_environment(

        rainfall,

        slope,

        soil_moisture

    )


    # Explain risk

    explanation = explain_risk(
        risk
    )


    # Generate recommendations

    recommendations = generate_recommendations(
        risk
    )


    # Get trend

    trend = analyze_risk_trend()


    # Statistics

    statistics = calculate_risk_statistics()


    # Build complete response

    complete_result = {

        "success": True,

        "location": location,

        "risk":

            risk,

        "environment":

            environment,

        "risk_explanation":

            explanation,

        "recommendations":

            recommendations,

        "alert":

            result["alert"],

        "notification":

            result["notification"],

        "travel_safety":

            result["travel_safety"],

        "trend":

            trend,

        "statistics":

            statistics

    }


    # Save location data

    if location:

        save_location_prediction(

            location,

            complete_result

        )


    return complete_result


# ============================================================
# ADVANCED AI SUMMARY
# ============================================================

def generate_ai_summary(result):

    risk = result.get(
        "risk",
        {}
    )


    level = risk.get(
        "risk_level",
        "UNKNOWN"
    )


    score = risk.get(
        "risk_score",
        0
    )


    summary = (

        f"The current analyzed landslide risk is "

        f"{level} with an estimated risk score of "

        f"{score}%."

    )


    explanations = result.get(

        "risk_explanation",

        []

    )


    if explanations:

        summary += " "

        summary += " ".join(
            explanations
        )


    return summary


# ============================================================
# EXTENDED AI STATUS
# ============================================================

def get_advanced_ai_status():

    basic_status = get_ai_status()


    basic_status.update({

        "environment_analysis":

            True,

        "risk_explanation":

            True,

        "recommendation_engine":

            True,

        "trend_analysis":

            True,

        "location_tracking":

            True,

        "daily_reports":

            True,

        "offline_storage":

            True,

        "compressed_data":

            True

    })


    return basic_status

# ============================================================
# LANDSLIDE INTELLIGENCE ENGINE - ADVANCED EXTENSION
# ============================================================
#
# FEATURES:
#
# 📍 MULTI-LOCATION INTELLIGENCE
# 🗺️ SMART RISK MAP DATA
# 🚗 ROUTE SAFETY ANALYSIS
# 🌧️ RAINFALL TREND ANALYSIS
# 📈 RISK FORECASTING
# 🔍 ANOMALY DETECTION
# 🧠 EXPLAINABLE AI
# 🎯 CONFIDENCE SCORING
# 📡 SENSOR DATA SIMULATION
# 📴 OFFLINE CACHE
# 🌐 ONLINE/OFFLINE HYBRID MODE
# 🚨 SMART ALERT PRIORITIZATION
# 🔕 NOTIFICATION SPAM PREVENTION
# 📊 AREA COMPARISON
# 🏆 RISK RANKING
#
# ============================================================


import math
import random
import statistics
from collections import Counter


# ============================================================
# ADVANCED STORAGE PATHS
# ============================================================

LOCATION_DATABASE_PATH = os.path.join(
    AI_DATA_DIR,
    "locations.json.gz"
)


ROUTE_HISTORY_PATH = os.path.join(
    AI_DATA_DIR,
    "route_history.json.gz"
)


SENSOR_HISTORY_PATH = os.path.join(
    AI_DATA_DIR,
    "sensor_history.json.gz"
)


NOTIFICATION_HISTORY_PATH = os.path.join(
    AI_DATA_DIR,
    "notification_history.json.gz"
)


MODEL_FEEDBACK_PATH = os.path.join(
    AI_DATA_DIR,
    "model_feedback.json.gz"
)


OFFLINE_CACHE_PATH = os.path.join(
    AI_DATA_DIR,
    "offline_cache.json.gz"
)


# ============================================================
# LOCATION DATABASE
# ============================================================

DEFAULT_LOCATIONS = [

    {
        "name": "Guwahati",
        "state": "Assam",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "elevation": 55
    },

    {
        "name": "Diyun",
        "state": "Arunachal Pradesh",
        "latitude": 27.052,
        "longitude": 95.933,
        "elevation": 145
    },

    {
        "name": "Tawang",
        "state": "Arunachal Pradesh",
        "latitude": 27.586,
        "longitude": 91.859,
        "elevation": 2669
    },

    {
        "name": "Itanagar",
        "state": "Arunachal Pradesh",
        "latitude": 27.084,
        "longitude": 93.617,
        "elevation": 350
    },

    {
        "name": "Shillong",
        "state": "Meghalaya",
        "latitude": 25.5788,
        "longitude": 91.8933,
        "elevation": 1496
    }

]


def initialize_location_database():

    if not os.path.exists(LOCATION_DATABASE_PATH):

        save_compressed_json(
            LOCATION_DATABASE_PATH,
            DEFAULT_LOCATIONS
        )


def get_all_locations():

    initialize_location_database()

    return load_compressed_json(
        LOCATION_DATABASE_PATH,
        DEFAULT_LOCATIONS
    )


def add_location(

    name,
    state,
    latitude,
    longitude,
    elevation=0

):

    locations = get_all_locations()


    location = {

        "name": str(name),

        "state": str(state),

        "latitude": float(latitude),

        "longitude": float(longitude),

        "elevation": float(elevation)

    }


    locations.append(location)


    save_compressed_json(
        LOCATION_DATABASE_PATH,
        locations
    )


    return location


def find_location(name):

    locations = get_all_locations()


    name = str(name).lower().strip()


    for location in locations:

        if location["name"].lower() == name:

            return location


    for location in locations:

        if name in location["name"].lower():

            return location


    return None


# ============================================================
# HAVERSINE DISTANCE CALCULATOR
# ============================================================

def calculate_distance(

    latitude_one,
    longitude_one,
    latitude_two,
    longitude_two

):

    earth_radius = 6371


    lat_one = math.radians(
        float(latitude_one)
    )


    lon_one = math.radians(
        float(longitude_one)
    )


    lat_two = math.radians(
        float(latitude_two)
    )


    lon_two = math.radians(
        float(longitude_two)
    )


    latitude_difference = lat_two - lat_one


    longitude_difference = lon_two - lon_one


    a = (

        math.sin(
            latitude_difference / 2
        ) ** 2

        +

        math.cos(lat_one)

        *

        math.cos(lat_two)

        *

        math.sin(
            longitude_difference / 2
        ) ** 2

    )


    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )


    return round(
        earth_radius * c,
        2
    )


# ============================================================
# RAINFALL TREND ANALYSIS
# ============================================================

def analyze_rainfall_trend(rainfall_values):

    if not rainfall_values:

        return {

            "trend": "UNKNOWN",

            "message":

                "No rainfall data available."

        }


    values = [

        float(value)

        for value in rainfall_values

    ]


    if len(values) == 1:

        return {

            "trend": "UNKNOWN",

            "message":

                "More rainfall data is needed."

        }


    first_value = values[0]


    last_value = values[-1]


    difference = last_value - first_value


    average = sum(values) / len(values)


    if difference > 20:

        trend = "INCREASING"

        message = (
            "Rainfall is increasing and may increase landslide risk."
        )


    elif difference < -20:

        trend = "DECREASING"

        message = (
            "Rainfall intensity appears to be decreasing."
        )


    else:

        trend = "STABLE"

        message = (
            "Rainfall levels appear relatively stable."
        )


    return {

        "trend": trend,

        "average_rainfall":

            round(average, 2),

        "first_value":

            first_value,

        "latest_value":

            last_value,

        "change":

            round(difference, 2),

        "message":

            message

    }


# ============================================================
# CUMULATIVE RAINFALL ANALYSIS
# ============================================================

def calculate_cumulative_rainfall(

    rainfall_values

):

    if not rainfall_values:

        return {

            "total": 0,

            "average": 0,

            "maximum": 0

        }


    values = [

        float(value)

        for value in rainfall_values

    ]


    return {

        "total":

            round(sum(values), 2),

        "average":

            round(

                sum(values) / len(values),

                2

            ),

        "maximum":

            max(values),

        "minimum":

            min(values)

    }


# ============================================================
# RAINFALL DANGER INDEX
# ============================================================

def calculate_rainfall_danger_index(

    rainfall_values

):

    data = calculate_cumulative_rainfall(
        rainfall_values
    )


    total = data["total"]


    maximum = data["maximum"]


    score = 0


    # Total accumulated rainfall

    if total >= 500:

        score += 50


    elif total >= 300:

        score += 40


    elif total >= 150:

        score += 25


    elif total >= 50:

        score += 10


    # Maximum rainfall intensity

    if maximum >= 150:

        score += 50


    elif maximum >= 100:

        score += 35


    elif maximum >= 50:

        score += 20


    score = min(score, 100)


    return {

        "danger_score": score,

        "rainfall_data": data

    }


# ============================================================
# Z-SCORE ANOMALY DETECTION
# ============================================================

def detect_anomaly(values, current_value):

    if not values:

        return {

            "anomaly": False,

            "reason":

                "Not enough historical data."

        }


    values = [

        float(value)

        for value in values

    ]


    current_value = float(
        current_value
    )


    if len(values) < 3:

        average = sum(values) / len(values)


        difference = abs(
            current_value - average
        )


        return {

            "anomaly":

                difference > average * 0.75

                if average > 0

                else False,

            "difference":

                difference,

            "reason":

                "Basic deviation analysis."

        }


    average = statistics.mean(
        values
    )


    deviation = statistics.stdev(
        values
    )


    if deviation == 0:

        return {

            "anomaly": False,

            "z_score": 0,

            "reason":

                "Historical values are identical."

        }


    z_score = (

        current_value - average

    ) / deviation


    anomaly = abs(z_score) > 2.5


    return {

        "anomaly": anomaly,

        "z_score":

            round(z_score, 2),

        "average":

            round(average, 2),

        "reason":

            "Unusual environmental value detected."

            if anomaly

            else

            "Value is within the normal range."

    }


# ============================================================
# MULTI-FACTOR ANOMALY ANALYSIS
# ============================================================

def analyze_environmental_anomalies(

    rainfall_history,

    moisture_history,

    current_rainfall,

    current_moisture

):

    rainfall_anomaly = detect_anomaly(

        rainfall_history,

        current_rainfall

    )


    moisture_anomaly = detect_anomaly(

        moisture_history,

        current_moisture

    )


    anomalies = []


    if rainfall_anomaly.get("anomaly"):

        anomalies.append(
            "UNUSUAL RAINFALL DETECTED"
        )


    if moisture_anomaly.get("anomaly"):

        anomalies.append(
            "UNUSUAL SOIL MOISTURE DETECTED"
        )


    return {

        "anomaly_detected":

            len(anomalies) > 0,

        "anomalies":

            anomalies,

        "rainfall":

            rainfall_anomaly,

        "soil_moisture":

            moisture_anomaly

    }


# ============================================================
# AI CONFIDENCE ENGINE
# ============================================================

def calculate_ai_confidence(

    risk_result

):

    probability = float(

        risk_result.get(
            "risk_score",
            50
        )

    )


    # Predictions near 0 or 100 generally have
    # stronger model separation than values near 50.
    #
    # This is a heuristic confidence score,
    # not a calibrated scientific confidence interval.

    distance_from_middle = abs(
        probability - 50
    )


    confidence = 50 + distance_from_middle


    confidence = min(
        confidence,
        95
    )


    return {

        "confidence":

            round(confidence, 2),

        "confidence_level":

            get_confidence_level(
                confidence
            )

    }


def get_confidence_level(confidence):

    if confidence >= 85:

        return "VERY HIGH"


    if confidence >= 70:

        return "HIGH"


    if confidence >= 55:

        return "MODERATE"


    return "LOW"


# ============================================================
# EXPLAINABLE AI ENGINE
# ============================================================

def generate_feature_contributions(

    rainfall,

    slope,

    soil_moisture

):

    rainfall = float(rainfall)

    slope = float(slope)

    soil_moisture = float(
        soil_moisture
    )


    rainfall_score = min(

        rainfall / 200 * 100,

        100

    )


    slope_score = min(

        slope / 45 * 100,

        100

    )


    moisture_score = min(

        soil_moisture,

        100

    )


    weighted_rainfall = (
        rainfall_score * 0.40
    )


    weighted_slope = (
        slope_score * 0.30
    )


    weighted_moisture = (
        moisture_score * 0.30
    )


    return {

        "rainfall": {

            "raw_score":

                round(rainfall_score, 2),

            "contribution":

                round(
                    weighted_rainfall,
                    2
                )

        },

        "slope": {

            "raw_score":

                round(slope_score, 2),

            "contribution":

                round(
                    weighted_slope,
                    2
                )

        },

        "soil_moisture": {

            "raw_score":

                round(moisture_score, 2),

            "contribution":

                round(
                    weighted_moisture,
                    2
                )

        }

    }


def generate_xai_explanation(

    rainfall,

    slope,

    soil_moisture

):

    contributions = generate_feature_contributions(

        rainfall,

        slope,

        soil_moisture

    )


    ranked = []


    for feature, data in contributions.items():

        ranked.append({

            "feature": feature,

            "contribution":

                data["contribution"]

        })


    ranked.sort(

        key=lambda item:

            item["contribution"],

        reverse=True

    )


    explanations = []


    for item in ranked:

        feature = item["feature"]


        contribution = item["contribution"]


        if feature == "rainfall":

            text = (

                f"Rainfall contributed approximately "

                f"{contribution}% to the environmental risk index."

            )


        elif feature == "slope":

            text = (

                f"Slope steepness contributed approximately "

                f"{contribution}% to the environmental risk index."

            )


        else:

            text = (

                f"Soil moisture contributed approximately "

                f"{contribution}% to the environmental risk index."

            )


        explanations.append(text)


    return {

        "feature_contributions":

            contributions,

        "explanations":

            explanations,

        "main_factor":

            ranked[0]["feature"]

    }


# ============================================================
# RISK FORECASTING ENGINE
# ============================================================

def forecast_risk(

    current_risk,

    rainfall_trend=None

):

    current_score = float(

        current_risk.get(
            "risk_score",
            0
        )

    )


    trend = "STABLE"


    if rainfall_trend:

        trend = rainfall_trend.get(
            "trend",
            "STABLE"
        )


    multiplier = 1.0


    if trend == "INCREASING":

        multiplier = 1.20


    elif trend == "DECREASING":

        multiplier = 0.85


    forecast_6 = min(

        current_score * multiplier,

        100

    )


    forecast_12 = min(

        forecast_6 * multiplier,

        100

    )


    forecast_24 = min(

        forecast_12 * multiplier,

        100

    )


    return {

        "current":

            round(current_score, 2),

        "next_6_hours":

            round(forecast_6, 2),

        "next_12_hours":

            round(forecast_12, 2),

        "next_24_hours":

            round(forecast_24, 2),

        "trend":

            trend,

        "note":

            "This is a prototype trend-based forecast and should not be treated as an official emergency forecast."

    }


# ============================================================
# SENSOR DATA SIMULATOR
# ============================================================

def simulate_sensor_data():

    rainfall = round(

        random.uniform(0, 200),

        2

    )


    soil_moisture = round(

        random.uniform(10, 100),

        2

    )


    temperature = round(

        random.uniform(15, 35),

        2

    )


    ground_movement = round(

        random.uniform(0, 10),

        2

    )


    timestamp = datetime.now().isoformat()


    return {

        "rainfall":

            rainfall,

        "soil_moisture":

            soil_moisture,

        "temperature":

            temperature,

        "ground_movement":

            ground_movement,

        "timestamp":

            timestamp

    }


# ============================================================
# SENSOR DATA STORAGE
# ============================================================

def save_sensor_data(sensor_data):

    history = load_compressed_json(

        SENSOR_HISTORY_PATH,

        []

    )


    history.append(
        sensor_data
    )


    history = history[-5000:]


    save_compressed_json(

        SENSOR_HISTORY_PATH,

        history

    )


    return sensor_data


def get_sensor_history():

    return load_compressed_json(

        SENSOR_HISTORY_PATH,

        []

    )


# ============================================================
# SENSOR HEALTH ANALYSIS
# ============================================================

def analyze_sensor_reading(sensor_data):

    warnings = []


    rainfall = float(

        sensor_data.get(
            "rainfall",
            0
        )

    )


    moisture = float(

        sensor_data.get(
            "soil_moisture",
            0
        )

    )


    movement = float(

        sensor_data.get(
            "ground_movement",
            0
        )

    )


    if rainfall > 150:

        warnings.append(
            "EXTREME RAINFALL"
        )


    if moisture > 90:

        warnings.append(
            "VERY HIGH SOIL MOISTURE"
        )


    if movement > 7:

        warnings.append(
            "UNUSUAL GROUND MOVEMENT"
        )


    return {

        "warning_count":

            len(warnings),

        "warnings":

            warnings,

        "dangerous":

            len(warnings) > 0

    }


# ============================================================
# SMART NOTIFICATION ENGINE
# ============================================================

def get_notification_history():

    return load_compressed_json(

        NOTIFICATION_HISTORY_PATH,

        []

    )


def should_send_notification(

    location,

    risk_level

):

    history = get_notification_history()


    if not history:

        return True


    recent = history[-20:]


    for notification in reversed(recent):

        if (

            notification.get("location")

            == location

            and

            notification.get("risk_level")

            == risk_level

        ):

            return False


    return True


def send_smart_notification(

    location,

    risk

):

    risk_level = risk.get(
        "risk_level"
    )


    allowed = should_send_notification(

        location,

        risk_level

    )


    if not allowed:

        return {

            "sent": False,

            "reason":

                "Duplicate notification prevented."

        }


    notification = {

        "location":

            location,

        "risk_level":

            risk_level,

        "risk_score":

            risk.get(
                "risk_score"
            ),

        "timestamp":

            datetime.now().isoformat(),

        "sent":

            True

    }


    history = get_notification_history()


    history.append(
        notification
    )


    history = history[-1000:]


    save_compressed_json(

        NOTIFICATION_HISTORY_PATH,

        history

    )


    return notification


# ============================================================
# MULTI LOCATION RISK ANALYSIS
# ============================================================

def analyze_multiple_locations(

    location_data

):

    results = []


    for location in location_data:

        try:

            result = advanced_landslide_analysis(

                rainfall=

                    location.get(
                        "rainfall",
                        0
                    ),

                slope=

                    location.get(
                        "slope",
                        0
                    ),

                soil_moisture=

                    location.get(
                        "soil_moisture",
                        0
                    ),

                location=

                    location.get(
                        "name"
                    )

            )


            results.append({

                "name":

                    location.get(
                        "name"
                    ),

                "latitude":

                    location.get(
                        "latitude"
                    ),

                "longitude":

                    location.get(
                        "longitude"
                    ),

                "risk":

                    result.get(
                        "risk"
                    )

            })


        except Exception as error:

            results.append({

                "name":

                    location.get(
                        "name",
                        "Unknown"
                    ),

                "error":

                    str(error)

            })


    return results


# ============================================================
# MAP MARKER GENERATOR
# ============================================================

def get_map_marker_color(

    risk_level

):

    colors = {

        "LOW":

            "#16a34a",

        "MODERATE":

            "#eab308",

        "HIGH":

            "#f97316",

        "VERY HIGH":

            "#dc2626"

    }


    return colors.get(

        risk_level,

        "#6b7280"

    )


def generate_risk_map_data(

    results

):

    markers = []


    for item in results:

        risk = item.get(
            "risk",
            {}
        )


        risk_level = risk.get(
            "risk_level",
            "UNKNOWN"
        )


        marker = {

            "name":

                item.get("name"),

            "latitude":

                item.get("latitude"),

            "longitude":

                item.get("longitude"),

            "risk_level":

                risk_level,

            "risk_score":

                risk.get(
                    "risk_score"
                ),

            "color":

                get_map_marker_color(
                    risk_level
                )

        }


        markers.append(
            marker
        )


    return markers


# ============================================================
# ROUTE SAFETY ENGINE
# ============================================================

def calculate_route_risk(

    route_locations

):

    if not route_locations:

        return {

            "success": False,

            "error":

                "No route locations provided."

        }


    scores = []


    dangerous_points = []


    for point in route_locations:

        risk = point.get(
            "risk",
            {}
        )


        score = float(

            risk.get(
                "risk_score",
                0
            )

        )


        scores.append(
            score
        )


        if score >= 50:

            dangerous_points.append({

                "location":

                    point.get(
                        "name"
                    ),

                "risk_level":

                    risk.get(
                        "risk_level"
                    ),

                "risk_score":

                    score

            })


    average_risk = (

        sum(scores) / len(scores)

    )


    maximum_risk = max(
        scores
    )


    if maximum_risk >= 75:

        route_level = "VERY HIGH"


    elif maximum_risk >= 50:

        route_level = "HIGH"


    elif average_risk >= 25:

        route_level = "MODERATE"


    else:

        route_level = "LOW"


    return {

        "success":

            True,

        "route_risk":

            route_level,

        "average_risk":

            round(

                average_risk,

                2

            ),

        "maximum_risk":

            maximum_risk,

        "dangerous_points":

            dangerous_points,

        "safe_to_travel":

            route_level

            in [

                "LOW",

                "MODERATE"

            ]

    }


# ============================================================
# ROUTE RECOMMENDATION ENGINE
# ============================================================

def generate_route_recommendation(

    route_analysis

):

    level = route_analysis.get(
        "route_risk"
    )


    dangerous = route_analysis.get(
        "dangerous_points",
        []
    )


    if level == "VERY HIGH":

        recommendation = (

            "Travel is strongly discouraged through this route. "

            "Consider postponing the journey or selecting another route."

        )


    elif level == "HIGH":

        recommendation = (

            "The route contains high-risk locations. "

            "Avoid unnecessary travel and check official road information."

        )


    elif level == "MODERATE":

        recommendation = (

            "Travel may be possible, but remain alert and monitor "

            "weather and road conditions."

        )


    else:

        recommendation = (

            "Current analyzed route conditions indicate relatively "

            "low landslide risk."

        )


    return {

        "recommendation":

            recommendation,

        "dangerous_locations":

            [

                point.get("location")

                for point in dangerous

            ]

    }


# ============================================================
# SAVE ROUTE HISTORY
# ============================================================

def save_route_analysis(

    route_name,

    route_analysis

):

    history = load_compressed_json(

        ROUTE_HISTORY_PATH,

        []

    )


    record = {

        "route":

            route_name,

        "analysis":

            route_analysis,

        "timestamp":

            datetime.now().isoformat()

    }


    history.append(
        record
    )


    history = history[-500:]


    save_compressed_json(

        ROUTE_HISTORY_PATH,

        history

    )


    return record


# ============================================================
# AREA RISK RANKING
# ============================================================

def rank_locations_by_risk(

    locations

):

    sorted_locations = sorted(

        locations,

        key=lambda item:

            float(

                item.get(
                    "risk",
                    {}
                ).get(
                    "risk_score",
                    0
                )

            ),

        reverse=True

    )


    ranking = []


    position = 1


    for location in sorted_locations:

        ranking.append({

            "rank":

                position,

            "location":

                location.get(
                    "name"
                ),

            "risk":

                location.get(
                    "risk"
                )

        })


        position += 1


    return ranking


# ============================================================
# RISK COMPARISON
# ============================================================

def compare_area_risk(

    first_area,

    second_area

):

    first_score = float(

        first_area.get(
            "risk",
            {}
        ).get(
            "risk_score",
            0
        )

    )


    second_score = float(

        second_area.get(
            "risk",
            {}
        ).get(
            "risk_score",
            0
        )

    )


    if first_score > second_score:

        higher_risk = first_area.get(
            "name"
        )


    elif second_score > first_score:

        higher_risk = second_area.get(
            "name"
        )


    else:

        higher_risk = "EQUAL"


    return {

        "first_area":

            first_area.get(
                "name"
            ),

        "first_score":

            first_score,

        "second_area":

            second_area.get(
                "name"
            ),

        "second_score":

            second_score,

        "higher_risk":

            higher_risk

    }


# ============================================================
# OFFLINE CACHE ENGINE
# ============================================================

def get_offline_cache():

    return load_compressed_json(

        OFFLINE_CACHE_PATH,

        {}

    )


def cache_data(

    key,

    data

):

    cache = get_offline_cache()


    cache[str(key)] = {

        "data":

            data,

        "timestamp":

            datetime.now().isoformat()

    }


    save_compressed_json(

        OFFLINE_CACHE_PATH,

        cache

    )


    return True


def get_cached_data(key):

    cache = get_offline_cache()


    return cache.get(
        str(key)
    )


# ============================================================
# NETWORK STATUS
# ============================================================

def get_system_mode(

    internet_available=False

):

    if internet_available:

        return {

            "mode":

                "ONLINE",

            "features": [

                "Live weather data",

                "Updated alerts",

                "Cloud synchronization",

                "Online location data"

            ]

        }


    return {

        "mode":

            "OFFLINE",

        "features": [

            "Local AI prediction",

            "Offline chatbot",

            "Stored history",

            "Cached location data",

            "Compressed storage"

        ]

    }


# ============================================================
# HYBRID AI ANALYSIS
# ============================================================

def hybrid_landslide_analysis(

    rainfall,

    slope,

    soil_moisture,

    location=None,

    internet_available=False

):

    mode = get_system_mode(

        internet_available
    )


    result = advanced_landslide_analysis(

        rainfall,

        slope,

        soil_moisture,

        location

    )


    cache_key = (

        f"{location}_latest"

        if location

        else

        "latest_analysis"

    )


    cache_data(

        cache_key,

        result

    )


    result["system_mode"] = mode


    return result


# ============================================================
# MODEL FEEDBACK SYSTEM
# ============================================================

def save_model_feedback(

    location,

    predicted_risk,

    actual_outcome

):

    feedback = load_compressed_json(

        MODEL_FEEDBACK_PATH,

        []

    )


    record = {

        "location":

            location,

        "predicted_risk":

            predicted_risk,

        "actual_outcome":

            actual_outcome,

        "timestamp":

            datetime.now().isoformat()

    }


    feedback.append(
        record
    )


    feedback = feedback[-5000:]


    save_compressed_json(

        MODEL_FEEDBACK_PATH,

        feedback

    )


    return record


# ============================================================
# MODEL PERFORMANCE ANALYSIS
# ============================================================

def analyze_model_feedback():

    feedback = load_compressed_json(

        MODEL_FEEDBACK_PATH,

        []

    )


    if not feedback:

        return {

            "records":

                0,

            "message":

                "No validated feedback available."

        }


    correct = 0


    total = 0


    for item in feedback:

        predicted = str(

            item.get(
                "predicted_risk",
                ""
            )

        ).upper()


        actual = str(

            item.get(
                "actual_outcome",
                ""
            )

        ).upper()


        if not predicted or not actual:

            continue


        total += 1


        if predicted == actual:

            correct += 1


    accuracy = (

        correct / total * 100

        if total > 0

        else 0

    )


    return {

        "records":

            total,

        "correct":

            correct,

        "accuracy":

            round(

                accuracy,

                2

            )

    }


# ============================================================
# EMERGENCY RISK ASSESSMENT
# ============================================================

def emergency_risk_assessment(

    risk,

    sensor_analysis=None

):

    level = risk.get(
        "risk_level",
        "LOW"
    )


    emergency = False


    reasons = []


    if level == "VERY HIGH":

        emergency = True

        reasons.append(
            "Very high predicted landslide risk."
        )


    if sensor_analysis:

        warnings = sensor_analysis.get(
            "warnings",
            []
        )


        if "UNUSUAL GROUND MOVEMENT" in warnings:

            emergency = True

            reasons.append(
                "Unusual ground movement detected."
            )


    if emergency:

        action = (

            "URGENT: Avoid vulnerable slopes and follow "

            "official emergency instructions."

        )


    else:

        action = (

            "Continue monitoring environmental conditions."

        )


    return {

        "emergency":

            emergency,

        "reasons":

            reasons,

        "recommended_action":

            action

    }


# ============================================================
# COMPLETE NEXT-GEN ANALYSIS
# ============================================================

def next_generation_landslide_analysis(

    rainfall,

    slope,

    soil_moisture,

    location=None,

    rainfall_history=None,

    moisture_history=None,

    internet_available=False

):

    # --------------------------------------------------------
    # DEFAULT HISTORICAL DATA
    # --------------------------------------------------------

    if rainfall_history is None:

        rainfall_history = []


    if moisture_history is None:

        moisture_history = []


    # --------------------------------------------------------
    # CORE HYBRID ANALYSIS
    # --------------------------------------------------------

    result = hybrid_landslide_analysis(

        rainfall,

        slope,

        soil_moisture,

        location,

        internet_available

    )


    risk = result.get(
        "risk",
        {}
    )


    # --------------------------------------------------------
    # RAINFALL TREND
    # --------------------------------------------------------

    rainfall_trend = analyze_rainfall_trend(

        rainfall_history + [rainfall]

    )


    # --------------------------------------------------------
    # RAINFALL DANGER
    # --------------------------------------------------------

    rainfall_danger = calculate_rainfall_danger_index(

        rainfall_history + [rainfall]

    )


    # --------------------------------------------------------
    # ANOMALIES
    # --------------------------------------------------------

    anomalies = analyze_environmental_anomalies(

        rainfall_history,

        moisture_history,

        rainfall,

        soil_moisture

    )


    # --------------------------------------------------------
    # CONFIDENCE
    # --------------------------------------------------------

    confidence = calculate_ai_confidence(

        risk

    )


    # --------------------------------------------------------
    # EXPLAINABLE AI
    # --------------------------------------------------------

    explanation = generate_xai_explanation(

        rainfall,

        slope,

        soil_moisture

    )


    # --------------------------------------------------------
    # FORECAST
    # --------------------------------------------------------

    forecast = forecast_risk(

        risk,

        rainfall_trend

    )


    # --------------------------------------------------------
    # NOTIFICATION
    # --------------------------------------------------------

    notification = None


    if location:

        notification = send_smart_notification(

            location,

            risk

        )


    # --------------------------------------------------------
    # FINAL RESULT
    # --------------------------------------------------------

    result.update({

        "rainfall_trend":

            rainfall_trend,

        "rainfall_danger":

            rainfall_danger,

        "anomaly_analysis":

            anomalies,

        "ai_confidence":

            confidence,

        "explainable_ai":

            explanation,

        "forecast":

            forecast,

        "smart_notification":

            notification

    })


    return result


# ============================================================
# DASHBOARD DATA ENGINE
# ============================================================

def generate_dashboard_data():

    history = get_prediction_history()


    statistics_data = calculate_risk_statistics()


    trend = analyze_risk_trend()


    storage = get_storage_info()


    sensor_history = get_sensor_history()


    latest_prediction = None


    if history:

        latest_prediction = history[-1]


    return {

        "latest_prediction":

            latest_prediction,

        "statistics":

            statistics_data,

        "risk_trend":

            trend,

        "storage":

            storage,

        "sensor_records":

            len(sensor_history),

        "system_status":

            get_advanced_ai_status()

    }


# ============================================================
# AI CAPABILITY REPORT
# ============================================================

def get_ai_capabilities():

    return {

        "ai_features": [

            "Machine learning landslide prediction",

            "Risk classification",

            "Offline chatbot",

            "Environmental analysis",

            "Rainfall trend analysis",

            "Risk forecasting",

            "Anomaly detection",

            "Explainable AI",

            "Confidence scoring",

            "Multi-location analysis",

            "Risk map generation",

            "Route safety analysis",

            "Sensor data analysis",

            "Offline storage",

            "Compressed data",

            "Smart notifications",

            "Hybrid online/offline architecture",

            "Historical analysis"

        ],

        "offline_support":

            True,

        "compressed_storage":

            True

    }


# ============================================================
# ADVANCED DEMO
# ============================================================

def run_advanced_demo():

    print("\n")

    print("=" * 70)

    print("NEXT GENERATION LANDSLIDE INTELLIGENCE ENGINE")

    print("=" * 70)


    rainfall_history = [

        20,

        30,

        45,

        70,

        95

    ]


    moisture_history = [

        40,

        45,

        50,

        55,

        60

    ]


    try:

        result = next_generation_landslide_analysis(

            rainfall=150,

            slope=35,

            soil_moisture=85,

            location="Diyun",

            rainfall_history=

                rainfall_history,

            moisture_history=

                moisture_history,

            internet_available=False

        )


        print("\nLOCATION:")

        print(
            result.get("location")
        )


        print("\nRISK:")

        print(
            result.get("risk")
        )


        print("\nFORECAST:")

        print(
            result.get("forecast")
        )


        print("\nAI CONFIDENCE:")

        print(
            result.get("ai_confidence")
        )


        print("\nEXPLAINABLE AI:")

        print(
            result.get("explainable_ai")
        )


        print("\nANOMALIES:")

        print(
            result.get("anomaly_analysis")
        )


    except Exception as error:

        print(

            "\nERROR:"

        )

        print(
            error
        )


    print("\n")

    print("=" * 70)

    print("ADVANCED SYSTEM READY")

    print("=" * 70)
    
# ============================================================
# LANDSLIDE SAFETY NETWORK EXTENSION
# COMMUNITY + TRAVEL + OFFLINE EMERGENCY + ALERT SYSTEM
# ============================================================

from collections import defaultdict


# ============================================================
# STORAGE FILES
# ============================================================

COMMUNITY_REPORTS_PATH = os.path.join(
    AI_DATA_DIR,
    "community_reports.json.gz"
)

USER_TRUST_PATH = os.path.join(
    AI_DATA_DIR,
    "user_trust.json.gz"
)

EMERGENCY_ALERTS_PATH = os.path.join(
    AI_DATA_DIR,
    "emergency_alerts.json.gz"
)

OFFLINE_SYNC_QUEUE_PATH = os.path.join(
    AI_DATA_DIR,
    "offline_sync_queue.json.gz"
)

SAFE_ZONES_PATH = os.path.join(
    AI_DATA_DIR,
    "verified_safe_zones.json.gz"
)

TRAVEL_HISTORY_ADVANCED_PATH = os.path.join(
    AI_DATA_DIR,
    "travel_history_advanced.json.gz"
)

DISASTER_EVENTS_PATH = os.path.join(
    AI_DATA_DIR,
    "disaster_events.json.gz"
)


# ============================================================
# COMMUNITY REPORT TYPES
# ============================================================

VALID_REPORT_TYPES = [

    "LANDSLIDE",

    "ROCKFALL",

    "ROAD_BLOCKAGE",

    "FLOOD",

    "FALLEN_TREE",

    "GROUND_CRACK",

    "MUDSLIDE",

    "OTHER"
]


# ============================================================
# COMMUNITY REPORT STORAGE
# ============================================================

def get_community_reports():

    return load_compressed_json(
        COMMUNITY_REPORTS_PATH,
        []
    )


def save_community_reports(reports):

    save_compressed_json(
        COMMUNITY_REPORTS_PATH,
        reports
    )


# ============================================================
# USER TRUST SYSTEM
# ============================================================

def get_all_user_trust():

    return load_compressed_json(
        USER_TRUST_PATH,
        {}
    )


def get_user_trust(user_id):

    users = get_all_user_trust()

    user_id = str(user_id)

    if user_id not in users:

        users[user_id] = {

            "trust_score": 50,

            "verified_reports": 0,

            "false_reports": 0,

            "total_reports": 0

        }

        save_compressed_json(
            USER_TRUST_PATH,
            users
        )

    return users[user_id]


def update_user_trust(

    user_id,

    verified=True

):

    users = get_all_user_trust()

    user_id = str(user_id)


    if user_id not in users:

        users[user_id] = {

            "trust_score": 50,

            "verified_reports": 0,

            "false_reports": 0,

            "total_reports": 0

        }


    user = users[user_id]


    if verified:

        user["trust_score"] += 5

        user["verified_reports"] += 1

    else:

        user["trust_score"] -= 10

        user["false_reports"] += 1


    user["trust_score"] = max(
        0,
        min(
            100,
            user["trust_score"]
        )
    )


    save_compressed_json(
        USER_TRUST_PATH,
        users
    )


    return user


# ============================================================
# TRUST LEVEL
# ============================================================

def get_trust_level(score):

    score = float(score)


    if score >= 80:

        return "HIGHLY TRUSTED"

    elif score >= 60:

        return "TRUSTED"

    elif score >= 40:

        return "NORMAL"

    elif score >= 20:

        return "LOW TRUST"

    return "UNTRUSTED"


# ============================================================
# CREATE COMMUNITY REPORT
# ============================================================

def create_community_report(

    user_id,

    report_type,

    latitude,

    longitude,

    description="",

    image_reference=None

):

    report_type = str(
        report_type
    ).upper()


    if report_type not in VALID_REPORT_TYPES:

        return {

            "success": False,

            "error":

                "Invalid report type."

        }


    trust = get_user_trust(
        user_id
    )


    report = {

        "report_id":

            f"REP_{datetime.now().strftime('%Y%m%d%H%M%S%f')}",

        "user_id":

            str(user_id),

        "report_type":

            report_type,

        "latitude":

            float(latitude),

        "longitude":

            float(longitude),

        "description":

            str(description),

        "image_reference":

            image_reference,

        "timestamp":

            datetime.now().isoformat(),

        "trust_score":

            trust["trust_score"],

        "trust_level":

            get_trust_level(
                trust["trust_score"]
            ),

        "verification_status":

            "PENDING",

        "upvotes":

            0,

        "downvotes":

            0

    }


    reports = get_community_reports()

    reports.append(
        report
    )


    save_community_reports(
        reports
    )


    return {

        "success": True,

        "report": report

    }


# ============================================================
# FIND NEARBY REPORTS
# ============================================================

def find_nearby_reports(

    latitude,

    longitude,

    radius_km=10

):

    reports = get_community_reports()

    nearby = []


    for report in reports:

        distance = calculate_distance(

            latitude,

            longitude,

            report["latitude"],

            report["longitude"]

        )


        if distance <= radius_km:

            report_copy = dict(report)

            report_copy["distance_km"] = distance

            nearby.append(
                report_copy
            )


    nearby.sort(

        key=lambda item:

            item["distance_km"]

    )


    return nearby


# ============================================================
# DUPLICATE REPORT DETECTION
# ============================================================

def detect_duplicate_report(

    report_type,

    latitude,

    longitude,

    radius_km=1

):

    nearby = find_nearby_reports(

        latitude,

        longitude,

        radius_km

    )


    report_type = str(
        report_type
    ).upper()


    duplicates = []


    for report in nearby:

        if (

            report.get("report_type")

            == report_type

        ):

            duplicates.append(
                report
            )


    return {

        "duplicate_detected":

            len(duplicates) > 0,

        "similar_reports":

            duplicates

    }


# ============================================================
# COMMUNITY REPORT VERIFICATION
# ============================================================

def verify_community_report(

    report_id,

    verified=True,

    verifier="SYSTEM"

):

    reports = get_community_reports()


    for report in reports:

        if report["report_id"] == report_id:

            report["verification_status"] = (

                "VERIFIED"

                if verified

                else "REJECTED"

            )


            report["verified_by"] = verifier

            report["verified_at"] = (

                datetime.now().isoformat()

            )


            update_user_trust(

                report["user_id"],

                verified

            )


            save_community_reports(
                reports
            )


            return {

                "success": True,

                "report": report

            }


    return {

        "success": False,

        "error":

            "Report not found."

    }


# ============================================================
# REPORT VOTING
# ============================================================

def vote_on_report(

    report_id,

    positive=True

):

    reports = get_community_reports()


    for report in reports:

        if report["report_id"] == report_id:

            if positive:

                report["upvotes"] += 1

            else:

                report["downvotes"] += 1


            save_community_reports(
                reports
            )


            return report


    return None


# ============================================================
# REPORT RELIABILITY SCORE
# ============================================================

def calculate_report_reliability(report):

    trust_score = float(

        report.get(
            "trust_score",
            50
        )

    )


    upvotes = float(

        report.get(
            "upvotes",
            0
        )

    )


    downvotes = float(

        report.get(
            "downvotes",
            0
        )

    )


    vote_score = (

        upvotes /

        (upvotes + downvotes)

        * 100

        if upvotes + downvotes > 0

        else 50

    )


    reliability = (

        trust_score * 0.7

        +

        vote_score * 0.3

    )


    return round(
        reliability,
        2
    )


# ============================================================
# REPORT PRIORITY ENGINE
# ============================================================

def calculate_report_priority(report):

    reliability = calculate_report_reliability(
        report
    )


    report_type = report.get(
        "report_type"
    )


    severity_scores = {

        "LANDSLIDE": 100,

        "MUDSLIDE": 95,

        "ROCKFALL": 80,

        "ROAD_BLOCKAGE": 75,

        "GROUND_CRACK": 70,

        "FLOOD": 70,

        "FALLEN_TREE": 50,

        "OTHER": 30

    }


    severity = severity_scores.get(
        report_type,
        30
    )


    priority = (

        severity * 0.6

        +

        reliability * 0.4

    )


    return round(
        priority,
        2
    )


# ============================================================
# VERIFIED SAFE ZONES
# IMPORTANT:
# ONLY STORE AUTHORITY-VERIFIED SAFE LOCATIONS HERE.
# ============================================================

def get_verified_safe_zones():

    return load_compressed_json(
        SAFE_ZONES_PATH,
        []
    )


def add_verified_safe_zone(

    name,

    latitude,

    longitude,

    source="OFFICIAL"

):

    zones = get_verified_safe_zones()


    zone = {

        "name": name,

        "latitude": float(latitude),

        "longitude": float(longitude),

        "source": source,

        "verified_at":

            datetime.now().isoformat()

    }


    zones.append(zone)


    save_compressed_json(
        SAFE_ZONES_PATH,
        zones
    )


    return zone


# ============================================================
# FIND NEAREST VERIFIED SAFE ZONE
# ============================================================

def find_nearest_safe_zone(

    latitude,

    longitude

):

    zones = get_verified_safe_zones()


    if not zones:

        return {

            "found": False,

            "message":

                "No verified safe zones are available offline."

        }


    nearest = None

    shortest_distance = float("inf")


    for zone in zones:

        distance = calculate_distance(

            latitude,

            longitude,

            zone["latitude"],

            zone["longitude"]

        )


        if distance < shortest_distance:

            shortest_distance = distance

            nearest = dict(zone)

            nearest["distance_km"] = distance


    return {

        "found": True,

        "safe_zone": nearest

    }


# ============================================================
# EMERGENCY OFFLINE GUIDE
# ============================================================

OFFLINE_EMERGENCY_GUIDE = {

    "LANDSLIDE": [

        "Move away from the landslide path immediately.",

        "Do not stand near unstable slopes.",

        "Watch for falling rocks and debris.",

        "Follow instructions from local authorities."

    ],

    "ROCKFALL": [

        "Move away from cliffs and steep slopes.",

        "Do not stop under unstable rock faces.",

        "Avoid blocked roads until officially cleared."

    ],

    "ROAD_BLOCKAGE": [

        "Do not attempt to cross debris.",

        "Turn around if possible.",

        "Wait for official road clearance information."

    ]

}


def get_offline_emergency_guide(

    emergency_type="LANDSLIDE"

):

    emergency_type = str(
        emergency_type
    ).upper()


    return OFFLINE_EMERGENCY_GUIDE.get(

        emergency_type,

        OFFLINE_EMERGENCY_GUIDE["LANDSLIDE"]

    )


# ============================================================
# EMERGENCY CONTACT DATABASE
# ============================================================

DEFAULT_EMERGENCY_CONTACTS = [

    {
        "name": "Emergency Services",
        "number": "112"
    }

]


def get_offline_emergency_contacts():

    return DEFAULT_EMERGENCY_CONTACTS


# ============================================================
# OFFLINE EMERGENCY MODE
# ============================================================

def activate_offline_emergency_mode(

    latitude=None,

    longitude=None,

    emergency_type="LANDSLIDE"

):

    result = {

        "emergency_mode":

            True,

        "internet_required":

            False,

        "guide":

            get_offline_emergency_guide(
                emergency_type
            ),

        "emergency_contacts":

            get_offline_emergency_contacts(),

        "activated_at":

            datetime.now().isoformat()

    }


    if (

        latitude is not None

        and

        longitude is not None

    ):

        result["nearest_safe_zone"] = (

            find_nearest_safe_zone(

                latitude,

                longitude

            )

        )


        result["nearby_reports"] = (

            find_nearby_reports(

                latitude,

                longitude,

                radius_km=20

            )

        )


    return result


# ============================================================
# OFFLINE SYNC QUEUE
# ============================================================

def get_offline_sync_queue():

    return load_compressed_json(
        OFFLINE_SYNC_QUEUE_PATH,
        []
    )


def add_to_offline_sync_queue(

    action,

    data

):

    queue = get_offline_sync_queue()


    item = {

        "action":

            action,

        "data":

            data,

        "timestamp":

            datetime.now().isoformat(),

        "synced":

            False

    }


    queue.append(
        item
    )


    save_compressed_json(
        OFFLINE_SYNC_QUEUE_PATH,
        queue
    )


    return item


def get_pending_sync_items():

    queue = get_offline_sync_queue()


    return [

        item

        for item in queue

        if not item.get("synced")

    ]


def mark_sync_complete(index):

    queue = get_offline_sync_queue()


    if index < 0 or index >= len(queue):

        return False


    queue[index]["synced"] = True

    queue[index]["synced_at"] = (

        datetime.now().isoformat()

    )


    save_compressed_json(
        OFFLINE_SYNC_QUEUE_PATH,
        queue
    )


    return True


# ============================================================
# NEARBY DANGER ANALYSIS
# ============================================================

def analyze_nearby_danger(

    latitude,

    longitude,

    radius_km=10

):

    reports = find_nearby_reports(

        latitude,

        longitude,

        radius_km

    )


    dangerous_reports = []


    for report in reports:

        priority = calculate_report_priority(
            report
        )


        if priority >= 60:

            dangerous_reports.append({

                "report":

                    report,

                "priority":

                    priority

            })


    dangerous_reports.sort(

        key=lambda item:

            item["priority"],

        reverse=True

    )


    if len(dangerous_reports) >= 5:

        danger_level = "VERY HIGH"

    elif len(dangerous_reports) >= 3:

        danger_level = "HIGH"

    elif len(dangerous_reports) >= 1:

        danger_level = "MODERATE"

    else:

        danger_level = "LOW"


    return {

        "danger_level":

            danger_level,

        "total_nearby_reports":

            len(reports),

        "dangerous_reports":

            dangerous_reports

    }


# ============================================================
# NEARBY DANGER ALERT
# ============================================================

def generate_nearby_danger_alert(

    latitude,

    longitude,

    radius_km=10

):

    danger = analyze_nearby_danger(

        latitude,

        longitude,

        radius_km

    )


    level = danger["danger_level"]


    if level == "VERY HIGH":

        message = (

            "URGENT: Multiple serious incidents have been reported nearby."

        )

    elif level == "HIGH":

        message = (

            "WARNING: Significant landslide-related danger reported nearby."

        )

    elif level == "MODERATE":

        message = (

            "CAUTION: A potentially dangerous incident was reported nearby."

        )

    else:

        message = (

            "No significant nearby community-reported danger detected."

        )


    return {

        "alert_level":

            level,

        "message":

            message,

        "analysis":

            danger,

        "generated_at":

            datetime.now().isoformat()

    }


# ============================================================
# ADVANCED TRAVEL ROUTE ANALYSIS
# ============================================================

def analyze_travel_route_advanced(

    route_points

):

    if not route_points:

        return {

            "success": False,

            "error":

                "No route points provided."

        }


    analyzed_points = []


    for point in route_points:

        try:

            analysis = next_generation_landslide_analysis(

                rainfall=

                    point.get(
                        "rainfall",
                        0
                    ),

                slope=

                    point.get(
                        "slope",
                        0
                    ),

                soil_moisture=

                    point.get(
                        "soil_moisture",
                        0
                    ),

                location=

                    point.get(
                        "name"
                    )

            )


            analyzed_points.append({

                "name":

                    point.get(
                        "name"
                    ),

                "latitude":

                    point.get(
                        "latitude"
                    ),

                "longitude":

                    point.get(
                        "longitude"
                    ),

                "analysis":

                    analysis

            })


        except Exception as error:

            analyzed_points.append({

                "name":

                    point.get(
                        "name",
                        "Unknown"
                    ),

                "error":

                    str(error)

            })


    return analyzed_points


# ============================================================
# COMPLETE TRAVEL SAFETY ANALYSIS
# ============================================================

def get_travel_safety_analysis(

    route_points

):

    points = analyze_travel_route_advanced(
        route_points
    )


    valid_points = []


    for point in points:

        if "analysis" in point:

            valid_points.append({

                "name":

                    point["name"],

                "risk":

                    point["analysis"].get(
                        "risk",
                        {}
                    )

            })


    route_analysis = calculate_route_risk(
        valid_points
    )


    recommendation = generate_route_recommendation(
        route_analysis
    )


    return {

        "route_points":

            points,

        "route_analysis":

            route_analysis,

        "recommendation":

            recommendation,

        "generated_at":

            datetime.now().isoformat()

    }


# ============================================================
# TRAVEL TIME SAFETY
# ============================================================

def analyze_travel_time_safety(

    hour,

    rainfall_level="UNKNOWN"

):

    hour = int(hour)


    score = 100

    warnings = []


    if hour < 6 or hour > 18:

        score -= 25

        warnings.append(
            "Night travel may reduce visibility near unstable terrain."
        )


    if str(rainfall_level).upper() in [

        "HIGH",

        "VERY HIGH"

    ]:

        score -= 40

        warnings.append(
            "Heavy rainfall may significantly increase route danger."
        )


    if score >= 80:

        level = "GOOD"

    elif score >= 60:

        level = "MODERATE"

    else:

        level = "POOR"


    return {

        "travel_time_score":

            score,

        "safety_level":

            level,

        "warnings":

            warnings

    }


# ============================================================
# WHAT-IF SIMULATION ENGINE
# ============================================================

def simulate_environment_change(

    rainfall,

    slope,

    soil_moisture,

    rainfall_change=0,

    slope_change=0,

    soil_change=0

):

    original = next_generation_landslide_analysis(

        rainfall,

        slope,

        soil_moisture

    )


    simulated_rainfall = (

        float(rainfall)

        +

        float(rainfall_change)

    )


    simulated_slope = (

        float(slope)

        +

        float(slope_change)

    )


    simulated_soil = (

        float(soil_moisture)

        +

        float(soil_change)

    )


    simulated = next_generation_landslide_analysis(

        simulated_rainfall,

        simulated_slope,

        simulated_soil

    )


    original_score = float(

        original["risk"].get(
            "risk_score",
            0
        )

    )


    simulated_score = float(

        simulated["risk"].get(
            "risk_score",
            0
        )

    )


    difference = (

        simulated_score

        -

        original_score

    )


    return {

        "original":

            original,

        "simulation":

            simulated,

        "risk_change":

            round(
                difference,
                2
            ),

        "summary":

            generate_simulation_summary(
                difference
            )

    }


def generate_simulation_summary(

    difference

):

    if difference >= 25:

        return (

            "The simulated environmental change significantly increases risk."

        )

    elif difference >= 10:

        return (

            "The simulated conditions increase landslide risk."

        )

    elif difference <= -10:

        return (

            "The simulated conditions reduce the calculated risk."

        )

    return (

        "The simulated changes produce only a small change in risk."

    )


# ============================================================
# VOICE / NATURAL LANGUAGE COMMAND ENGINE
# ============================================================

def detect_voice_intent(

    text

):

    text = str(text).lower()


    travel_words = [

        "travel",

        "go to",

        "journey",

        "route",

        "safe to go"

    ]


    risk_words = [

        "risk",

        "danger",

        "landslide",

        "safe"

    ]


    emergency_words = [

        "emergency",

        "help",

        "landslide happened",

        "blocked"

    ]


    for word in emergency_words:

        if word in text:

            return "EMERGENCY"


    for word in travel_words:

        if word in text:

            return "TRAVEL"


    for word in risk_words:

        if word in text:

            return "RISK_QUERY"


    return "GENERAL"


def process_voice_command(

    text,

    context=None

):

    intent = detect_voice_intent(
        text
    )


    if intent == "EMERGENCY":

        response = {

            "intent":

                intent,

            "message":

                "Emergency guidance mode activated.",

            "guide":

                get_offline_emergency_guide()

        }


    elif intent == "TRAVEL":

        response = {

            "intent":

                intent,

            "message":

                "I can analyze travel safety if route locations and environmental data are available."

        }


    elif intent == "RISK_QUERY":

        response = {

            "intent":

                intent,

            "message":

                "I can analyze landslide risk using rainfall, slope, and soil moisture data."

        }


    else:

        response = {

            "intent":

                "GENERAL",

            "message":

                "I am the Landslide Safety Assistant. Ask me about landslide risk, travel safety, or emergencies."

        }


    return response


# ============================================================
# SIMPLE LOCAL LANGUAGE RESPONSE LAYER
# ============================================================

LANGUAGE_RESPONSES = {

    "english": {

        "danger":

            "Warning: Landslide danger detected.",

        "safe":

            "Current conditions appear relatively safer."

    },

    "hindi": {

        "danger":

            "चेतावनी: भूस्खलन का खतरा पाया गया है।",

        "safe":

            "वर्तमान स्थिति अपेक्षाकृत सुरक्षित दिखाई देती है।"

    }

}


def get_localized_response(

    key,

    language="english"

):

    language = str(
        language
    ).lower()


    if language not in LANGUAGE_RESPONSES:

        language = "english"


    return LANGUAGE_RESPONSES[language].get(

        key,

        LANGUAGE_RESPONSES["english"].get(key)

    )


# ============================================================
# DISASTER EVENT CREATION
# ============================================================

def get_disaster_events():

    return load_compressed_json(
        DISASTER_EVENTS_PATH,
        []
    )


def create_disaster_event(

    event_type,

    latitude,

    longitude,

    severity,

    description=""

):

    events = get_disaster_events()


    event = {

        "event_id":

            f"EVENT_{datetime.now().strftime('%Y%m%d%H%M%S%f')}",

        "event_type":

            str(event_type).upper(),

        "latitude":

            float(latitude),

        "longitude":

            float(longitude),

        "severity":

            str(severity).upper(),

        "description":

            description,

        "status":

            "ACTIVE",

        "created_at":

            datetime.now().isoformat()

    }


    events.append(
        event
    )


    save_compressed_json(
        DISASTER_EVENTS_PATH,
        events
    )


    return event


# ============================================================
# DISASTER COORDINATION DASHBOARD
# ============================================================

def generate_disaster_dashboard():

    reports = get_community_reports()

    events = get_disaster_events()

    sensor_data = get_sensor_history()

    prediction_history = get_prediction_history()


    active_events = [

        event

        for event in events

        if event.get("status") == "ACTIVE"

    ]


    verified_reports = [

        report

        for report in reports

        if report.get("verification_status")

        == "VERIFIED"

    ]


    high_priority_reports = []


    for report in reports:

        priority = calculate_report_priority(
            report
        )


        if priority >= 70:

            high_priority_reports.append({

                "report":

                    report,

                "priority":

                    priority

            })


    return {

        "generated_at":

            datetime.now().isoformat(),

        "active_disaster_events":

            len(active_events),

        "total_community_reports":

            len(reports),

        "verified_reports":

            len(verified_reports),

        "high_priority_reports":

            len(high_priority_reports),

        "sensor_records":

            len(sensor_data),

        "prediction_records":

            len(prediction_history),

        "active_events":

            active_events,

        "priority_reports":

            high_priority_reports

    }


# ============================================================
# CITIZEN DASHBOARD
# ============================================================

def generate_citizen_dashboard(

    latitude=None,

    longitude=None

):

    dashboard = {

        "system":

            "LANDSLIDE SAFETY NETWORK",

        "generated_at":

            datetime.now().isoformat(),

        "emergency_contacts":

            get_offline_emergency_contacts()

    }


    if (

        latitude is not None

        and

        longitude is not None

    ):

        dashboard["nearby_danger"] = (

            generate_nearby_danger_alert(

                latitude,

                longitude

            )

        )


        dashboard["nearby_reports"] = (

            find_nearby_reports(

                latitude,

                longitude

            )

        )


        dashboard["nearest_safe_zone"] = (

            find_nearest_safe_zone(

                latitude,

                longitude

            )

        )


    return dashboard


# ============================================================
# RESCUE TEAM DASHBOARD
# ============================================================

def generate_rescue_dashboard():

    dashboard = generate_disaster_dashboard()


    dashboard["emergency_mode"] = True


    dashboard["recommended_priority"] = (

        "Focus first on VERIFIED high-severity incidents and official alerts."

    )


    return dashboard


# ============================================================
# COMPLETE LANDSLIDE SAFETY NETWORK
# ============================================================

def landslide_safety_network(

    rainfall,

    slope,

    soil_moisture,

    latitude=None,

    longitude=None,

    location=None,

    internet_available=False

):

    # --------------------------------------------------------
    # MAIN AI ANALYSIS
    # --------------------------------------------------------

    ai_result = next_generation_landslide_analysis(

        rainfall,

        slope,

        soil_moisture,

        location=location,

        internet_available=internet_available

    )


    # --------------------------------------------------------
    # BUILD NETWORK RESPONSE
    # --------------------------------------------------------

    network_result = {

        "success":

            True,

        "system":

            "LANDSLIDE SAFETY NETWORK",

        "timestamp":

            datetime.now().isoformat(),

        "ai_analysis":

            ai_result,

        "offline_mode":

            not internet_available

    }


    # --------------------------------------------------------
    # LOCATION FEATURES
    # --------------------------------------------------------

    if (

        latitude is not None

        and

        longitude is not None

    ):

        network_result["nearby_danger"] = (

            generate_nearby_danger_alert(

                latitude,

                longitude

            )

        )


        network_result["nearest_verified_safe_zone"] = (

            find_nearest_safe_zone(

                latitude,

                longitude

            )

        )


    # --------------------------------------------------------
    # EMERGENCY STATUS
    # --------------------------------------------------------

    risk = ai_result.get(
        "risk",
        {}
    )


    if risk.get("risk_level") == "VERY HIGH":

        network_result["emergency_status"] = (

            activate_offline_emergency_mode(

                latitude,

                longitude,

                "LANDSLIDE"

            )

        )

    else:

        network_result["emergency_status"] = {

            "emergency_mode":

                False

        }


    return network_result


# ============================================================
# SYSTEM CAPABILITIES
# ============================================================

def get_landslide_safety_network_capabilities():

    return {

        "community_reporting":

            True,

        "trust_system":

            True,

        "duplicate_detection":

            True,

        "travel_safety":

            True,

        "offline_emergency_mode":

            True,

        "offline_sync_queue":

            True,

        "nearby_danger_alerts":

            True,

        "verified_safe_zone_support":

            True,

        "voice_command_processing":

            True,

        "local_language_framework":

            True,

        "what_if_simulation":

            True,

        "disaster_dashboard":

            True

    }


# ============================================================
# LANDSLIDE SAFETY NETWORK DEMO
# ============================================================

def run_landslide_network_demo():

    print("\n")

    print("=" * 70)

    print("LANDSLIDE SAFETY NETWORK")

    print("=" * 70)


    result = landslide_safety_network(

        rainfall=120,

        slope=32,

        soil_moisture=82,

        latitude=27.052,

        longitude=95.933,

        location="Diyun",

        internet_available=False

    )


    print("\nAI RISK:")

    print(
        result["ai_analysis"].get(
            "risk"
        )
    )


    print("\nNEARBY DANGER:")

    print(
        result.get(
            "nearby_danger"
        )
    )


    print("\nSAFE ZONE:")

    print(
        result.get(
            "nearest_verified_safe_zone"
        )
    )


    print("\nSYSTEM READY")

    print("=" * 70)

# ============================================================
#                       MAIN PROGRAM
# ============================================================

if __name__ == "__main__":

    run_landslide_network_demo()
