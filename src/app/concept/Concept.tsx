"use client";

import { Component, useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import styles from "./concept.module.css";
import { getHeroMotion, getMobileHeartProgress } from "./heroMotion";
import { faqItems } from "@/components/FAQWidget/faqData";
import PracticeNavigation from "@/components/PracticeNavigation/PracticeNavigation";
import ParallaxBackground from "@/components/ParallaxBackground/ParallaxBackground";
import PracticeFooter from "@/components/PracticeFooter/PracticeFooter";
import { useScrollMotion } from "@/components/ScrollMotion/useScrollMotion";

const HeartScene = dynamic(() => import("./HeartScene"), { ssr: false });

const heroMessages = [
  { eyebrow: "ANESTHESIA FOR CARDIAC SURGERY", lines: ["Cardiac", "anesthesia", "& critical care."], description: "Anesthesia for heart surgery and intensive care for critically ill patients." },
  { eyebrow: "BEFORE, DURING & AFTER SURGERY", lines: ["Assessment.", "Anesthesia.", "Recovery."], description: "From preoperative assessment through anesthesia and postoperative recovery." },
];

const care = [
  { title: "Assessment", detail: "Before surgery", description: "Reviewing medical history and assessing risk to inform the anesthesia plan." },
  { title: "Anesthesia", detail: "During surgery", description: "Managing anesthesia and monitoring the patient throughout the procedure." },
  { title: "Recovery", detail: "After surgery", description: "Managing pain and providing postoperative care as the patient recovers." },
  { title: "Critical care", detail: "Intensive support", description: "Caring for patients whose condition requires intensive monitoring and treatment." },
];

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p className={styles.fallback}>The interactive heart is unavailable on this device. Continue below to meet the practice.</p> : this.props.children; }
}

function FAQItem({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={styles.faqItem} data-open={open}>
      <h3 className={styles.faqQuestion}>
        <button type="button" id={`${id}-question`} className={styles.faqTrigger} aria-expanded={open} aria-controls={`${id}-answer`} onClick={() => setOpen((current) => !current)}>
          <span>{question}</span><Plus size={20} aria-hidden="true" />
        </button>
      </h3>
      <div id={`${id}-answer`} className={styles.faqPanel} role="region" aria-labelledby={`${id}-question`} aria-hidden={!open} inert={!open}>
        <div className={styles.faqClip}>
          <div className={styles.faqAnswer}><p>{answer}</p></div>
        </div>
      </div>
    </div>
  );
}

export default function Concept() {
  const motionRoot = useScrollMotion();
  const story = useRef<HTMLElement>(null);
  const specimen = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [heartProgress, setHeartProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => { setReduced(preference.matches); requestUpdate(); };
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!story.current) return;
      if (preference.matches) { setProgress(0); setHeartProgress(0); return; }
      if (window.innerWidth <= 760) {
        const rect = specimen.current?.getBoundingClientRect();
        setProgress(0); // Keep the mobile headline and chapter label steady.
        setHeartProgress(rect ? getMobileHeartProgress(rect.top, rect.height, window.innerHeight) : 0);
        return;
      }
      const rect = story.current.getBoundingClientRect();
      const nextProgress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      setProgress(nextProgress);
      setHeartProgress(nextProgress);
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    updatePreference();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    preference.addEventListener("change", updatePreference);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      preference.removeEventListener("change", updatePreference);
    };
  }, []);

  const { chapter, panels } = getHeroMotion(progress, reduced);
  return (
    <div ref={motionRoot} className={styles.concept} data-concept>
      <a className={styles.skip} href="#practice">Skip the heart experience</a>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark} aria-label="MD Cardiac Anesthesia home">
          <Image className={styles.brandLogo} src="/images/mainLogo.png" alt="" width={64} height={64} priority />
          <span>MD Cardiac Anesthesia<small>&amp; Critical Care</small></span>
        </Link>
        <PracticeNavigation page="practice" />
      </header>

      <main>
        <section ref={story} className={styles.story} id="anatomy" aria-label="A two-chapter heart study">
          <div className={styles.stage}>
            <div className={styles.copy}>
              <h1 className={styles.srOnly}>Cardiac anesthesia and critical care</h1>
              <div className={styles.heroPanels}>
                {heroMessages.map((message, index) => (
                  <div className={styles.heroPanel} key={message.eyebrow} aria-hidden={chapter !== index} style={{ opacity: panels[index].opacity, transform: `translate3d(0, ${panels[index].y}px, 0)`, visibility: panels[index].opacity === 0 ? "hidden" : "visible" }}>
                    <p className={styles.eyebrow}><span />{message.eyebrow}</p>
                    <h2 className={styles.heroTitle}>{message.lines[0]}<br />{message.lines[1]}<br /><em>{message.lines[2]}</em></h2>
                    <p className={styles.description}>{message.description}</p>
                  </div>
                ))}
              </div>
              <a className={styles.primaryLink} href="#practice">Our care <ArrowUpRight size={18} /></a>
            </div>

            <div ref={specimen} className={styles.specimen} role="img" aria-label={chapter === 0 ? "Three-dimensional sculptural heart, external view" : "Closer external view of the sculptural heart"}>
              <div className={styles.halo} />
              <SceneBoundary><HeartScene progress={heartProgress} reduced={reduced} onReady={onReady} />
                {!ready && <span className={styles.loading}>Preparing the heart study…</span>}
              </SceneBoundary>
              <span className={styles.specimenLabel}><Plus size={14} /> {chapter === 0 ? "01 / THE WHOLE HEART" : "02 / A CLOSER PERSPECTIVE"}</span>
            </div>

            <div className={styles.sideNote}><span>01—02</span><div /><span>SCROLL TO DISCOVER</span></div>
            <div className={styles.stageBottom}>
              <span>Anesthesiology practice</span>
              <div className={styles.chapters} aria-label={`Chapter ${chapter + 1} of 2`}><span className={chapter === 0 ? styles.active : ""}>01 &nbsp; The whole</span><div><i style={{ transform: `scaleX(${progress})` }} /></div><span className={chapter === 1 ? styles.active : ""}>02 &nbsp; The detail</span></div>
              <span className={styles.scrollHint}><ArrowDown size={17} aria-hidden="true" /> Scroll to explore</span>
            </div>
          </div>
        </section>

        <section className={styles.practice} id="practice" aria-labelledby="approach-title">
          <ParallaxBackground className={styles.practiceBackdrop} src="/images/areas-of-care-background.webp" position="center top" />
          <div data-reveal="rise" className={styles.sectionHeading}><p className={styles.eyebrow}><span /> 01 / AREAS OF CARE</p><span className={styles.sectionAside}>Assessment, anesthesia &amp; recovery</span></div>
          <div className={styles.practiceIntro}><h2 data-reveal="rise" id="approach-title">Anesthesia care.<br /><span>From assessment to recovery.</span></h2><p data-reveal="rise" data-reveal-delay="100">Our work includes evaluating patients before surgery, managing anesthesia during procedures, and supporting postoperative recovery and critical care.</p></div>
          <div className={styles.careGrid}>{care.map((item, index) => <article data-reveal="rise" data-reveal-delay={index * 75} className={styles.careItem} key={item.title}><span className={styles.careNumber}>0{index + 1}</span><h3>{item.title}<span>.</span></h3><p className={styles.careDetail}>{item.detail}</p><p>{item.description}</p></article>)}</div>
        </section>
        <section className={styles.physician} id="physician" aria-labelledby="physician-title">
          <div data-reveal="rise" className={styles.sectionHeading}><p className={styles.eyebrow}><span /> 02 / YOUR PHYSICIAN</p><span className={styles.sectionAside}>Meet your anesthesiologist</span></div>
          <div className={styles.doctor}>
            <figure data-reveal="photo" className={styles.portrait}><Image src="/images/dillon-upscaled.png" alt="Dr. Dillon Tinevez" width={1254} height={1254} sizes="(max-width: 318px) 88vw, (max-width: 760px) 280px, 320px" /><figcaption><span>Dillon Tinevez, MD</span><span>MDCACC PLLC</span></figcaption></figure>
            <div data-reveal="rise" data-reveal-delay="120" className={styles.doctorCopy}><p className={styles.eyebrow}>ANESTHESIOLOGY &amp; CRITICAL CARE</p><h2 id="physician-title">Dr. Dillon<br /><span>Tinevez, MD</span></h2><p className={styles.doctorSummary}>Dr. Tinevez’s practice focuses on cardiac anesthesia and critical care, including patient assessment, anesthesia management, and postoperative care.</p><div className={styles.credentials}><h3>Board-Certified Anesthesiologist</h3><p>American Board of Anesthesiology<br />CEO, MDCACC PLLC</p></div><Link className={styles.textLink} href="#practice">About anesthesia care <ArrowRight size={18} /></Link></div>
          </div>
        </section>
        <section className={styles.end} id="patient-information" aria-labelledby="closing-title">
          <ParallaxBackground className={styles.endBackdrop} src="/images/patient-information-background.webp" />
          <div data-reveal="rise"><p className={styles.eyebrow}>PATIENT INFORMATION</p><h2 id="closing-title">Questions about<br /><span>anesthesia or critical care?</span></h2></div>
          <div data-reveal="rise" data-reveal-delay="140" className={styles.endAction}><p>Find answers to common questions about the practice and the services we provide.</p><a href="#faq">Read common questions <ArrowDown size={20} /></a></div>
        </section>
        <section className={styles.faq} id="faq" aria-labelledby="faq-title">
          <div data-reveal="rise" className={styles.sectionHeading}><p className={styles.eyebrow}><span /> 03 / COMMON QUESTIONS</p><span className={styles.sectionAside}>About the practice</span></div>
          <div className={styles.faqLayout}>
            <h2 data-reveal="rise" id="faq-title">Frequently asked<br /><span>questions.</span></h2>
            <div data-reveal="rise" data-reveal-delay="100" className={styles.faqList}>
              {faqItems.map((item, index) => (
                <FAQItem key={item.question} question={item.question} answer={item.answer} defaultOpen={index === 0} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <PracticeFooter page="practice" />
    </div>
  );
}
