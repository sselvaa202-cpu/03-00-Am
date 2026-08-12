/* =====================================================
   GET ELEMENTS
===================================================== */

const portrait =
    document.getElementById("portrait");

const portraitFrame =
    document.querySelector(".portrait-frame");

const colorImage =
    document.querySelector(".color-image");


/* =====================================================
   CURSOR POSITION
===================================================== */

let mouseX = 50;
let mouseY = 50;


/* =====================================================
   UPDATE COLOR REVEAL
===================================================== */

function updateColorReveal(x, y) {

    colorImage.style.setProperty(
        "--cursor-x",
        `${x}%`
    );

    colorImage.style.setProperty(
        "--cursor-y",
        `${y}%`
    );

}


/* =====================================================
   MOUSE MOVE
===================================================== */

portrait.addEventListener(
    "mousemove",
    (event) => {

        const rect =
            portrait.getBoundingClientRect();


        mouseX =
            ((event.clientX - rect.left)
                / rect.width) * 100;


        mouseY =
            ((event.clientY - rect.top)
                / rect.height) * 100;


        updateColorReveal(
            mouseX,
            mouseY
        );


        /* =================================
           MOVE WATER RIPPLE
        ================================= */

        const ripples =
            document.querySelectorAll(
                ".water-ripple"
            );


        ripples.forEach((ripple) => {

            ripple.style.left =
                `${mouseX}%`;

            ripple.style.top =
                `${mouseY}%`;

        });


        /* =================================
           MOVE CURSOR GLOW
        ================================= */

        const glow =
            document.querySelector(
                ".cursor-glow"
            );


        glow.style.left =
            `${mouseX}%`;

        glow.style.top =
            `${mouseY}%`;


        /* =================================
           CHECK BORDER DISTANCE
        ================================= */

        const distanceLeft =
            event.clientX - rect.left;

        const distanceRight =
            rect.right - event.clientX;

        const distanceTop =
            event.clientY - rect.top;

        const distanceBottom =
            rect.bottom - event.clientY;


        const nearestEdge =
            Math.min(
                distanceLeft,
                distanceRight,
                distanceTop,
                distanceBottom
            );


        /*
         * When cursor gets close to
         * image border, activate wave.
         */

        if (nearestEdge < 35) {

            portraitFrame.classList.add(
                "border-active"
            );

        } else {

            portraitFrame.classList.remove(
                "border-active"
            );

        }

    }
);


/* =====================================================
   MOUSE ENTER
===================================================== */

portrait.addEventListener(
    "mouseenter",
    () => {

        portrait.classList.add(
            "color-active"
        );

    }
);


/* =====================================================
   MOUSE LEAVE
===================================================== */

portrait.addEventListener(
    "mouseleave",
    () => {

        /*
         * Return to full grayscale.
         */

        portrait.classList.remove(
            "color-active"
        );


        portraitFrame.classList.remove(
            "border-active"
        );


        /*
         * Move reveal point outside
         * the visible image.
         */

        colorImage.style.setProperty(
            "--cursor-x",
            "-20%"
        );

        colorImage.style.setProperty(
            "--cursor-y",
            "-20%"
        );

    }
);


/* =====================================================
   TOUCH DEVICES
===================================================== */

if (
    window.matchMedia(
        "(hover: none)"
    ).matches
) {

    /*
     * On phones/tablets there is no
     * mouse cursor.
     *
     * Keep the image grayscale until
     * the user touches it.
     */

    portrait.addEventListener(
        "touchstart",
        () => {

            portrait.classList.add(
                "color-active"
            );

        },
        {
            passive: true
        }
    );

}