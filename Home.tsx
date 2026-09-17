import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  MoveUpRight,
  Phone,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CrystalScene from "@/components/CrystalScene";
import NetworkWeb from "@/components/NetworkWeb";

type Project = { id: string; number: string; name: string; category: string; description: string; technologies: string[]; githubUrl: string; liveDemoUrl: string | null; hasLiveDemo: boolean; visual: string };
type Chapter = { id: string; number: string; label: string };

const chapters: Chapter[] = [
  { id: "top", number: "01", label: "HOME" },
  { id: "about", number: "02", label: "ABOUT" },
  { id: "work", number: "03", label: "PROJECTS" },
  { id: "contact", number: "04", label: "CONTACT" },
];

const projects: Project[] = [
  { id: "aurora", number: "01", name: "THE AURORA DREAM", category: "TRAVEL / EXPLORATION", description: "An interactive travel planning experience for exploring the Northern & Southern Lights, comparing destinations, seasons, and estimated trip costs.", technologies: ["Interactive map", "Seasonal planning"], githubUrl: "https://github.com/akshatjain-cyber/TRAVEL-GUIDE-FOR-AURORA", liveDemoUrl: "https://pixel-perfect-snap-662.lovable.app/", hasLiveDemo: true, visual: "aurora-visual" },
  { id: "meghdoot", number: "02", name: "MEGHDOOT AI", category: "WEATHER GPT / RESCUE COMMAND", description: "Weather intelligence and disaster-response experience through conversational insight, geofencing, alerts, and rescue command tools.", technologies: ["TypeScript", "React", "SIH 2026"], githubUrl: "https://github.com/akshatjain-cyber/MEGHDOOT-AI--WEATHER-GPT-KARNAVATI-UNIVERSITY-COLLEGE-HACKATHON-SIH-2026-PSID-26068", liveDemoUrl: "https://meghrescue-mb3dogk3.manus.space/", hasLiveDemo: true, visual: "meghdoot-visual" },
  { id: "sets", number: "03", name: "SETS", category: "PUBLIC REPOSITORY", description: "A public GitHub repository.", technologies: ["Repository"], githubUrl: "https://github.com/akshatjain-cyber/SETS", liveDemoUrl: null, hasLiveDemo: false, visual: "sets-visual" },
  { id: "odoo", number: "04", name: "ODOO HACKATHON 2026", category: "GLOBETROTTER / ODOO HACKATHON", description: "A project developed for the Odoo Hackathon 2026.", technologies: ["Python", "Flask", "SQLite"], githubUrl: "https://github.com/akshatjain-cyber/ODOO-HACKATHON-2026", liveDemoUrl: null, hasLiveDemo: false, visual: "globetrotter-visual" },
];

const skillGroups = [
  { label: "LANGUAGES", items: ["Python", "C/C++", "SQL", "JavaScript"] },
  { label: "ML & DATA", items: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Scikit-Learn"] },
  { label: "FRAMEWORKS", items: ["PyTorch", "TensorFlow", "OpenCV", "Power BI"] },
];

function ProjectVisual({ kind }: { kind: string }) {
  return <div className={`project-visual ${kind}`} aria-hidden="true"><div className="visual-grid" /><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="visual-core" /><div className="visual-scanline" /><span className="visual-caption">FIELD STUDY / {kind.replace("-visual", "").toUpperCase()}</span></div>;
}

function SectionLabel({ index, children }: { index: string; children: string }) {
  return <div className="section-label"><span>{index}</span><span>{children}</span></div>;
}

function ProjectIntro() {
  return <div className="project-intro"><span className="project-intro-index">03 / 04</span><h3>PROJECTS</h3><p>Follow the build.</p><span className="project-intro-scroll">SCROLL TO ENTER <ArrowDown size={14} /></span></div>;
}

function ProjectViewer({ project }: { project: Project }) {
  return <article className={`project-viewer project-${project.id}`}>
    <div className="project-viewer-copy">
      <div className="project-viewer-top"><span className="project-number">{project.number} / 04</span><span className="project-meta">{project.category}</span></div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className="project-tech-label">TECHNOLOGIES</div>
      <div className="project-tech-list">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
      <div className="project-links"><a href={project.githubUrl} target="_blank" rel="noopener noreferrer" data-cursor-label="GITHUB"><Github size={15} /> GitHub <ArrowUpRight size={14} /></a>{project.hasLiveDemo && project.liveDemoUrl && <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" data-cursor-label="LIVE"><ExternalLink size={14} /> Live demo <ArrowUpRight size={14} /></a>}</div>
    </div>
    <div className="project-viewer-visual"><ProjectVisual kind={project.visual} /></div>
  </article>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("01");
  const [activeProject, setActiveProject] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);
  const cursorLabel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion(); media.addEventListener("change", updateMotion);
    const enterTimer = window.setTimeout(() => setIsLoaded(true), media.matches ? 80 : 720);
    let raf = 0;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const readScroll = () => {
      const anchors = chapters.map((chapter) => document.getElementById(chapter.id)?.offsetTop ?? 0);
      const y = window.scrollY + window.innerHeight * 0.42;
      let value = 0;
      for (let index = 0; index < anchors.length - 1; index += 1) {
        const start = anchors[index]; const end = anchors[index + 1];
        if (y >= start && y <= end) value = index + clamp((y - start) / Math.max(1, end - start), 0, 1);
      }
      if (y < anchors[0]) value = 0; if (y >= anchors[anchors.length - 1]) value = 3;
      setSceneProgress(value);
      setActiveSection(String(Math.min(4, Math.floor(value + 0.18) + 1).toString().padStart(2, "0")));
      setScrolled(window.scrollY > 18);
      const work = document.getElementById("work");
      if (work) {
        const local = clamp((window.scrollY - work.offsetTop) / Math.max(1, work.offsetHeight - window.innerHeight), 0, 0.999);
        setActiveProject(Math.min(3, Math.max(-1, Math.floor(local * 5) - 1)));
      }
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = window.requestAnimationFrame(readScroll); };
    readScroll(); window.addEventListener("scroll", onScroll, { passive: true });

    const dot = cursorDot.current; const ring = cursorRing.current; const label = cursorLabel.current;
    let frame = 0; let targetX = -100; let targetY = -100; let currentX = -100; let currentY = -100;
    const onPointerMove = (event: PointerEvent) => { targetX = event.clientX; targetY = event.clientY; document.body.classList.add("cursor-ready"); };
    const tick = () => { currentX += (targetX - currentX) * 0.18; currentY += (targetY - currentY) * 0.18; if (dot) dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`; if (ring) ring.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`; if (label) label.style.transform = `translate3d(${currentX + 18}px, ${currentY - 30}px, 0)`; frame = window.requestAnimationFrame(tick); };
    window.addEventListener("pointermove", onPointerMove, { passive: true }); frame = window.requestAnimationFrame(tick);
    const interactive = Array.from(document.querySelectorAll<HTMLElement>("[data-cursor-label]"));
    const enter = (event: Event) => { document.body.classList.add("cursor-hover"); if (label) label.textContent = (event.currentTarget as HTMLElement).dataset.cursorLabel ?? "VIEW"; };
    const leave = () => { document.body.classList.remove("cursor-hover"); if (label) label.textContent = ""; };
    interactive.forEach((element) => { element.addEventListener("mouseenter", enter); element.addEventListener("mouseleave", leave); });
    return () => { window.clearTimeout(enterTimer); media.removeEventListener("change", updateMotion); window.removeEventListener("scroll", onScroll); window.removeEventListener("pointermove", onPointerMove); window.cancelAnimationFrame(frame); if (raf) window.cancelAnimationFrame(raf); interactive.forEach((element) => { element.removeEventListener("mouseenter", enter); element.removeEventListener("mouseleave", leave); }); };
  }, []);

  useEffect(() => { document.body.classList.toggle("menu-open", menuOpen); return () => document.body.classList.remove("menu-open"); }, [menuOpen]);
  const closeMenu = () => setMenuOpen(false);
  const heroStyle = { transform: `translate3d(${-sceneProgress * 25}px, ${-sceneProgress * 12}px, 0) scale(${1 - sceneProgress * 0.03})`, opacity: Math.max(0.45, 1 - sceneProgress * 0.8) };

  return <div className={`portfolio-shell ${isLoaded ? "is-loaded" : "is-entering"} ${activeSection === "03" ? "is-projects" : ""}`}>
    <div className="page-loader" aria-hidden={isLoaded}><span>AKSHAT JAIN</span><span>01 / 04</span><div className="loader-crystal" /></div>
    <div className="cursor-dot" ref={cursorDot} aria-hidden="true" /><div className="cursor-ring" ref={cursorRing} aria-hidden="true" /><div className="cursor-label" ref={cursorLabel} aria-hidden="true" />
    <div className="scroll-progress" style={{ transform: `scaleX(${sceneProgress / 3})` }} aria-hidden="true" />
    <div className="chapter-progress" aria-label="Page progress"><span className="chapter-progress-current">{activeSection}</span><div className="chapter-progress-line"><i style={{ transform: `scaleY(${Number(activeSection) / 4})` }} /></div><span>04</span></div>
    <NetworkWeb progress={sceneProgress} reducedMotion={reducedMotion} />
    <CrystalScene progress={sceneProgress} reducedMotion={reducedMotion} />

    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}><a className="brand-mark" href="#top" data-cursor-label="TOP" onClick={closeMenu}><span className="brand-orb" /> AKSHAT JAIN</a><nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">{chapters.map((chapter) => <a className={activeSection === chapter.number ? "is-active" : ""} href={`#${chapter.id}`} onClick={closeMenu} key={chapter.id}><span>{chapter.number}</span> {chapter.label}</a>)}</nav><div className="header-actions"><a className="cv-link" href="https://canva.link/w386g8rw6i29pd2" target="_blank" rel="noreferrer" data-cursor-label="OPEN">CV <ArrowUpRight size={15} /></a><button className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button></div></header>

    <main>
      <section className="hero section-pad scene-chapter" id="top"><div className="hero-grid" /><div className="hero-kicker reveal-up">AI / CODE / WEB</div><div className="hero-copy" style={heroStyle}><h1 className="hero-title"><span>AKSHAT</span><span className="hero-title-offset">JAIN</span></h1><div className="hero-description reveal-up delay-one"><span className="line-marker" /><p>Building from the foundations of AI/ML, data, and the web.</p></div></div><div className="hero-footer reveal-up delay-two"><span>AHMEDABAD, INDIA</span><span>SCROLL / FOLLOW THE CRYSTAL <ArrowDown size={14} /></span><span>01 / 04</span></div><div className="hero-side-note">FOLLOW THE CRYSTAL<br /><span>THE OBJECT MOVES</span></div></section>

      <section className="about section-pad section-dark scene-chapter" id="about"><div className="content-grid"><SectionLabel index="02" children="PROFILE / ABOUT" /><div className="about-copy"><h2>Learning in public.<br /><em>Building with intent.</em></h2><p className="lead-copy">I’m exploring the space where code, data, and curiosity meet. My current focus is turning foundations in Python, linear algebra, data structures, and Power BI into useful, end-to-end experiments.</p><div className="about-facts"><div><span>01</span><p>First-year AI / ML student</p></div><div><span>02</span><p>Ahmedabad, Gujarat</p></div><div><span>03</span><p>Open to AI/ML and Data Science internships</p></div></div><div className="about-lower"><div className="about-skills"><div className="mini-label">CURRENT TOOLKIT</div><div className="skill-items">{skillGroups.flatMap((group) => group.items).map((item) => <span key={item}>{item}</span>)}</div></div><div className="about-education"><span className="mini-label">2026 / EDUCATION</span><strong>Senior Secondary (CBSE)</strong><p>Udgam School for Children<br />Ahmedabad, Gujarat</p><span className="education-check"><Check size={13} /> FULL MARKS IN CS &amp; ENGLISH</span></div></div></div><div className="about-note"><span className="note-rule" />A considered beginning<br />is still a beginning.</div></div></section>

      <section className="projects-reel section-dark scene-chapter" id="work"><div className="projects-sticky"><div className="project-reel-chapter"><SectionLabel index="03" children="PROJECTS" /><span>{activeProject < 0 ? "INTRO" : `${projects[activeProject].number} / 04`}</span></div><div className="project-reel-stage">{activeProject < 0 ? <ProjectIntro /> : <ProjectViewer project={projects[activeProject]} />}</div><div className="reel-progress"><span>01</span><div><i style={{ transform: `scaleX(${Math.max(0, activeProject + 1) / 4})` }} /></div><span>04</span></div></div></section>

      <section className="contact section-pad section-dark scene-chapter" id="contact"><div className="contact-top"><SectionLabel index="04" children="CONTACT / REACH OUT" /><span className="contact-index">LAST CHAPTER / KEEP BUILDING ↗</span></div><div className="contact-body"><h2>Let’s build<br /><em>something.</em></h2><a className="contact-email" href="mailto:akshatjain2267@gmail.com" data-cursor-label="MAIL">akshatjain2267@gmail.com <ArrowUpRight size={23} /></a></div><div className="contact-links"><a href="mailto:akshatjain2267@gmail.com" data-cursor-label="MAIL"><Mail size={16} /> EMAIL <ArrowUpRight size={14} /></a><a href="https://www.linkedin.com/in/akshat-jain-904a04430/" target="_blank" rel="noreferrer" data-cursor-label="OPEN"><Linkedin size={16} /> LINKEDIN <ArrowUpRight size={14} /></a><a href="https://github.com/akshatjain-cyber" target="_blank" rel="noreferrer" data-cursor-label="OPEN"><Github size={16} /> GITHUB <ArrowUpRight size={14} /></a><a href="https://www.instagram.com/akshat_jain7428/" target="_blank" rel="noreferrer" data-cursor-label="OPEN"><Instagram size={16} /> INSTAGRAM <ArrowUpRight size={14} /></a><a href="tel:+919426036501" data-cursor-label="CALL"><Phone size={16} /> +91 94260 36501 <ArrowUpRight size={14} /></a></div></section>
    </main>

    <footer className="site-footer"><div className="footer-brand"><span className="brand-orb" /> AKSHAT JAIN</div><div className="footer-note">AI / CODE / BUILDING</div><div className="footer-links"><a href="#top">BACK TO TOP <ArrowUpRight size={14} /></a><span>© 2026</span></div></footer>
  </div>;
}
