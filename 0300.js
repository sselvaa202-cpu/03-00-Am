/* =========================================
   GET ELEMENTS
========================================= */

const page =
    document.getElementById("manifestationPage");

const audio =
    document.getElementById("manifestAudio");

const videoCards =
    document.querySelectorAll(".video-card");


/* =========================================
   LEAVE WEBSITE PROTECTION

   false = normal website
   true  = manifestation has been entered
========================================= */

let leaveProtectionActive = false;


/* =========================================
   MANIFESTATION ACTIVE STATE
========================================= */

let manifestationActive = false;


/* =========================================
   WEBSITE AUDIO VOLUME
========================================= */

/*
 * Maximum volume allowed by the browser
 * for this HTML audio element.
 *
 * 0.0 = silent
 * 0.5 = 50%
 * 1.0 = 100%
 */

const MANIFEST_AUDIO_VOLUME = 1.0;


/* =========================================
   VIDEO CARD EVENTS
========================================= */

videoCards.forEach((card) => {

    const wrapper =
        card.querySelector(".video-wrapper");

    const video =
        card.querySelector(".manifest-video");

    const button =
        card.querySelector(".manifest-button");


    /* =====================================
       MOUSE ENTER
    ===================================== */

    wrapper.addEventListener("mouseenter", () => {

        /*
         * Don't play preview while the
         * browser fullscreen is active.
         */

        if (document.fullscreenElement) {
            return;
        }


        /*
         * Don't start another preview
         * after manifestation mode begins.
         */

        if (manifestationActive) {
            return;
        }


        video.play().catch(() => {});

    });


    /* =====================================
       MOUSE LEAVE
    ===================================== */

    wrapper.addEventListener("mouseleave", () => {

        /*
         * Only pause normal preview videos.
         */

        if (
            !document.fullscreenElement &&
            !manifestationActive
        ) {

            video.pause();

        }

    });


    /* =====================================
       BUTTON CLICK
    ===================================== */

    button.addEventListener("click", (event) => {

        event.preventDefault();
        event.stopPropagation();

        enterManifest(card);

    });


    /* =====================================
       VIDEO CLICK
    ===================================== */

    wrapper.addEventListener("click", (event) => {

        /*
         * Don't trigger twice when the
         * manifest button is clicked.
         */

        if (
            event.target.closest(".manifest-button")
        ) {
            return;
        }

        enterManifest(card);

    });

});


/* =========================================
   ENTER MANIFEST
========================================= */

async function enterManifest(selectedCard) {


    /* -------------------------------------
       MANIFESTATION IS NOW ACTIVE
    ------------------------------------- */

    manifestationActive = true;


    /* -------------------------------------
       ACTIVATE LEAVE PROTECTION
    ------------------------------------- */

    /*
     * From this point onward, closing,
     * refreshing or navigating away may
     * trigger the browser's native
     * "Leave site?" confirmation.
     */

    leaveProtectionActive = true;


    /* -------------------------------------
       REMOVE ACTIVE FROM OTHER VIDEOS
    ------------------------------------- */

    videoCards.forEach((card) => {

        card.classList.remove(
            "active-video"
        );


        const otherVideo =
            card.querySelector(
                ".manifest-video"
            );


        if (otherVideo) {

            otherVideo.pause();

        }

    });


    /* -------------------------------------
       SELECT CURRENT VIDEO
    ------------------------------------- */

    selectedCard.classList.add(
        "active-video"
    );


    const selectedVideo =
        selectedCard.querySelector(
            ".manifest-video"
        );


    const selectedWrapper =
        selectedCard.querySelector(
            ".video-wrapper"
        );


    /* -------------------------------------
       ACTIVATE 03:00 AM PAGE
    ------------------------------------- */

    page.classList.add(
        "fullscreen-mode"
    );


    /* =====================================
       VIDEO PLAY
    ===================================== */

    try {

        await selectedVideo.play();

    } catch (error) {

        console.log(
            "Video play error:",
            error
        );

    }


    /* =====================================
       MANIFESTATION AUDIO
       MAXIMUM WEBSITE VOLUME
    ===================================== */

    if (audio) {

        /*
         * Set audio to maximum volume
         * allowed by the HTML audio API.
         */

        audio.volume =
            MANIFEST_AUDIO_VOLUME;


        /*
         * Make sure the audio is not muted.
         */

        audio.muted = false;


        /*
         * Optional: make sure playback
         * rate remains normal.
         */

        audio.playbackRate = 1.0;


        try {

            await audio.play();

        } catch (error) {

            console.log(
                "Audio play error:",
                error
            );

        }

    }


    /* =====================================
       REAL BROWSER FULLSCREEN
    ===================================== */

    try {

        if (
            selectedWrapper &&
            selectedWrapper.requestFullscreen
        ) {

            await selectedWrapper.requestFullscreen();

        }

    } catch (error) {

        console.log(
            "Fullscreen error:",
            error
        );

    }

}


/* =========================================
   BEFORE UNLOAD
========================================= */

/*
 * IMPORTANT:
 *
 * This protects the page AFTER the user
 * enters a manifestation.
 *
 * Browsers control the actual confirmation
 * dialog and its wording.
 */

window.addEventListener(
    "beforeunload",
    (event) => {

        /*
         * Do nothing on the normal page.
         */

        if (!leaveProtectionActive) {
            return;
        }


        /*
         * Activate browser's native
         * leave-site confirmation.
         */

        event.preventDefault();

        event.returnValue = "";

    }
);


/* =========================================
   FULLSCREEN CHANGE
========================================= */

document.addEventListener(
    "fullscreenchange",
    () => {


        /* =================================
           USER LEFT REAL FULLSCREEN

           Usually by pressing ESC
        ================================= */

        if (!document.fullscreenElement) {


            /*
             * IMPORTANT:
             *
             * DO NOT disable manifestation.
             */

            manifestationActive = true;


            /*
             * KEEP LEAVE PROTECTION ACTIVE
             */

            leaveProtectionActive = true;


            /* ---------------------------------
               KEEP 03:00 AM PAGE ACTIVE
            --------------------------------- */

            page.classList.add(
                "fullscreen-mode"
            );


            /* ---------------------------------
               GET ACTIVE VIDEO
            --------------------------------- */

            const activeCard =
                document.querySelector(
                    ".video-card.active-video"
                );


            if (activeCard) {


                const activeVideo =
                    activeCard.querySelector(
                        ".manifest-video"
                    );


                /* -----------------------------
                   CONTINUE VIDEO
                ----------------------------- */

                if (activeVideo) {

                    activeVideo.play().catch(
                        (error) => {

                            console.log(
                                "Video continue error:",
                                error
                            );

                        }
                    );

                }

            }


            /* =================================
               KEEP AUDIO PLAYING
            ================================= */

            if (audio) {

                /*
                 * Restore maximum website
                 * audio volume.
                 */

                audio.volume =
                    MANIFEST_AUDIO_VOLUME;


                /*
                 * Make sure it isn't muted.
                 */

                audio.muted = false;


                /*
                 * If audio somehow stopped,
                 * start it again.
                 */

                if (audio.paused) {

                    audio.play().catch(
                        (error) => {

                            console.log(
                                "Audio continue error:",
                                error
                            );

                        }
                    );

                }

            }

        }

    }
);