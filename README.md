<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Portofolio pribadi">
    <title>Portofolio | D F R </title>

    <style>
        /* =========================================
   RESET
========================================= */

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            background: #0b0d12;
            color: #f5f5f5;
            line-height: 1.7;
        }

        img {
            width: 100%;
            display: block;
        }

        a {
            color: inherit;
            text-decoration: none;
        }


        /* =========================================
   GLOBAL
========================================= */

        .container {
            width: min(1120px, 90%);
            margin: auto;
        }

        .section {
            padding: 110px 0;
        }

        .section-heading {
            max-width: 650px;
            margin-bottom: 55px;
        }

        .section-label {
            color: #8b5cf6;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 3px;
            margin-bottom: 10px;
        }

        .section-heading h2 {
            font-size: clamp(32px, 5vw, 50px);
            line-height: 1.15;
        }

        .section-heading>p:last-child {
            margin-top: 20px;
            color: #9ca3af;
        }


        /* =========================================
   NAVBAR
========================================= */

        .header {
            position: fixed;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 1000;

            background: rgba(11, 13, 18, 0.90);
            border-bottom: 1px solid #20232c;

            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }

        .navbar {
            min-height: 75px;

            display: flex;
            align-items: center;
            justify-content: space-between;

            position: relative;
        }

        .logo {
            font-size: 25px;
            font-weight: 800;
        }

        .logo span {
            color: #8b5cf6;
        }

        /* =========================================
   DESKTOP MENU
========================================= */

        .nav-menu {
            display: flex;
            align-items: center;
            gap: 30px;
        }

        .nav-menu a {
            position: relative;

            color: #b4b7c1;
            font-size: 14px;

            transition: 0.3s;
        }

        .nav-menu a:hover {
            color: #ffffff;
        }

        .nav-menu a::after {
            content: "";

            position: absolute;
            left: 0;
            bottom: -7px;

            width: 0;
            height: 2px;

            background: #8b5cf6;

            transition: width 0.3s;
        }

        .nav-menu a:hover::after {
            width: 100%;
        }


        /* =========================================
   HAMBURGER
========================================= */

        .menu-toggle {
            display: none;
        }

        .hamburger {
            display: none;

            width: 32px;
            height: 25px;

            cursor: pointer;

            flex-direction: column;
            justify-content: space-between;
        }

        .hamburger span {
            display: block;

            width: 100%;
            height: 3px;

            background: #ffffff;
            border-radius: 5px;

            transition: 0.3s ease;
        }


        /* =========================================
   MOBILE NAVBAR
========================================= */

        @media (max-width: 768px) {

            .header {
                position: fixed;
            }

            .navbar {
                min-height: 70px;
            }

            /* Hamburger tampil */
            .hamburger {
                display: flex;
            }

            /* Menu mobile */
            .nav-menu {
                position: absolute;

                top: 70px;
                left: 0;

                width: 100%;

                padding: 20px;

                display: flex;
                flex-direction: column;
                align-items: stretch;

                gap: 0;

                background: #0b0d12;

                border-top: 1px solid #20232c;
                border-bottom: 1px solid #20232c;

                /* Tersembunyi */
                opacity: 0;
                visibility: hidden;

                transform: translateY(-10px);

                transition:
                    opacity 0.3s ease,
                    visibility 0.3s ease,
                    transform 0.3s ease;
            }

            .nav-menu a {
                padding: 15px 10px;

                border-bottom: 1px solid #20232c;
            }

            .nav-menu a:last-child {
                border-bottom: none;
            }

            .nav-menu a::after {
                display: none;
            }


            /* =====================================
       MENU AKTIF
    ===================================== */

            .menu-toggle:checked~.nav-menu {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }


            /* =====================================
       ANIMASI HAMBURGER → X
    ===================================== */

            .menu-toggle:checked+.hamburger span:nth-child(1) {
                transform: translateY(11px) rotate(45deg);
            }

            .menu-toggle:checked+.hamburger span:nth-child(2) {
                opacity: 0;
            }

            .menu-toggle:checked+.hamburger span:nth-child(3) {
                transform: translateY(-11px) rotate(-45deg);
            }
        }

        /* =========================================
   HERO
========================================= */

        .hero {
            min-height: 100vh;
            display: flex;
            align-items: left;
            padding-top: 75px;
        }

        .hero-content {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            align-items: center;
            gap: 80px;
        }

        .subtitle {
            color: #8b5cf6;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 4px;
            margin-bottom: 15px;
        }

        .hero h1 {
            font-size: clamp(55px, 9vw, 100px);
            line-height: 0.95;
            letter-spacing: -4px;
        }

        .hero h1 span {
            color: #8b5cf6;
        }

        .hero h2 {
            margin-top: 25px;
            font-size: clamp(20px, 3vw, 30px);
            color: #d1d5db;
            font-weight: 500;
        }

        .hero-description {
            max-width: 600px;
            margin-top: 20px;
            color: #9ca3af;
            font-size: 17px;
        }

        .hero-buttons {
            display: flex;
            gap: 15px;
            margin-top: 35px;
        }

        .btn {
            padding: 13px 25px;
            border-radius: 7px;
            font-size: 14px;
            font-weight: 700;
            transition: 0.3s;
        }

        .btn-primary {
            background: #8b5cf6;
            color: white;
        }

        .btn-primary:hover {
            background: #7c3aed;
            transform: translateY(-3px);
        }

        .btn-outline {
            border: 1px solid #363944;
            color: #ffffff;
        }

        .btn-outline:hover {
            border-color: #8b5cf6;
            color: #8b5cf6;
        }


        /* =========================================
   HERO IMAGE
========================================= */

        .hero-image {
            display: flex;
            justify-content: center;
        }

        .image-frame {
            width: min(380px, 100%);
            aspect-ratio: 1;
            padding: 12px;
            border: 1px solid #30333d;
            border-radius: 25px;
            transform: rotate(3deg);
        }

        .image-frame img {
            height: 100%;
            object-fit: cover;
            border-radius: 18px;
            filter: grayscale(20%);
        }


        /* =========================================
   ABOUT
========================================= */

        .about {
            background: #10131a;
        }

        .about-grid {
            display: grid;
            grid-template-columns: 0.8fr 1.2fr;
            gap: 80px;
            align-items: center;
        }

        .about-image img {
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 15px;
        }

        .about-text h3 {
            font-size: 30px;
            line-height: 1.3;
            margin-bottom: 20px;
        }

        .about-text p {
            color: #9ca3af;
            margin-bottom: 15px;
        }

        .about-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 35px;
        }

        .about-info div {
            display: flex;
            flex-direction: column;
            padding-bottom: 15px;
            border-bottom: 1px solid #292c35;
        }

        .about-info strong {
            font-size: 13px;
            color: #ffffff;
        }

        .about-info span {
            color: #9ca3af;
            font-size: 14px;
        }


        /* =========================================
   SKILLS
========================================= */

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }

        .skill-card {
            padding: 35px 25px;
            background: #10131a;
            border: 1px solid #252832;
            border-radius: 12px;
            transition: 0.3s;
        }

        .skill-card:hover {
            transform: translateY(-8px);
            border-color: #8b5cf6;
        }

        .skill-icon {
            color: #8b5cf6;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 35px;
        }

        .skill-card h3 {
            font-size: 20px;
            margin-bottom: 12px;
        }

        .skill-card p {
            color: #9296a2;
            font-size: 14px;
        }


        /* =========================================
   PORTFOLIO
========================================= */

        .portfolio {
            background: #10131a;
        }

        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
        }

        .project-card {
            background: #0b0d12;
            border: 1px solid #252832;
            border-radius: 12px;
            overflow: hidden;
            transition: 0.3s;
        }

        .project-card:hover {
            transform: translateY(-8px);
            border-color: #8b5cf6;
        }

        .project-image {
            height: 230px;
            overflow: hidden;
        }

        .project-image img {
            height: 100%;
            object-fit: cover;
            transition: 0.5s;
        }

        .project-card:hover .project-image img {
            transform: scale(1.05);
        }

        .project-content {
            padding: 25px;
        }

        .project-category {
            color: #8b5cf6;
            font-size: 11px;
            letter-spacing: 2px;
            font-weight: 700;
        }

        .project-content h3 {
            font-size: 21px;
            margin: 8px 0;
        }

        .project-content p:not(.project-category) {
            color: #9296a2;
            font-size: 14px;
        }

        .project-link {
            display: inline-block;
            margin-top: 20px;
            color: #ffffff;
            font-size: 14px;
            font-weight: 700;
        }

        .project-link:hover {
            color: #8b5cf6;
        }


        /* =========================================
   EXPERIENCE
========================================= */

        .timeline {
            max-width: 850px;
            border-left: 1px solid #343741;
            margin-left: 10px;
        }

        .timeline-item {
            position: relative;
            padding: 0 0 55px 40px;
        }

        .timeline-item:last-child {
            padding-bottom: 0;
        }

        .timeline-item::before {
            content: "";
            width: 12px;
            height: 12px;
            background: #8b5cf6;
            border-radius: 50%;
            position: absolute;
            left: -6px;
            top: 5px;
        }

        .timeline-date {
            color: #8b5cf6;
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .timeline-content h3 {
            font-size: 24px;
        }

        .timeline-content h4 {
            color: #d1d5db;
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 10px;
        }

        .timeline-content p {
            color: #9296a2;
        }


        /* =========================================
   CONTACT
========================================= */

        .contact {
            background: #10131a;
        }

        .contact-container {
            text-align: center;
        }

        .contact-container .section-heading {
            margin-left: auto;
            margin-right: auto;
        }

        .contact-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            text-align: left;
        }

        .contact-card {
            display: flex;
            align-items: center;
            gap: 18px;
            padding: 25px;
            background: #0b0d12;
            border: 1px solid #252832;
            border-radius: 10px;
            transition: 0.3s;
        }

        .contact-card:hover {
            border-color: #8b5cf6;
            transform: translateY(-5px);
        }

        .contact-icon {
            width: 45px;
            height: 45px;
            display: grid;
            place-items: center;
            border-radius: 8px;
            background: #191522;
            color: #8b5cf6;
            font-weight: 700;
        }

        .contact-card small {
            display: block;
            color: #777c89;
            font-size: 11px;
        }

        .contact-card strong {
            font-size: 14px;
        }


        /* =========================================
   FOOTER
========================================= */

        .footer {
            padding: 30px 0;
            border-top: 1px solid #20232c;
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #777c89;
            font-size: 13px;
        }

        .footer a:hover {
            color: #8b5cf6;
        }


        /* =========================================
   TABLET
========================================= */

        @media (max-width: 900px) {

            .nav-menu {
                gap: 15px;
            }

            .hero-content {
                grid-template-columns: 1fr 0.7fr;
                gap: 40px;
            }

            .about-grid {
                gap: 40px;
            }

            .skills-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .portfolio-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .contact-grid {
                grid-template-columns: 1fr;
            }
        }


        /* =========================================
   MOBILE
========================================= */

        @media (max-width: 650px) {

            .section {
                padding: 80px 0;
            }

            .header {
                position: relative;
            }

            .navbar {
                min-height: auto;
                padding: 20px 0;
                flex-direction: column;
                gap: 20px;
            }

            .nav-menu {
                width: 100%;
                overflow-x: auto;
                justify-content: flex-start;
                gap: 22px;
                padding-bottom: 5px;
            }

            .nav-menu a {
                white-space: nowrap;
                font-size: 13px;
            }

            .hero {
                min-height: auto;
                padding: 90px 0;
            }

            .hero-content {
                grid-template-columns: 1fr;
                gap: 60px;
            }

            .hero h1 {
                font-size: clamp(55px, 18vw, 85px);
            }

            .hero-description {
                font-size: 15px;
            }

            .hero-buttons {
                flex-direction: column;
            }

            .btn {
                text-align: center;
            }

            .hero-image {
                max-width: 300px;
                margin: auto;
            }

            .about-grid {
                grid-template-columns: 1fr;
                gap: 40px;
            }

            .about-text h3 {
                font-size: 25px;
            }

            .about-info {
                grid-template-columns: 1fr;
            }

            .skills-grid {
                grid-template-columns: 1fr;
            }

            .portfolio-grid {
                grid-template-columns: 1fr;
            }

            .project-image {
                height: 220px;
            }

            .timeline-item {
                padding-left: 30px;
            }

            .footer-content {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }
        }


        /* =========================================
   SMALL MOBILE
========================================= */

        @media (max-width: 400px) {

            .hero h1 {
                letter-spacing: -2px;
            }

            .section-heading h2 {
                font-size: 32px;
            }

            .contact-card {
                padding: 18px;
            }
        }
    </style>
</head>

<body>

    <!-- NAVBAR -->

    <header class="header">
        <nav class="navbar container">

            <a href="#home" class="logo">
                D F R<span> . </span>
            </a>

            <!-- Hamburger -->
            <input type="checkbox" id="menu-toggle" class="menu-toggle">

            <label for="menu-toggle" class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </label>

            <!-- Navigation -->
            <div class="nav-menu">
                <a href="#home">Home</a>
                <a href="#about">Tentang</a>
                <a href="#skills">Keahlian</a>
                <a href="#portfolio">Portofolio</a>
                <a href="#experience">Pengalaman</a>
                <a href="#contact">Kontak</a>
            </div>

        </nav>
    </header>



    <main>

        <!-- HERO -->
        

        <!-- ABOUT -->
        <section id="about" class="section about">
            <div class="container">

                <div class="section-heading">
                    <p class="section-label">TENTANG SAYA</p>
                    <h2>Kenali Saya Lebih Dekat</h2>
                </div>

                <div class="about-grid">

                    <div class="about-image">
                        <img src="https://6a964bcf3db6a220b863f9b5.imgix.net/sandbox/dfr-profile.png" alt="Foto profil">
                    </div>

                    <div class="about-text">
                        <h3>Saya senang menciptakan sesuatu yang bermakna.</h3>

                        <p>

                            Saya adalah guru Pengembangan Perangkat Lunak dan Gim (PPLG) di SMKN 4 Malang.
                            dengan pengalaman dalam pengembangan aplikasi web, basis data, dan pembelajaran berbasis
                            teknologi. <br>
                            Saya menguasai HTML, CSS, JavaScript,
                            PHP, Laravel, dan MySQL. Beliau aktif mengembangkan LMS, modul pembelajaran, dan
                            pembelajaran berbasis proyek
                            untuk mendukung pendidikan kejuruan yang inovatif dan berfokus pada industri.
                        </p>

                        <p>
                            Saya percaya bahwa sebuah website bukan hanya harus
                            terlihat menarik, tetapi juga mudah digunakan,
                            cepat, dan mampu menyampaikan pesan dengan jelas.
                        </p>

                        <div class="about-info">
                            <div>
                                <strong>Nama</strong>
                                <span>Dhanang Fitra Riaji (DFR)</span>
                            </div>

                            <div>
                                <strong>Email</strong>
                                <span>dhanangfitra@gmail.com</span>
                            </div>

                            <div>
                                <strong>Lokasi</strong>
                                <span>Malang, Indonesia</span>
                            </div>

                            <div>
                                <strong>Status</strong>
                                <span>Available for work</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>


        <!-- SKILLS -->
        <section id="skills" class="section skills">
            <div class="container">

                <div class="section-heading">
                    <p class="section-label">KEAHLIAN</p>
                    <h2>Yang Saya Kuasai</h2>
                </div>

                <div class="skills-grid">

                    <div class="skill-card">
                        <div class="skill-icon">01</div>
                        <h3>HTML & CSS</h3>
                        <p>
                            Membangun struktur website yang rapi,
                            responsif, dan modern.
                        </p>
                    </div>

                    <div class="skill-card">
                        <div class="skill-icon">02</div>
                        <h3>Web Design</h3>
                        <p>
                            Membuat desain antarmuka yang sederhana,
                            profesional, dan user-friendly.
                        </p>
                    </div>

                    <div class="skill-card">
                        <div class="skill-icon">03</div>
                        <h3>UI / UX</h3>
                        <p>
                            Merancang pengalaman pengguna yang nyaman
                            dan mudah dipahami.
                        </p>
                    </div>

                    <div class="skill-card">
                        <div class="skill-icon">04</div>
                        <h3>Responsive Design</h3>
                        <p>
                            Website dapat menyesuaikan tampilan
                            dengan berbagai ukuran perangkat.
                        </p>
                    </div>

                </div>

            </div>
        </section>


        <!-- PORTFOLIO -->
        <section id="portfolio" class="section portfolio">
            <div class="container">

                <div class="section-heading">
                    <p class="section-label">PORTOFOLIO</p>
                    <h2>Beberapa Proyek Saya</h2>
                </div>

                <div class="portfolio-grid">

                    <article class="project-card">
                        <div class="project-image">
                            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
                                alt="Project website bisnis">
                        </div>

                        <div class="project-content">
                            <p class="project-category">
                                WEBSITE
                            </p>

                            <h3>Website Company Profile</h3>

                            <p>
                                Website profesional untuk perusahaan
                                dengan tampilan modern dan responsive.
                            </p>

                            <a href="#" class="project-link">
                                Lihat Project →
                            </a>
                        </div>
                    </article>


                    <article class="project-card">
                        <div class="project-image">
                            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
                                alt="Project toko online">
                        </div>

                        <div class="project-content">
                            <p class="project-category">
                                E-COMMERCE
                            </p>

                            <h3>Online Store</h3>

                            <p>
                                Konsep website toko online dengan
                                fokus pada kemudahan pengguna.
                            </p>

                            <a href="#" class="project-link">
                                Lihat Project →
                            </a>
                        </div>
                    </article>


                    <article class="project-card">
                        <div class="project-image">
                            <img src="https://images.unsplash.com/photo-1558655146-d09347e92766"
                                alt="Project dashboard">
                        </div>

                        <div class="project-content">
                            <p class="project-category">
                                UI DESIGN
                            </p>

                            <h3>Dashboard Interface</h3>

                            <p>
                                Desain dashboard dengan struktur informasi
                                yang sederhana dan mudah digunakan.
                            </p>

                            <a href="#" class="project-link">
                                Lihat Project →
                            </a>
                        </div>
                    </article>

                </div>

            </div>
        </section>


        <!-- EXPERIENCE -->
        <section id="experience" class="section experience">
            <div class="container">

                <div class="section-heading">
                    <p class="section-label">PENGALAMAN</p>
                    <h2>Perjalanan Karier</h2>
                </div>

                <div class="timeline">

                    <div class="timeline-item">
                        <div class="timeline-date">
                            2024 — Sekarang
                        </div>

                        <div class="timeline-content">
                            <h3>Web Developer</h3>
                            <h4>Nama Perusahaan</h4>
                            <p>
                                Mengembangkan dan memelihara website
                                perusahaan serta membuat berbagai
                                kebutuhan digital.
                            </p>
                        </div>
                    </div>


                    <div class="timeline-item">
                        <div class="timeline-date">
                            2022 — Sekarang
                        </div>

                        <div class="timeline-content">
                            <h3>UI Designer</h3>
                            <h4>Nama Perusahaan</h4>
                            <p>
                                Membuat desain antarmuka dan meningkatkan
                                pengalaman pengguna untuk berbagai produk digital.
                            </p>
                        </div>
                    </div>


                    <div class="timeline-item">
                        <div class="timeline-date">
                            2000 — Sekarang
                        </div>

                        <div class="timeline-content">
                            <h3>Freelance Web Developer</h3>
                            <h4>Independent</h4>
                            <p>
                                Mengerjakan berbagai proyek aplikasi website,
                                untuk klien.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </section>


        <!-- CONTACT -->
        <section id="contact" class="section contact">
            <div class="container contact-container">

                <div class="section-heading">
                    <p class="section-label">KONTAK</p>
                    <h2>Mari Bekerja Sama</h2>

                    <p>
                        Punya proyek atau ide yang ingin diwujudkan?
                        Jangan ragu untuk menghubungi saya.
                    </p>
                </div>

                <div class="contact-grid">

                    <a href="mailto:dhanangfitra@gmail.com" class="contact-card">
                        <span class="contact-icon">@</span>
                        <div>
                            <small>Email</small>
                            <strong>dhanangfitra@gmail.com</strong>
                        </div>
                    </a>

                    <a href="https://www.linkedin.com/in/dhanang-fitra-09279a427/" class="contact-card" target="_blank">
                        <span class="contact-icon">in</span>
                        <div>
                            <small>LinkedIn</small>
                            <strong>linkedin.com/in/dhanangfitra</strong>
                        </div>
                    </a>

                    <a href="https://www.instagram.com/dhanangfr" class="contact-card" target="_blank">
                        <span class="contact-icon">IG</span>
                        <div>
                            <small>Instagram</small>
                            <strong>@dhanangfr</strong>
                        </div>
                    </a>

                </div>

            </div>
        </section>

    </main>


    <!-- FOOTER -->
    <footer class="footer">
        <div class="container footer-content">
            <p>
                © 2026 Nama Anda. All Rights Reserved.
            </p>

            <a href="#home">
                Kembali ke atas ↑
            </a>
        </div>
    </footer>

</body>

</html>
