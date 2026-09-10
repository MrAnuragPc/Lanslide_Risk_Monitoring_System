/* ==========================================
   LANDSLIDE RISK MONITORING SYSTEM
   MAIN JAVASCRIPT
========================================== */


/* ==========================================
   SCREEN NAVIGATION
========================================== */

function showScreen(screenId) {

    // Get all screens
    const screens = document.querySelectorAll(".screen");

    // Remove active class from every screen
    screens.forEach(screen => {
        screen.classList.remove("active");
    });


    // Show selected screen
    const selectedScreen = document.getElementById(screenId);

    if (selectedScreen) {
        selectedScreen.classList.add("active");
    }


    // Refresh Leaflet map when opening map screen
    if (screenId === "map") {

        setTimeout(() => {

            if (map) {
                map.invalidateSize();
            }

        }, 200);

    }


    // Scroll page to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ==========================================
   LEAFLET MAP
========================================== */


let map;


/* Wait until page loads */

document.addEventListener("DOMContentLoaded", function () {


    /* ==========================================
       CREATE MAP
    ========================================== */

    const mapElement = document.getElementById("realMap");


    if (mapElement) {

        // Guwahati coordinates
        const guwahatiLat = 26.1445;
        const guwahatiLng = 91.7362;


        // Create map
        map = L.map("realMap", {
            zoomControl: true
        }).setView(
            [guwahatiLat, guwahatiLng],
            10
        );


        /* ==========================================
           ADD OPENSTREETMAP
        ========================================== */

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(map);


        /* ==========================================
           CREATE RISK MARKERS
        ========================================== */

        createRiskMarker(
            26.1445,
            91.7362,
            "Guwahati",
            "High",
            82,
            "risk-high"
        );


        createRiskMarker(
            26.18,
            91.70,
            "North Guwahati",
            "Moderate",
            45,
            "risk-moderate"
        );


        createRiskMarker(
            26.10,
            91.80,
            "Sonapur",
            "Very High",
            91,
            "risk-very-high"
        );


        createRiskMarker(
            26.25,
            91.60,
            "Low Risk Area",
            "Low",
            18,
            "risk-low"
        );

    }


    /* ==========================================
       IMAGE UPLOAD
    ========================================== */

    setupImageUpload();


    /* ==========================================
       MAP FILTERS
    ========================================== */

    setupMapFilters();


    /* ==========================================
       ALERT FILTERS
    ========================================== */

    setupAlertFilters();


});


/* ==========================================
   STORE MARKERS
========================================== */

let riskMarkers = [];


/* ==========================================
   CREATE CUSTOM RISK MARKER
========================================== */

function createRiskMarker(
    latitude,
    longitude,
    location,
    riskLevel,
    riskScore,
    riskClass
) {


    const markerIcon = L.divIcon({

        className: "custom-marker",

        html: `
            <div class="risk-marker ${riskClass}"></div>
        `,

        iconSize: [24, 24],

        iconAnchor: [12, 12]

    });


    const marker = L.marker(
        [latitude, longitude],
        {
            icon: markerIcon
        }
    );


    marker.riskLevel = riskLevel;


    marker.addTo(map);


    /* ==========================================
       POPUP
    ========================================== */

    marker.bindPopup(`

        <div class="map-popup">

            <h3>${location}</h3>

            <p>
                Risk Level:
                <strong>${riskLevel}</strong>
            </p>

            <p>
                Risk Score:
                <strong>${riskScore}%</strong>
            </p>

            <button
                onclick="openLocationDetails('${location}', '${riskLevel}', ${riskScore})"
                class="popup-btn"
            >

                View Details

            </button>

        </div>

    `);


    /* Store marker */

    riskMarkers.push(marker);

}


/* ==========================================
   OPEN LOCATION DETAILS
========================================== */

function openLocationDetails(
    location,
    riskLevel,
    riskScore
) {

    // Change details screen text

    const detailsTitle =
        document.querySelector("#details .details-card h2");


    if (detailsTitle) {
        detailsTitle.textContent = location;
    }


    // Change risk score

    const detailsScore =
        document.querySelector("#details .details-risk h1");


    if (detailsScore) {
        detailsScore.textContent =
            riskScore + "%";
    }


    // Change risk level

    const detailsRisk =
        document.querySelector("#details .details-risk h3");


    if (detailsRisk) {
        detailsRisk.textContent =
            riskLevel + " Risk";
    }


    // Open details screen

    showScreen("details");

}


/* ==========================================
   MAP RISK FILTERS
========================================== */

function setupMapFilters() {


    const filters =
        document.querySelectorAll(".map-filters .filter");


    filters.forEach(filter => {


        filter.addEventListener(
            "click",
            function () {


                // Remove active class

                filters.forEach(btn => {

                    btn.classList.remove(
                        "active-filter"
                    );

                });


                // Add active class

                this.classList.add(
                    "active-filter"
                );


                // Get selected filter

                const selectedRisk =
                    this.textContent.trim();


                filterRiskMarkers(
                    selectedRisk
                );

            }
        );


    });

}


/* ==========================================
   FILTER MARKERS
========================================== */

function filterRiskMarkers(risk) {


    riskMarkers.forEach(marker => {


        if (risk === "All Risk") {

            marker.addTo(map);

        }

        else if (
            marker.riskLevel === risk
        ) {

            marker.addTo(map);

        }

        else {

            map.removeLayer(marker);

        }


    });

}


/* ==========================================
   IMAGE UPLOAD SYSTEM
========================================== */

function setupImageUpload() {


    const imageInput =
        document.getElementById("imageUpload");


    if (!imageInput) return;


    imageInput.addEventListener(
        "change",
        function (event) {


            const file =
                event.target.files[0];


            if (!file) return;


            // Check file type

            if (
                !file.type.startsWith("image/")
            ) {

                alert(
                    "Please select a valid image."
                );

                return;

            }


            // Check size

            if (
                file.size >
                10 * 1024 * 1024
            ) {

                alert(
                    "Image size must be less than 10MB."
                );

                return;

            }


            // Preview image

            previewImage(file);


        }
    );

}


/* ==========================================
   IMAGE PREVIEW
========================================== */

function previewImage(file) {


    const reader =
        new FileReader();


    reader.onload = function (event) {


        const uploadBox =
            document.querySelector(
                ".upload-box"
            );


        if (!uploadBox) return;


        uploadBox.innerHTML = `

            <img
                src="${event.target.result}"
                class="uploaded-preview"
                alt="Uploaded Image"
            >


            <div class="upload-preview-actions">

                <button
                    class="capture-btn"
                    onclick="analyzeImage()"
                >

                    🤖 Analyze Image

                </button>


                <button
                    class="secondary-btn"
                    onclick="changeImage()"
                >

                    Change Image

                </button>

            </div>

        `;

    };


    reader.readAsDataURL(file);

}


/* ==========================================
   CHANGE IMAGE
========================================== */

function changeImage() {


    const imageInput =
        document.getElementById(
            "imageUpload"
        );


    if (imageInput) {

        imageInput.value = "";

        imageInput.click();

    }

}


/* ==========================================
   ANALYZE IMAGE
========================================== */

async function analyzeImage() {


    const imageInput =
        document.getElementById(
            "imageUpload"
        );


    if (
        !imageInput ||
        !imageInput.files[0]
    ) {

        alert(
            "Please select an image first."
        );

        return;

    }


    const file =
        imageInput.files[0];


    /* ======================================
       SHOW LOADING
    ====================================== */

    const uploadBox =
        document.querySelector(
            ".upload-box"
        );


    uploadBox.innerHTML = `

        <div class="analysis-loading">

            <div class="loader"></div>

            <h3>
                AI is analyzing your image...
            </h3>

            <p>
                Detecting possible landslide indicators
            </p>

        </div>

    `;


    /* ======================================
       SEND IMAGE TO DJANGO BACKEND
    ====================================== */

    const formData =
        new FormData();


    formData.append(
        "image",
        file
    );


    try {


        const response =
            await fetch(
                "/api/analyze-image/",
                {

                    method: "POST",

                    body: formData,

                    headers: {

                        "X-CSRFToken":
                            getCSRFToken()

                    }

                }
            );


        const data =
            await response.json();


        console.log(
            "AI Result:",
            data
        );


        /* ==================================
           UPDATE RESULT SCREEN
        ================================== */

        updateAIResult(data);


        /* Open result page */

        showScreen("result");


    }

    catch (error) {


        console.error(
            "AI Analysis Error:",
            error
        );


        alert(

            "Could not connect to the AI server. "

            +
            "For now, showing demo analysis."

        );


        /* DEMO RESULT */

        updateAIResult({

            instability_score: 76,

            risk_level:
                "High Instability",

            indicators: [

                "Soil Cracks Detected",

                "Slope Disturbance",

                "Erosion Signs",

                "Loose Rocks Detected"

            ]

        });


        showScreen("result");

    }

}


/* ==========================================
   UPDATE AI RESULT
========================================== */

function updateAIResult(data) {


    /* SCORE */

    const scoreElement =
        document.querySelector(
            "#result .instability-card h1"
        );


    if (scoreElement) {

        scoreElement.textContent =
            data.instability_score + "%";

    }


    /* RISK LEVEL */

    const riskElement =
        document.querySelector(
            "#result .instability-card h3"
        );


    if (riskElement) {

        riskElement.textContent =
            data.risk_level;

    }


    /* INDICATORS */

    const indicatorsContainer =
        document.querySelector(
            "#result .indicators-card"
        );


    if (
        indicatorsContainer &&
        data.indicators
    ) {


        let indicatorsHTML = `

            <h3>
                Detected Indicators
            </h3>

        `;


        data.indicators.forEach(
            indicator => {

                indicatorsHTML += `

                    <div class="indicator">

                        ⚠️ ${indicator}

                    </div>

                `;

            }
        );


        indicatorsContainer.innerHTML =
            indicatorsHTML;

    }

}


/* ==========================================
   CSRF TOKEN
========================================== */

function getCSRFToken() {


    const name =
        "csrftoken";


    let cookieValue =
        null;


    if (
        document.cookie &&
        document.cookie !== ""
    ) {


        const cookies =
            document.cookie.split(";");


        for (
            let i = 0;
            i < cookies.length;
            i++
        ) {


            const cookie =
                cookies[i].trim();


            if (
                cookie.substring(
                    0,
                    name.length + 1
                )
                ===
                name + "="
            ) {


                cookieValue =
                    decodeURIComponent(
                        cookie.substring(
                            name.length + 1
                        )
                    );


                break;

            }

        }

    }


    return cookieValue;

}


/* ==========================================
   ALERT FILTER SYSTEM
========================================== */

function setupAlertFilters() {


    const filters =
        document.querySelectorAll(
            ".alert-filters .filter"
        );


    const alerts =
        document.querySelectorAll(
            ".alert-item"
        );


    filters.forEach(filter => {


        filter.addEventListener(
            "click",
            function () {


                // Remove active

                filters.forEach(btn => {

                    btn.classList.remove(
                        "active-filter"
                    );

                });


                // Add active

                this.classList.add(
                    "active-filter"
                );


                const selected =
                    this.textContent.trim();


                alerts.forEach(alert => {


                    const title =
                        alert.querySelector("h3")
                        ?.textContent || "";


                    // Show all

                    if (selected === "All") {

                        alert.style.display =
                            "flex";

                    }


                    // High Risk

                    else if (
                        selected === "High Risk"
                    ) {


                        alert.style.display =
                            title.includes("High")
                                ? "flex"
                                : "none";

                    }


                    // Moderate

                    else if (
                        selected === "Moderate"
                    ) {


                        alert.style.display =
                            title.includes("Moderate")
                                ? "flex"
                                : "none";

                    }


                    // Information

                    else if (
                        selected === "Information"
                    ) {


                        alert.style.display =
                            title.includes("Weather")
                                ? "flex"
                                : "none";

                    }


                });


            }
        );


    });

}


/* ==========================================
   RISK SCORE UPDATE FUNCTION

   This will later receive data
   from your Django AI model.
========================================== */

function updateRiskScore(
    riskScore,
    riskLevel
) {


    /* Home screen */

    const homeScore =
        document.getElementById(
            "riskScore"
        );


    if (homeScore) {

        homeScore.textContent =
            riskScore;

    }


    const homeRisk =
        document.querySelector(
            ".high-risk-text"
        );


    if (homeRisk) {

        homeRisk.textContent =
            riskLevel + " Risk";

    }


    console.log(
        "Risk updated:",
        riskScore,
        riskLevel
    );

}


/* ==========================================
   DEMO LIVE RISK UPDATE

   REMOVE THIS LATER WHEN REAL
   WEATHER + AI API IS CONNECTED
========================================== */

function simulateRiskUpdate() {


    const randomScore =
        Math.floor(
            Math.random() * 40 + 60
        );


    let riskLevel;


    if (randomScore <= 20) {

        riskLevel = "Low";

    }

    else if (randomScore <= 40) {

        riskLevel = "Moderate";

    }

    else if (randomScore <= 60) {

        riskLevel = "High";

    }

    else {

        riskLevel = "Very High";

    }


    updateRiskScore(
        randomScore,
        riskLevel
    );

}


/* ==========================================
   CONSOLE MESSAGE
========================================== */

console.log(
    "🌍 Landslide Risk Monitoring System Loaded"
);


console.log(
    "🤖 AI Prediction Module Ready"
);
