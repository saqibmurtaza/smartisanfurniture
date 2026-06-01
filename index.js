(function () {
    function init() {
        const header = document.querySelector(".menuContainer");
        const hamburger = document.querySelector(".hamburger");
        const menu = document.querySelector(".menu");
        const submenu = document.querySelector(".submenu");
        const submenuLink = submenu ? submenu.querySelector("a") : null;
        const slides = Array.from(document.querySelectorAll(".mySlides"));
        const dots = Array.from(document.querySelectorAll(".dot"));
        let slideIndex = 0;
        let slideTimer = null;

        function setHeaderOffset() {
            const offset = header ? header.offsetHeight : 72;
            document.documentElement.style.setProperty("--header-offset", offset + "px");
        }

        function closeMenu() {
            if (!hamburger || !menu) {
                return;
            }

            hamburger.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            menu.classList.remove("active", "is-open");
            document.body.classList.remove("menu-open");

            if (submenu) {
                submenu.classList.remove("is-open");
            }
        }

        window.toggleMenu = function (event) {
            if (event) {
                event.preventDefault();
            }

            if (!hamburger || !menu) {
                return;
            }

            const isOpen = !menu.classList.contains("is-open");
            hamburger.classList.toggle("active", isOpen);
            hamburger.setAttribute("aria-expanded", String(isOpen));
            menu.classList.toggle("active", isOpen);
            menu.classList.toggle("is-open", isOpen);
            document.body.classList.toggle("menu-open", isOpen && window.innerWidth <= 768);

            if (!isOpen && submenu) {
                submenu.classList.remove("is-open");
            }
        };

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            slideIndex = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, index) {
                slide.style.display = index === slideIndex ? "block" : "none";
            });

            dots.forEach(function (dot, index) {
                dot.classList.toggle("active", index === slideIndex);
            });
        }

        function startSlideshow() {
            if (slides.length < 2) {
                showSlide(0);
                return;
            }

            showSlide(slideIndex);
            slideTimer = window.setInterval(function () {
                showSlide(slideIndex + 1);
            }, 3500);
        }

        function stopSlideshow() {
            if (slideTimer) {
                window.clearInterval(slideTimer);
                slideTimer = null;
            }
        }

        setHeaderOffset();
        window.addEventListener("resize", setHeaderOffset);

        if (menu && !menu.id) {
            menu.id = "menu";
        }

        if (hamburger) {
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.setAttribute("aria-controls", menu ? menu.id : "menu");
            hamburger.setAttribute("aria-label", "Toggle navigation menu");
        }

        if (submenuLink && submenu) {
            submenuLink.addEventListener("click", function (event) {
                if (window.innerWidth > 768) {
                    return;
                }

                event.preventDefault();
                submenu.classList.toggle("is-open");
            });
        }

        document.addEventListener("click", function (event) {
            if (!menu || !hamburger) {
                return;
            }

            if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener("click", function (event) {
                const targetId = this.getAttribute("href");

                if (!targetId || targetId === "#") {
                    return;
                }

                const targetElement = document.querySelector(targetId);

                if (!targetElement) {
                    return;
                }

                event.preventDefault();
                const top = targetElement.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight + 16 : 88);

                window.scrollTo({
                    top: top,
                    behavior: "smooth"
                });

                closeMenu();
            });
        });

        document.querySelectorAll("img").forEach(function (img, index) {
            if (!img.hasAttribute("decoding")) {
                img.setAttribute("decoding", "async");
            }

            if (index > 1 && !img.hasAttribute("loading")) {
                img.setAttribute("loading", "lazy");
            }
        });

        document.querySelectorAll("iframe").forEach(function (frame) {
            if (!frame.hasAttribute("loading")) {
                frame.setAttribute("loading", "lazy");
            }
        });

        document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
            const rel = (link.getAttribute("rel") || "").trim();
            const tokens = rel ? rel.split(/\s+/) : [];

            if (!tokens.includes("noopener")) {
                tokens.push("noopener");
            }

            if (!tokens.includes("noreferrer")) {
                tokens.push("noreferrer");
            }

            link.setAttribute("rel", tokens.join(" ").trim());
        });

        if (slides.length) {
            startSlideshow();

            document.addEventListener("visibilitychange", function () {
                if (document.hidden) {
                    stopSlideshow();
                } else if (!slideTimer) {
                    startSlideshow();
                }
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
