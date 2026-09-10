console.log("LRMS Frontend Loaded");


/* =====================================================
   NAVIGATION
===================================================== */

const navItems =
    document.querySelectorAll(".nav-item");


navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        navItems.forEach(function (nav) {
            nav.classList.remove("active");
        });

        item.classList.add("active");

        const page =
            item.dataset.page;

        console.log("Selected page:", page);

    });

});


/* =====================================================
   QUICK ACTIONS
===================================================== */

const riskMapAction =
    document.getElementById("riskMapAction");

const photoAction =
    document.getElementById("photoAction");

const alertsAction =
    document.getElementById("alertsAction");

const routeAction =
    document.getElementById("routeAction");


if (riskMapAction) {

    riskMapAction.addEventListener(
        "click",
        function () {

            console.log("Opening Risk Map");

            openMap();

        }
    );

}


if (photoAction) {

    photoAction.addEventListener(
        "click",
        function () {

            alert(
                "Photo Analysis module coming next."
            );

        }
    );

}


if (alertsAction) {

    alertsAction.addEventListener(
        "click",
        function () {

            alert(
                "No new critical alerts."
            );

        }
    );

}


if (routeAction) {

    routeAction.addEventListener(
        "click",
        function () {

            alert(
                "Route Risk module coming next."
            );

        }
    );

}


/* =====================================================
   MAP SCREEN
===================================================== */

const mapScreen =
    document.getElementById("mapScreen");

const mapBtn =
    document.getElementById("mapBtn");

const bottomMapBtn =
    document.getElementById("bottomMapBtn");

const mapBackBtn =
    document.getElementById("mapBackBtn");


function openMap() {

    if (!mapScreen) return;

    mapScreen.classList.add("active");

}


function closeMap() {

    if (!mapScreen) return;

    mapScreen.classList.remove("active");

}


if (mapBtn) {

    mapBtn.addEventListener(
        "click",
        openMap
    );

}


if (bottomMapBtn) {

    bottomMapBtn.addEventListener(
        "click",
        openMap
    );

}


if (mapBackBtn) {

    mapBackBtn.addEventListener(
        "click",
        closeMap
    );

}


/* =====================================================
   MAP FILTERS
===================================================== */

const filterButtons =
    document.querySelectorAll(".filter-btn");


filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            filterButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            const selectedRisk =
                button.dataset.risk;

            console.log(
                "Selected risk:",
                selectedRisk
            );

        }
    );

});


/* =====================================================
   RISK LEVEL BUTTONS
===================================================== */

const riskButtons =
    document.querySelectorAll(".risk-level");


riskButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            riskButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            console.log(
                "Risk level:",
                button.dataset.risk
            );

        }
    );

});


/* =====================================================
   CAMERA BUTTON
===================================================== */

const cameraBtn =
    document.getElementById("cameraBtn");


if (cameraBtn) {

    cameraBtn.addEventListener(
        "click",
        function () {

            alert(
                "Camera / Photo Analysis will open here."
            );

        }
    );

}


/* =====================================================
   NOTIFICATION
===================================================== */

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );


if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        function () {

            alert(
                "⚠ Increased landslide probability detected in the monitored area."
            );

        }
    );

}


/* =====================================================
   MENU
===================================================== */

const menuBtn =
    document.getElementById("menuBtn");


if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        function () {

            console.log("Menu clicked");

        }
    );

}
