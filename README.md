<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Titan Folio - Creative Developer</title>
    <link rel="stylesheet" href="tooplate-titan-style.css">
    <style>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --glass-bg: rgba(255, 255, 255, 0.08);
    --glass-border: rgba(255, 255, 255, 0.15);
    --accent-blue: #76a9fa;
    --accent-blue-dark: #4f83f7;
    --accent-glow: rgba(118, 169, 250, 0.3);
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.8);
    --text-tertiary: rgba(255, 255, 255, 0.6);
}

body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: linear-gradient(135deg, #0a0a0f 0%, #151520 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%);
    background-attachment: fixed;
    color: var(--text-primary);
    overflow-x: hidden;
    min-height: 100vh;
    line-height: 1.6;
}

p a {
	color: #FFF;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Navigation */
nav {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    padding: 1rem 0;
    transition: all 0.3s ease;
    background: rgba(15, 25, 35, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

nav.scrolled {
    background: rgba(15, 25, 35, 0.95);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

@media (max-width: 1000px) {
    .nav-container {
        justify-content: center;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1rem 2rem;
    }
    
    .logo {
        order: 1;
    }
    
    .nav-links {
        order: 2;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .mobile-menu-btn {
        display: none !important;
    }
    
    .hero {
        padding-top: 240px;
    }
}

@media (max-width: 880px) {
    .hero {
        padding-top: 160px;
    }
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: inherit;
}

.logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark));
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px var(--accent-glow);
    font-size: 1.2rem;
}

.logo-text {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.5px;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 1rem;
}

.nav-links a {
    color: var(--text-secondary);
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    transition: all 0.3s ease;
    font-weight: 500;
    letter-spacing: 0.5px;
    position: relative;
    border: 2px solid transparent;
}

.nav-links a::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--accent-blue);
    transition: all 0.3s ease;
    transform: translateX(-50%);
}

.nav-links a:hover {
    color: var(--accent-blue);
    border-color: var(--accent-blue);
    transform: translateY(-2px);
    background: rgba(118, 169, 250, 0.1);
}

.nav-links a:hover::after {
    width: 60%;
}

.nav-links a.active {
    color: var(--accent-blue);
    background: rgba(118, 169, 250, 0.15);
    border-color: var(--accent-blue);
    box-shadow: 0 4px 15px var(--accent-glow);
}

/* Mobile menu */
.mobile-menu-btn {
    display: none;
    flex-direction: column;
    cursor: pointer;
    gap: 4px;
    padding: 0.5rem;
}

.mobile-menu-btn span {
    width: 25px;
    height: 3px;
    background: var(--text-primary);
    border-radius: 2px;
    transition: all 0.3s ease;
}

.mobile-menu-btn.active span:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-btn.active span:nth-child(2) {
    opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
}

.mobile-nav {
    position: fixed;
    top: 80px;
    left: 0;
    width: 100%;
    background: rgba(15, 25, 35, 0.95);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    transform: translateY(-100%);
    transition: transform 0.3s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    opacity: 0;
    pointer-events: none;
}

.mobile-nav.active {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
}

.mobile-nav ul {
    list-style: none;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.mobile-nav a {
    color: var(--text-secondary);
    text-decoration: none;
    padding: 1rem;
    border-radius: 15px;
    transition: all 0.3s ease;
    text-align: center;
    font-weight: 500;
    display: block;
    position: relative;
    border: 2px solid transparent;
}

.mobile-nav a:hover {
    color: var(--accent-blue);
    background: rgba(118, 169, 250, 0.1);
    border-color: var(--accent-blue);
}

.mobile-nav a.active {
    color: var(--accent-blue);
    background: rgba(118, 169, 250, 0.15);
    border-color: var(--accent-blue);
}

/* Section styling */
section {
    padding: 5rem 0;
    position: relative;
}

.section-header {
    text-align: center;
    margin-top: 4rem;
    margin-bottom: 4rem;
}

.section-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-primary);
    letter-spacing: -1px;
}

.section-subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
}

/* Hero section */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 160px 2rem 0;
    position: relative;
    overflow: hidden;
}

/* Animated background elements */
.hero-bg-animation {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 1;
}

.floating-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.6;
    animation: float 25s infinite ease-in-out;
}

.shape-1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(118, 169, 250, 0.4) 0%, transparent 70%);
    top: -200px;
    left: -200px;
    animation-delay: 0s;
}

.shape-2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(79, 131, 247, 0.3) 0%, transparent 70%);
    top: 50%;
    right: -150px;
    animation-delay: 7s;
}

.shape-3 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(118, 169, 250, 0.35) 0%, transparent 70%);
    bottom: -100px;
    left: 20%;
    animation-delay: 14s;
}

/* Geometric shapes */
.geo-shape {
    position: absolute;
    opacity: 0.1;
    animation: rotate-float 30s infinite linear;
}

.geo-1 {
    width: 300px;
    height: 300px;
    top: 20%;
    right: 10%;
    background: linear-gradient(45deg, var(--accent-blue) 0%, transparent 100%);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.geo-2 {
    width: 250px;
    height: 250px;
    bottom: 20%;
    left: 5%;
    background: linear-gradient(135deg, var(--accent-blue-dark) 0%, transparent 100%);
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    animation-delay: -10s;
}

@keyframes float {
    0%, 100% {
        transform: translate(0, 0) scale(1) rotate(0deg);
    }
    25% {
        transform: translate(100px, -80px) scale(1.1) rotate(90deg);
    }
    50% {
        transform: translate(-60px, 60px) scale(0.9) rotate(180deg);
    }
    75% {
        transform: translate(80px, 100px) scale(1.05) rotate(270deg);
    }
}

@keyframes rotate-float {
    0% {
        transform: rotate(0deg) translateY(0);
    }
    50% {
        transform: rotate(180deg) translateY(-50px);
    }
    100% {
        transform: rotate(360deg) translateY(0);
    }
}

.particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: var(--accent-blue);
    border-radius: 50%;
    opacity: 0;
    animation: particle-rise 10s infinite ease-out;
}

@keyframes particle-rise {
    0% {
        opacity: 0;
        transform: translateY(100vh) scale(0);
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: translateY(-100px) scale(1);
    }
}

/* Generate multiple particles */
.particle:nth-child(1) { left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { left: 20%; animation-delay: 1s; }
.particle:nth-child(3) { left: 30%; animation-delay: 2s; }
.particle:nth-child(4) { left: 40%; animation-delay: 3s; }
.particle:nth-child(5) { left: 50%; animation-delay: 4s; }
.particle:nth-child(6) { left: 60%; animation-delay: 5s; }
.particle:nth-child(7) { left: 70%; animation-delay: 6s; }
.particle:nth-child(8) { left: 80%; animation-delay: 7s; }
.particle:nth-child(9) { left: 90%; animation-delay: 8s; }
.particle:nth-child(10) { left: 95%; animation-delay: 9s; }

.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 25% 25%, var(--accent-glow) 0%, transparent 50%);
    animation: hero-glow 8s ease-in-out infinite;
    z-index: 1;
}

@keyframes hero-glow {
    0%, 100% { 
        transform: scale(1) rotate(0deg);
        opacity: 0.7;
    }
    50% { 
        transform: scale(1.1) rotate(2deg);
        opacity: 1;
    }
}

.hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 1000px;
    margin: 0 auto;
}

.hero h1 {
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 800;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
    line-height: 1.1;
    letter-spacing: -2px;
    animation: slideInUp 1s ease-out;
}

.hero .subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: var(--text-secondary);
    font-weight: 300;
    letter-spacing: 1px;
    animation: slideInUp 1s ease-out 0.3s both;
}

.cta-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 2rem;
    animation: slideInUp 1s ease-out 0.6s both;
}

.cta-primary, .cta-secondary {
    padding: 1rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    display: inline-block;
}

.cta-primary {
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark));
    color: white;
    box-shadow: 0 8px 25px var(--accent-glow);
}

.cta-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px var(--accent-glow);
}

.cta-secondary {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    color: white;
}

.cta-secondary:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-3px);
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Stats */
.stats-section {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 4rem;
    flex-wrap: wrap;
}

.stat-card {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    min-width: 150px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    display: block;
}

.stat-label {
    font-size: 1rem;
    color: var(--text-secondary);
    margin-top: 0.5rem;
}

/* About section */
.about-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin-top: 3rem;
}

.about-intro {
    display: flex;
    align-items: center;
    gap: 3rem;
    flex-wrap: wrap;
    justify-content: center;
}

.about-image {
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background-image: url('images/about-profile.jpg');
    background-size: cover;
    background-position: center;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    border: 4px solid var(--glass-border);
}

.about-image::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(118, 169, 250, 0.2) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.about-image:hover::before {
    opacity: 1;
}

.about-image::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, 
        transparent 0deg,
        rgba(255,255,255,0.1) 90deg,
        transparent 180deg,
        rgba(255,255,255,0.05) 270deg,
        transparent 360deg);
    animation: spin 4s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.about-text {
    flex: 1;
    min-width: 300px;
}

.about-text h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.about-text p {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
}

.about-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.about-card {
    background: var(--glass-bg);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid var(--glass-border);
    border-radius: 25px;
    padding: 2.5rem;
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
}

.about-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255,255,255,0.08) 50%, 
        transparent 100%);
    transition: left 0.6s ease;
}

.about-card:hover::before {
    left: 100%;
}

.about-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.about-card h4 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.about-card p {
    color: var(--text-secondary);
}

/* Skills section */
.skills-container {
    position: relative;
    margin-top: 3rem;
}

.skills-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.skills-visual {
    position: relative;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.skills-circle {
    position: relative;
    width: 400px;
    height: 400px;
    animation: rotate-slow 30s linear infinite;
}

@keyframes rotate-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.skill-node {
    position: absolute;
    width: 124px;
    height: 124px;
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 2px solid var(--glass-border);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;
    animation: counter-rotate 30s linear infinite;
}

@keyframes counter-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
}

.skill-node:hover {
    transform: scale(1.2) rotate(0deg);
    background: rgba(118, 169, 250, 0.2);
    border-color: var(--accent-blue);
    box-shadow: 0 0 30px var(--accent-glow);
    animation-play-state: paused;
}

.skill-node .skill-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.skill-node .skill-name {
    font-size: 0.8rem;
    font-weight: 600;
    text-align: center;
    color: var(--text-primary);
}

/* Position skill nodes in a circle with counter-rotation */
.skill-node:nth-child(1) { 
    top: 0; 
    left: 50%; 
    transform: translateX(-50%) translateY(-50%);
    animation: counter-rotate-1 30s linear infinite;
}
.skill-node:nth-child(2) { 
    top: 25%; 
    right: 0; 
    transform: translateX(50%) translateY(-50%);
    animation: counter-rotate-2 30s linear infinite;
}
.skill-node:nth-child(3) { 
    top: 75%; 
    right: 0; 
    transform: translateX(50%) translateY(-50%);
    animation: counter-rotate-3 30s linear infinite;
}
.skill-node:nth-child(4) { 
    bottom: 0; 
    left: 50%; 
    transform: translateX(-50%) translateY(50%);
    animation: counter-rotate-4 30s linear infinite;
}
.skill-node:nth-child(5) { 
    top: 75%; 
    left: 0; 
    transform: translateX(-50%) translateY(-50%);
    animation: counter-rotate-5 30s linear infinite;
}
.skill-node:nth-child(6) { 
    top: 25%; 
    left: 0; 
    transform: translateX(-50%) translateY(-50%);
    animation: counter-rotate-6 30s linear infinite;
}

/* Individual counter-rotation animations to maintain position */
@keyframes counter-rotate-1 {
    from { transform: translateX(-50%) translateY(-50%) rotate(0deg); }
    to { transform: translateX(-50%) translateY(-50%) rotate(-360deg); }
}
@keyframes counter-rotate-2 {
    from { transform: translateX(50%) translateY(-50%) rotate(0deg); }
    to { transform: translateX(50%) translateY(-50%) rotate(-360deg); }
}
@keyframes counter-rotate-3 {
    from { transform: translateX(50%) translateY(-50%) rotate(0deg); }
    to { transform: translateX(50%) translateY(-50%) rotate(-360deg); }
}
@keyframes counter-rotate-4 {
    from { transform: translateX(-50%) translateY(50%) rotate(0deg); }
    to { transform: translateX(-50%) translateY(50%) rotate(-360deg); }
}
@keyframes counter-rotate-5 {
    from { transform: translateX(-50%) translateY(-50%) rotate(0deg); }
    to { transform: translateX(-50%) translateY(-50%) rotate(-360deg); }
}
@keyframes counter-rotate-6 {
    from { transform: translateX(-50%) translateY(-50%) rotate(0deg); }
    to { transform: translateX(-50%) translateY(-50%) rotate(-360deg); }
}

.skills-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150px;
    height: 150px;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: white;
    box-shadow: 0 0 50px var(--accent-glow);
    z-index: 10;
}

.skills-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.skill-item {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    border-left: 4px solid var(--accent-blue);
}

.skill-item:hover {
    transform: translateX(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    background: rgba(118, 169, 250, 0.1);
}

.skill-item h4 {
    font-size: 1.2rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.skill-item p {
    color: var(--text-secondary);
    font-size: 0.95rem;
}

.skill-progress {
    margin-top: 1rem;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.skill-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-blue), var(--accent-blue-dark));
    border-radius: 3px;
    transition: width 1s ease;
}

/* Timeline section */
.timeline-container {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 0;
}

.timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(
        to bottom,
        transparent 0%,
        var(--accent-blue) 10%,
        var(--accent-blue) 90%,
        transparent 100%
    );
    transform: translateX(-50%);
    z-index: -1;
}

.timeline-progress {
    position: absolute;
    left: 50%;
    top: 0;
    width: 4px;
    background: linear-gradient(to bottom, var(--accent-blue-dark), var(--accent-blue));
    transform: translateX(-50%);
    transition: height 0.3s ease;
    z-index: 0;
    box-shadow: 0 0 20px var(--accent-glow);
}

.timeline-item {
    position: relative;
    margin: 4rem 0;
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.8s ease;
}

.timeline-item.visible {
    opacity: 1;
    transform: translateY(0);
}

.timeline-item:nth-child(odd) {
    text-align: right;
    padding-right: calc(50% + 3rem);
}

.timeline-item:nth-child(even) {
    text-align: left;
    padding-left: calc(50% + 3rem);
}

.timeline-node {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark));
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    z-index: 3;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 20px var(--accent-glow);
}

.timeline-node:hover {
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 0 40px var(--accent-glow);
}

.timeline-node.active {
    transform: translate(-50%, -50%) scale(1.3);
    animation: pulse-node 2s infinite;
}

@keyframes pulse-node {
    0%, 100% {
        box-shadow: 0 0 20px var(--accent-glow);
    }
    50% {
        box-shadow: 0 0 40px var(--accent-glow), 0 0 60px var(--accent-glow);
    }
}

.timeline-content {
    background: var(--glass-bg);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid var(--glass-border);
    border-radius: 25px;
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
}

.timeline-content:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    background: rgba(118, 169, 250, 0.1);
}

.timeline-content::before {
    content: '';
    position: absolute;
    top: 50%;
    width: 20px;
    height: 20px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    transform: rotate(45deg) translateY(-50%);
    z-index: -1;
}

.timeline-item:nth-child(odd) .timeline-content::before {
    right: -3px;
}

.timeline-item:nth-child(even) .timeline-content::before {
    left: -18px;
}

.timeline-year {
    display: inline-block;
    padding: 0.5rem 1.5rem;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark));
    color: white;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 1rem;
    box-shadow: 0 4px 15px var(--accent-glow);
}

.timeline-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.timeline-company {
    font-size: 1.1rem;
    color: var(--accent-blue);
    font-weight: 600;
    margin-bottom: 1rem;
}

.timeline-description {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.timeline-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.timeline-skill {
    padding: 0.3rem 0.8rem;
    background: rgba(118, 169, 250, 0.2);
    border: 1px solid rgba(118, 169, 250, 0.3);
    border-radius: 15px;
    font-size: 0.8rem;
    color: var(--accent-blue);
    transition: all 0.3s ease;
}

.timeline-skill:hover {
    background: rgba(118, 169, 250, 0.3);
    transform: translateY(-2px);
}

.timeline-achievements {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.timeline-achievement {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.timeline-achievement::before {
    content: '✨';
    font-size: 1rem;
}

/* Timeline controls */
.timeline-controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 3rem;
    flex-wrap: wrap;
}

.timeline-filter {
    padding: 0.8rem 1.5rem;
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 25px;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.3s ease;
    font-weight: 500;
    cursor: pointer;
}

.timeline-filter:hover,
.timeline-filter.active {
    background: rgba(118, 169, 250, 0.2);
    border-color: var(--accent-blue);
    color: var(--accent-blue);
    transform: translateY(-2px);
}

/* Mobile timeline adjustments */
@media (max-width: 768px) {
    .timeline-line,
    .timeline-progress {
        left: 2rem;
    }

    .timeline-item {
        padding-left: 5rem !important;
        padding-right: 1rem !important;
        text-align: left !important;
    }

    .timeline-node {
        left: 2rem !important;
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
    }

    .timeline-content::before {
        left: -18px !important;
        right: auto !important;
    }

    .timeline-controls {
        flex-direction: column;
        align-items: center;
    }

    .timeline-filter {
        width: 100%;
        max-width: 300px;
        text-align: center;
    }

    .timeline-container {
        padding: 2rem 0;
        min-height: 200px;
    }

    .timeline-item {
        margin: 2rem 0;
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
}
.portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2.5rem;
    margin-top: 3rem;
}

.portfolio-card {
    background: var(--glass-bg);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid var(--glass-border);
    border-radius: 30px;
    overflow: hidden;
    transition: all 0.4s ease;
    position: relative;
}

.portfolio-card:hover {
    transform: translateY(-15px);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
}

.portfolio-image {
    height: 250px;
    position: relative;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.portfolio-image::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.portfolio-card:hover .portfolio-image::after {
    opacity: 1;
}

.portfolio-image::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, 
        transparent 30%, 
        rgba(255,255,255,0.3) 50%, 
        transparent 70%);
    transition: left 0.6s ease;
    z-index: 1;
}

.portfolio-card:hover .portfolio-image::before {
    left: 100%;
}

/* Specific portfolio images */
.portfolio-image.ecommerce {
    background-image: url('images/portfolio-ecommerce.jpg');
}

.portfolio-image.analytics {
    background-image: url('images/portfolio-analytics.jpg');
}

.portfolio-image.music {
    background-image: url('images/portfolio-music.jpg');
}

.portfolio-content {
    padding: 2rem;
}

.portfolio-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.portfolio-description {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
}

.portfolio-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag {
    padding: 0.3rem 0.8rem;
    background: rgba(118, 169, 250, 0.2);
    border: 1px solid rgba(118, 169, 250, 0.3);
    border-radius: 15px;
    font-size: 0.8rem;
    color: var(--accent-blue);
}

/* Contact section */
.contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    margin-top: 3rem;
}

.contact-info {
    background: var(--glass-bg);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid var(--glass-border);
    border-radius: 30px;
    padding: 3rem;
}

.contact-form-container {
    background: var(--glass-bg);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid var(--glass-border);
    border-radius: 30px;
    padding: 3rem;
}

.contact-info h3 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
}

.contact-info p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
}

.contact-details {
    margin-top: 2rem;
}

.contact-details h4 {
    color: var(--accent-blue);
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.contact-details ul {
    list-style: none;
    padding-left: 1rem;
}

.contact-details li {
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
}

.contact-details p {
    padding-left: 1rem;
    color: var(--text-secondary);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-input, .form-textarea {
    width: 100%;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    font-family: inherit;
}

.form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--accent-blue);
    box-shadow: 0 0 20px var(--accent-glow);
    background: rgba(255, 255, 255, 0.08);
}

.form-input::placeholder, .form-textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.form-textarea {
    resize: vertical;
}

.submit-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark));
    border: none;
    border-radius: 15px;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px var(--accent-glow);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Footer */
footer {
    background: linear-gradient(135deg, 
        rgba(15, 25, 35, 0.95) 0%,
        rgba(10, 15, 25, 0.95) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem 0;
    margin-top: 4rem;
}

.footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
}

.footer-copyright {
    color: var(--text-tertiary);
    font-size: 0.9rem;
}

.footer-credits {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
}

.footer-credit-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.5rem;
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    color: var(--text-secondary);
    text-decoration: none;
    border-radius: 25px;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.footer-credit-link:hover {
    transform: translateY(-2px);
    background: rgba(118, 169, 250, 0.15);
    border-color: var(--accent-blue);
    color: var(--accent-blue);
    box-shadow: 0 6px 25px var(--accent-glow);
}

.footer-credit-link.tooplate {
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-blue-dark));
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 15px var(--accent-glow);
}

.footer-credit-link.tooplate::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255,255,255,0.2) 50%, 
        transparent 100%);
    transition: left 0.6s ease;
}

.footer-credit-link.tooplate:hover::before {
    left: 100%;
}

.footer-credit-link.tooplate:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 30px var(--accent-glow);
}

.footer-credit-icon {
    font-size: 1rem;
    transition: transform 0.3s ease;
}

.footer-credit-link:hover .footer-credit-icon {
    transform: scale(1.2) rotate(5deg);
}

.footer-divider {
    width: 2px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 1px;
}

/* Responsive design */
@media (max-width: 1024px) {
    .contact-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .footer-bottom {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
    }

    .footer-credits {
        justify-content: center;
    }

    .about-intro {
        flex-direction: column;
        text-align: center;
    }
}

@media (max-width: 768px) {
    .nav-container {
        flex-direction: row;
        justify-content: space-between;
    }
    
    .logo {
        order: 1;
    }
    
    .mobile-menu-btn {
        order: 2;
    }
    
    .nav-links {
        display: none;
    }

    .mobile-menu-btn {
        display: flex !important;
    }

    .hero {
        padding-top: 200px;
    }

    .hero {
        padding-top: 150px;
    }

    .hero h1 {
        font-size: clamp(2rem, 7vw, 3.5rem);
    }

    .hero .subtitle {
        font-size: 1.2rem;
    }

    .cta-buttons {
        width: 100%;
    }

    .cta-primary, .cta-secondary {
        width: 100%;
        text-align: center;
    }

    .stats-section {
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .stat-card {
        width: 100%;
        max-width: 300px;
    }

    .about-cards {
        grid-template-columns: 1fr;
    }

    .skills-wrapper {
        grid-template-columns: 1fr;
        gap: 3rem;
    }

    .skills-visual {
        height: 400px;
        margin: 0 auto;
    }

    .skills-circle {
        width: 300px;
        height: 300px;
    }

    .skill-node {
        width: 104px;
        height: 104px;
    }

    .skill-node .skill-icon {
        font-size: 1.5rem;
    }

    .skill-node .skill-name {
        font-size: 0.7rem;
    }

    .skills-center {
        width: 120px;
        height: 120px;
        font-size: 2.5rem;
    }

    .portfolio-grid {
        grid-template-columns: 1fr;
    }

    .contact-info,
    .contact-form-container {
        padding: 2rem;
    }

    .footer-bottom {
        flex-direction: column;
        text-align: center;
        gap: 3rem;
    }

    .footer-credits {
        flex-direction: column;
        align-items: center;
    }

    .footer-divider {
        display: none;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 1rem;
    }

    .nav-container {
        padding: 0 1rem;
    }

    .hero h1 {
        font-size: 2rem;
    }

    .section-title {
        font-size: 1.8rem;
    }

    .portfolio-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .portfolio-card {
        border-radius: 20px;
    }

    .contact-info,
    .contact-form-container {
        padding: 1.5rem;
        border-radius: 20px;
    }

    .about-image {
        width: 200px;
        height: 200px;
    }
}

/* Scroll animations */
.fade-in {
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.8s ease;
}

.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Focus states for accessibility */
.nav-links a:focus,
.cta-primary:focus,
.cta-secondary:focus,
.form-input:focus,
.form-textarea:focus,
.submit-btn:focus {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
}
    </style>

</head>

<body>
    <nav id="navbar">
        <div class="nav-container">
            <a href="#home" class="logo">
                <div class="logo-icon">⚡</div>
                <div class="logo-text">Titan Folio</div>
            </a>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#timeline">Journey</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <div class="mobile-menu-btn" id="mobileMenuBtn">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <div class="mobile-nav" id="mobileNav">
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#timeline">Journey</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-bg-animation">
            <div class="floating-shape shape-1"></div>
            <div class="floating-shape shape-2"></div>
            <div class="floating-shape shape-3"></div>
            <div class="geo-shape geo-1"></div>
            <div class="geo-shape geo-2"></div>
            <div class="particles">
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
                <span class="particle"></span>
            </div>
        </div>
        <div class="hero-content">
            <h1>Titan Folio</h1>
            <p class="subtitle">Creative Developer & Designer</p>
            <p>Crafting digital experiences with passion and precision</p>
            <div class="cta-buttons">
                <a href="#portfolio" class="cta-primary">View My Work</a>
                <a href="#contact" class="cta-secondary">Let's Talk</a>
            </div>

            <div class="stats-section">
                <div class="stat-card">
                    <span class="stat-number">100+</span>
                    <span class="stat-label">Projects</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">5+</span>
                    <span class="stat-label">Years</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">50+</span>
                    <span class="stat-label">Clients</span>
                </div>
            </div>
        </div>
    </section>

    <section id="about" class="fade-in">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">About Me</h2>
                <p class="section-subtitle">Passionate about creating digital experiences that make a difference</p>
            </div>

            <div class="about-content">
                <div class="about-intro">
                    <div class="about-image"></div>
                    <div class="about-text">
                        <h3>My Journey</h3>
                        <p>I'm a passionate creative developer with over 5 years of experience in crafting beautiful,
                            functional websites and applications. My expertise spans across modern web technologies,
                            user experience design, and creative problem-solving.</p>
                        <p>I believe in the power of clean code, intuitive design, and seamless user experiences. When
                            I'm not coding, you can find me exploring new technologies, contributing to open-source
                            projects, or capturing moments through photography. Get organized and stay on track with <a
                                href="https://timermo.com" rel="nofollow" target="_blank">TimerMo</a> today. All photos
                            sourced from <a href="https://unsplash.com" rel="nofollow" target="_blank">Unsplash</a>.
                            Browse thousands of stunning vector stickers at <a href="https://www.vectorsticker.com"
                                rel="nofollow" target="_blank">VectorSticker</a> to enhance your designs.</p>
                    </div>
                </div>

                <div class="about-cards">
                    <div class="about-card">
                        <h4>🎯 Mission</h4>
                        <p>To create digital experiences that inspire, engage, and solve real-world problems through
                            innovative design and development.</p>
                    </div>

                    <div class="about-card">
                        <h4>💡 Vision</h4>
                        <p>A world where technology seamlessly integrates with human needs, creating more meaningful
                            digital interactions.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="skills" class="fade-in">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Skills & Expertise</h2>
                <p class="section-subtitle">Combining technical excellence with creative vision</p>
            </div>

            <div class="skills-container">
                <div class="skills-wrapper">
                    <div class="skills-visual">
                        <div class="skills-circle">
                            <div class="skill-node">
                                <div class="skill-icon">🎨</div>
                                <div class="skill-name">UI/UX</div>
                            </div>
                            <div class="skill-node">
                                <div class="skill-icon">⚛️</div>
                                <div class="skill-name">React</div>
                            </div>
                            <div class="skill-node">
                                <div class="skill-icon">📱</div>
                                <div class="skill-name">Mobile</div>
                            </div>
                            <div class="skill-node">
                                <div class="skill-icon">⚙️</div>
                                <div class="skill-name">Backend</div>
                            </div>
                            <div class="skill-node">
                                <div class="skill-icon">🚀</div>
                                <div class="skill-name">DevOps</div>
                            </div>
                            <div class="skill-node">
                                <div class="skill-icon">💡</div>
                                <div class="skill-name">Innovation</div>
                            </div>
                            <div class="skills-center">⚡</div>
                        </div>
                    </div>

                    <div class="skills-list">
                        <div class="skill-item">
                            <h4>Frontend Excellence</h4>
                            <p>Modern JavaScript frameworks, responsive design, and pixel-perfect implementations</p>
                            <div class="skill-progress">
                                <div class="skill-progress-bar" style="width: 95%"></div>
                            </div>
                        </div>

                        <div class="skill-item">
                            <h4>Creative Design</h4>
                            <p>User-centered design thinking with a focus on accessibility and visual appeal</p>
                            <div class="skill-progress">
                                <div class="skill-progress-bar" style="width: 90%"></div>
                            </div>
                        </div>

                        <div class="skill-item">
                            <h4>Full-Stack Development</h4>
                            <p>End-to-end application development from database to deployment</p>
                            <div class="skill-progress">
                                <div class="skill-progress-bar" style="width: 85%"></div>
                            </div>
                        </div>

                        <div class="skill-item">
                            <h4>Performance & Optimization</h4>
                            <p>Lightning-fast load times and seamless user experiences across all devices</p>
                            <div class="skill-progress">
                                <div class="skill-progress-bar" style="width: 92%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="timeline" class="fade-in">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">My Journey</h2>
                <p class="section-subtitle">From curious beginner to seasoned developer - here's how I got here</p>
            </div>

            <div class="timeline-controls">
                <button class="timeline-filter active" data-filter="all">All</button>
                <button class="timeline-filter" data-filter="education">Education</button>
                <button class="timeline-filter" data-filter="work">Work</button>
                <button class="timeline-filter" data-filter="project">Projects</button>
            </div>

            <div class="timeline-container">
                <div class="timeline-line"></div>
                <div class="timeline-progress"></div>

                <div class="timeline-item" data-category="education">
                    <div class="timeline-node">🎓</div>
                    <div class="timeline-content">
                        <div class="timeline-year">2018 - 2022</div>
                        <h3 class="timeline-title">Computer Science Degree</h3>
                        <div class="timeline-company">Stanford University</div>
                        <p class="timeline-description">
                            Graduated Magna Cum Laude with a focus on Human-Computer Interaction and Software
                            Engineering.
                            Developed strong foundations in algorithms, data structures, and user-centered design
                            principles.
                        </p>
                        <div class="timeline-skills">
                            <span class="timeline-skill">Java</span>
                            <span class="timeline-skill">Python</span>
                            <span class="timeline-skill">Data Structures</span>
                            <span class="timeline-skill">UI/UX Design</span>
                        </div>
                        <div class="timeline-achievements">
                            <div class="timeline-achievement">Dean's List for 6 semesters</div>
                            <div class="timeline-achievement">Led university hackathon team to 1st place</div>
                            <div class="timeline-achievement">Published research on accessibility in web design</div>
                        </div>
                    </div>
                </div>

                <div class="timeline-item" data-category="work">
                    <div class="timeline-node">💼</div>
                    <div class="timeline-content">
                        <div class="timeline-year">2022 - 2023</div>
                        <h3 class="timeline-title">Junior Frontend Developer</h3>
                        <div class="timeline-company">TechStart Inc.</div>
                        <p class="timeline-description">
                            Started my professional journey building responsive web applications for startup clients.
                            Learned to work in fast-paced environments and collaborate effectively with cross-functional
                            teams.
                        </p>
                        <div class="timeline-skills">
                            <span class="timeline-skill">React</span>
                            <span class="timeline-skill">JavaScript</span>
                            <span class="timeline-skill">CSS3</span>
                            <span class="timeline-skill">Git</span>
                        </div>
                        <div class="timeline-achievements">
                            <div class="timeline-achievement">Reduced page load times by 40%</div>
                            <div class="timeline-achievement">Built 15+ responsive landing pages</div>
                            <div class="timeline-achievement">Mentored 2 junior interns</div>
                        </div>
                    </div>
                </div>

                <div class="timeline-item" data-category="project">
                    <div class="timeline-node">🚀</div>
                    <div class="timeline-content">
                        <div class="timeline-year">2023</div>
                        <h3 class="timeline-title">EcoTrack Mobile App</h3>
                        <div class="timeline-company">Personal Project</div>
                        <p class="timeline-description">
                            Developed a React Native app for tracking personal carbon footprint with gamification
                            elements.
                            The app gained 10K+ downloads and positive reviews for its intuitive design.
                        </p>
                        <div class="timeline-skills">
                            <span class="timeline-skill">React Native</span>
                            <span class="timeline-skill">Firebase</span>
                            <span class="timeline-skill">Redux</span>
                            <span class="timeline-skill">Chart.js</span>
                        </div>
                        <div class="timeline-achievements">
                            <div class="timeline-achievement">10,000+ active users</div>
                            <div class="timeline-achievement">4.8/5 star rating on app stores</div>
                            <div class="timeline-achievement">Featured in "Top Green Apps" article</div>
                        </div>
                    </div>
                </div>

                <div class="timeline-item" data-category="work">
                    <div class="timeline-node">⭐</div>
                    <div class="timeline-content">
                        <div class="timeline-year">2023 - 2024</div>
                        <h3 class="timeline-title">Senior Frontend Developer</h3>
                        <div class="timeline-company">InnovateLab</div>
                        <p class="timeline-description">
                            Promoted to lead frontend development for enterprise SaaS products. Architected scalable
                            component libraries and implemented advanced performance optimization techniques.
                        </p>
                        <div class="timeline-skills">
                            <span class="timeline-skill">Vue.js</span>
                            <span class="timeline-skill">TypeScript</span>
                            <span class="timeline-skill">Node.js</span>
                            <span class="timeline-skill">Docker</span>
                        </div>
                        <div class="timeline-achievements">
                            <div class="timeline-achievement">Led team of 5 developers</div>
                            <div class="timeline-achievement">Improved app performance by 60%</div>
                            <div class="timeline-achievement">Implemented design system used across 8 products</div>
                        </div>
                    </div>
                </div>

                <div class="timeline-item" data-category="education">
                    <div class="timeline-node">🏆</div>
                    <div class="timeline-content">
                        <div class="timeline-year">2024</div>
                        <h3 class="timeline-title">AWS Solutions Architect</h3>
                        <div class="timeline-company">Amazon Web Services</div>
                        <p class="timeline-description">
                            Earned AWS Solutions Architect certification to deepen my understanding of cloud
                            infrastructure
                            and scalable application deployment strategies.
                        </p>
                        <div class="timeline-skills">
                            <span class="timeline-skill">AWS</span>
                            <span class="timeline-skill">Cloud Architecture</span>
                            <span class="timeline-skill">DevOps</span>
                            <span class="timeline-skill">Microservices</span>
                        </div>
                        <div class="timeline-achievements">
                            <div class="timeline-achievement">Passed exam with 95% score</div>
                            <div class="timeline-achievement">Migrated 3 legacy systems to cloud</div>
                            <div class="timeline-achievement">Reduced infrastructure costs by 45%</div>
                        </div>
                    </div>
                </div>

                <div class="timeline-item" data-category="work">
                    <div class="timeline-node">🎯</div>
                    <div class="timeline-content">
                        <div class="timeline-year">2024 - Present</div>
                        <h3 class="timeline-title">Freelance Full-Stack Developer</h3>
                        <div class="timeline-company">Independent</div>
                        <p class="timeline-description">
                            Launched my freelance career to work on diverse, challenging projects while building lasting
                            client relationships. Specializing in modern web applications and digital experiences.
                        </p>
                        <div class="timeline-skills">
                            <span class="timeline-skill">Full-Stack</span>
                            <span class="timeline-skill">Client Relations</span>
                            <span class="timeline-skill">Project Management</span>
                            <span class="timeline-skill">Business Strategy</span>
                        </div>
                        <div class="timeline-achievements">
                            <div class="timeline-achievement">50+ satisfied clients</div>
                            <div class="timeline-achievement">100% project completion rate</div>
                            <div class="timeline-achievement">Building scalable startup MVPs</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="portfolio" class="fade-in">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Featured Work</h2>
                <p class="section-subtitle">A showcase of projects that demonstrate creativity and technical excellence
                </p>
            </div>

            <div class="portfolio-grid">
                <div class="portfolio-card">
                    <div class="portfolio-image ecommerce"></div>
                    <div class="portfolio-content">
                        <h3 class="portfolio-title">E-Commerce Platform</h3>
                        <p class="portfolio-description">A comprehensive e-commerce solution featuring modern design,
                            seamless checkout process, and advanced analytics dashboard.</p>
                        <div class="portfolio-tags">
                            <span class="tag">React</span>
                            <span class="tag">Node.js</span>
                            <span class="tag">MongoDB</span>
                            <span class="tag">Stripe</span>
                        </div>
                    </div>
                </div>

                <div class="portfolio-card">
                    <div class="portfolio-image analytics"></div>
                    <div class="portfolio-content">
                        <h3 class="portfolio-title">Analytics Dashboard</h3>
                        <p class="portfolio-description">Interactive data visualization dashboard with real-time
                            updates, custom charts, and advanced filtering capabilities.</p>
                        <div class="portfolio-tags">
                            <span class="tag">Vue.js</span>
                            <span class="tag">D3.js</span>
                            <span class="tag">Python</span>
                            <span class="tag">PostgreSQL</span>
                        </div>
                    </div>
                </div>

                <div class="portfolio-card">
                    <div class="portfolio-image music"></div>
                    <div class="portfolio-content">
                        <h3 class="portfolio-title">Music Streaming App</h3>
                        <p class="portfolio-description">Mobile-first music streaming application with beautiful
                            animations, offline playback, and social features.</p>
                        <div class="portfolio-tags">
                            <span class="tag">React Native</span>
                            <span class="tag">Redux</span>
                            <span class="tag">AWS</span>
                            <span class="tag">WebRTC</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="contact" class="fade-in">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Let's Create Together</h2>
                <p class="section-subtitle">Ready to bring your ideas to life? Let's start a conversation</p>
            </div>

            <div class="contact-content">
                <div class="contact-info">
                    <h3>Get In Touch</h3>
                    <p>I'm always excited to work on new projects and collaborate with amazing people. Whether you have
                        a specific project in mind or just want to explore possibilities, I'd love to hear from you.</p>

                    <div class="contact-details">
                        <h4>💼 Available for:</h4>
                        <ul>
                            <li>Freelance Projects</li>
                            <li>Full-time Opportunities</li>
                            <li>Consulting & Code Reviews</li>
                            <li>Speaking & Workshops</li>
                        </ul>
                    </div>

                    <div class="contact-details">
                        <h4>📍 Based in:</h4>
                        <p>San Francisco, CA (Open to Remote)</p>
                    </div>
                </div>

                <div class="contact-form-container">
                    <form class="contact-form">
                        <div class="form-group">
                            <input type="text" class="form-input" placeholder="Your Name" required>
                        </div>
                        <div class="form-group">
                            <input type="email" class="form-input" placeholder="Your Email" required>
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-input" placeholder="Project Type" required>
                        </div>
                        <div class="form-group">
                            <textarea class="form-textarea" rows="5" placeholder="Tell me about your project..."
                                required></textarea>
                        </div>
                        <button type="submit" class="submit-btn">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="footer-bottom">
            <p class="footer-copyright">
                © 2025 Titan Folio. All rights reserved.
            </p>
            <div class="footer-credits">
                <a href="https://www.tooplate.com" target="_blank" rel="noopener noreferrer"
                    class="footer-credit-link tooplate">
                    <span class="footer-credit-icon">🎨</span>
                    <span>Design by Tooplate</span>
                </a>
                <div class="footer-divider"></div>
                <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" class="footer-credit-link">
                    <span class="footer-credit-icon">📝</span>
                    <span>Google Fonts</span>
                </a>
                <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" class="footer-credit-link">
                    <span class="footer-credit-icon">📸</span>
                    <span>Unsplash</span>
                </a>
                <a href="https://cdnjs.com" target="_blank" rel="noopener noreferrer" class="footer-credit-link">
                    <span class="footer-credit-icon">⚡</span>
                    <span>CDNJS</span>
                </a>
            </div>
        </div>
    </footer>

    <script src="tooplate-titan-script.js"></script>
</body>

</html>
