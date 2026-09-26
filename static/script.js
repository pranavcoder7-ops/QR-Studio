const qrInput = document.getElementById("qrInput");

const generateBtn = document.getElementById("generateBtn");

const generateText =
    document.getElementById("generateText");

const clearBtn =
    document.getElementById("clearBtn");

const qrImage =
    document.getElementById("qrImage");

const downloadBtn =
    document.getElementById("downloadBtn");

const qrResult =
    document.getElementById("qrResult");

const emptyState =
    document.getElementById("emptyState");

const errorMessage =
    document.getElementById("errorMessage");

const charCount =
    document.getElementById("charCount");

const qrColor =
    document.getElementById("qrColor");

const bgColor =
    document.getElementById("bgColor");

const qrColorText =
    document.getElementById("qrColorText");

const bgColorText =
    document.getElementById("bgColorText");

const qrSize =
    document.getElementById("qrSize");

const sizeValue =
    document.getElementById("sizeValue");

const themeBtn =
    document.getElementById("themeBtn");

const statusDot =
    document.getElementById("statusDot");

const wifiFields =
    document.getElementById("wifiFields");

const wifiName =
    document.getElementById("wifiName");

const wifiPassword =
    document.getElementById("wifiPassword");

const wifiSecurity =
    document.getElementById("wifiSecurity");

const inputLabel =
    document.getElementById("inputLabel");


let currentType = "text";


/* TYPE BUTTONS */

document.querySelectorAll(".type-btn").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".type-btn")
            .forEach(btn => {
                btn.classList.remove("active");
            });

        button.classList.add("active");

        currentType = button.dataset.type;

        updateInput();

    });

});


/* INPUT TYPE UPDATE */

function updateInput() {

    wifiFields.classList.add("hidden");

    qrInput.classList.remove("hidden");

    if (currentType === "text") {

        inputLabel.textContent =
            "Enter your text";

        qrInput.placeholder =
            "Type anything here...";

    }


    else if (currentType === "url") {

        inputLabel.textContent =
            "Enter website URL";

        qrInput.placeholder =
            "https://example.com";

    }


    else if (currentType === "email") {

        inputLabel.textContent =
            "Enter email address";

        qrInput.placeholder =
            "hello@example.com";

    }


    else if (currentType === "phone") {

        inputLabel.textContent =
            "Enter phone number";

        qrInput.placeholder =
            "+91 9876543210";

    }


    else if (currentType === "wifi") {

        qrInput.classList.add("hidden");

        inputLabel.textContent =
            "Wi-Fi Details";

        wifiFields.classList.remove("hidden");

    }

}


/* CHARACTER COUNT */

qrInput.addEventListener("input", () => {

    charCount.textContent =
        qrInput.value.length;

});


/* COLOR */

qrColor.addEventListener("input", () => {

    qrColorText.textContent =
        qrColor.value.toUpperCase();

});


bgColor.addEventListener("input", () => {

    bgColorText.textContent =
        bgColor.value.toUpperCase();

});


/* SIZE */

qrSize.addEventListener("input", () => {

    const value = Number(qrSize.value);

    if (value <= 7) {

        sizeValue.textContent = "Standard";

    } else if (value <= 11) {

        sizeValue.textContent = "High";

    } else {

        sizeValue.textContent = "Ultra";

    }

});


/* BUILD QR DATA */

function buildQRData() {

    if (currentType === "wifi") {

        const ssid =
            wifiName.value.trim();

        const password =
            wifiPassword.value.trim();

        const security =
            wifiSecurity.value;

        if (!ssid) {

            throw new Error(
                "Please enter the Wi-Fi name."
            );

        }

        if (
            security !== "nopass" &&
            !password
        ) {

            throw new Error(
                "Please enter the Wi-Fi password."
            );

        }

        return `WIFI:T:${security};S:${ssid};P:${password};;`;

    }


    const value =
        qrInput.value.trim();


    if (!value) {

        throw new Error(
            "Please enter something first."
        );

    }


    if (currentType === "url") {

        if (
            !value.startsWith("http://") &&
            !value.startsWith("https://")
        ) {

            return `https://${value}`;

        }

    }


    if (currentType === "email") {

        return `mailto:${value}`;

    }


    if (currentType === "phone") {

        return `tel:${value}`;

    }


    return value;

}


/* GENERATE */

generateBtn.addEventListener(
    "click",
    async () => {

        errorMessage.textContent = "";

        let data;


        try {

            data = buildQRData();

        } catch (error) {

            errorMessage.textContent =
                error.message;

            return;

        }


        generateBtn.disabled = true;

        generateText.textContent =
            "Generating...";


        try {

            const response =
                await fetch("/generate", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        data: data,

                        qr_color:
                            qrColor.value,

                        bg_color:
                            bgColor.value,

                        size:
                            qrSize.value

                    })

                });


            const result =
                await response.json();


            if (!result.success) {

                throw new Error(
                    result.message
                );

            }


            qrImage.src =
                result.qr;


            downloadBtn.href =
                result.qr;


            emptyState.classList.add(
                "hidden"
            );


            qrResult.classList.remove(
                "hidden"
            );


            statusDot.classList.add(
                "ready"
            );


        } catch (error) {

            errorMessage.textContent =
                error.message ||
                "Something went wrong.";

        } finally {

            generateBtn.disabled = false;

            generateText.textContent =
                "Generate QR Code";

        }

    }
);


/* CLEAR */

clearBtn.addEventListener(
    "click",
    () => {

        qrInput.value = "";

        wifiName.value = "";

        wifiPassword.value = "";

        charCount.textContent = "0";

        errorMessage.textContent = "";

        qrImage.src = "";

        qrResult.classList.add(
            "hidden"
        );

        emptyState.classList.remove(
            "hidden"
        );

        statusDot.classList.remove(
            "ready"
        );

    }
);


/* THEME */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        if (
            document.body.classList.contains(
                "light"
            )
        ) {

            themeBtn.textContent = "🌙";

        } else {

            themeBtn.textContent = "☀️";

        }

    }
);