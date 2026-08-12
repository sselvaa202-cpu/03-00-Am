/* =====================================================
   CONTACT PAGE — MOUSE MOVEMENT
===================================================== */

const contactArt =
    document.querySelector(".contact-art");

const lines =
    document.querySelectorAll(".cross-lines .line");

const circle =
    document.querySelector(".art-circle");



/* =====================================================
   MOUSE PARALLAX
===================================================== */

window.addEventListener(
    "mousemove",
    (event) => {

        const x =
            (event.clientX / window.innerWidth)
            - 0.5;

        const y =
            (event.clientY / window.innerHeight)
            - 0.5;


        /* ---------------------------------------------
           CROSS LINES
        --------------------------------------------- */

        lines.forEach(
            (line, index) => {

                const movement =
                    (index + 1) * 4;

                line.style.marginLeft =
                    `${x * movement}px`;

                line.style.marginTop =
                    `${y * movement}px`;
            }
        );


        /* ---------------------------------------------
           CIRCLE
        --------------------------------------------- */

        if (circle) {

            circle.style.marginLeft =
                `${x * 10}px`;

            circle.style.marginTop =
                `${y * 10}px`;
        }

    }
);



/* =====================================================
   EMAIL HOVER — SUBTLE PAGE RESPONSE
===================================================== */

const email =
    document.querySelector(".email-link");


if (email) {

    email.addEventListener(
        "mouseenter",
        () => {

            document.body.classList.add(
                "email-hover"
            );

        }
    );


    email.addEventListener(
        "mouseleave",
        () => {

            document.body.classList.remove(
                "email-hover"
            );

        }
    );
}



/* =====================================================
   PAGE LOAD
===================================================== */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "page-loaded"
        );

    }
);