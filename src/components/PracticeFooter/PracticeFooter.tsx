import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PracticeFooterExtras, { PracticeFooterLinks } from "./PracticeFooterExtras";
import styles from "./PracticeFooter.module.css";

export default function PracticeFooter({ page }: { page: "practice" | "botox" }) {
  const practicePath = page === "practice" ? "" : "/";

  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div data-reveal="rise" className={styles.identity}>
          <Link href="/" className={styles.wordmark}>
            <Image src="/images/mainLogo.png" alt="" width={58} height={58} />
            <span>MD Cardiac Anesthesia<small>&amp; Critical Care</small></span>
          </Link>
          <PracticeFooterExtras />
        </div>
        <div className={styles.columns}>
          <div data-reveal="rise" data-reveal-delay="100" className={styles.group}>
            <h2 id="footer-practice">Practice</h2>
            <nav aria-labelledby="footer-practice">
              <Link href={`${practicePath}#practice`}>Our approach</Link>
              <Link href={`${practicePath}#physician`}>Your physician</Link>
              <Link href={`${practicePath}#faq`}>FAQ</Link>
            </nav>
          </div>
          <div data-reveal="rise" data-reveal-delay="100" className={styles.group}>
            <h2 id="footer-services">Services</h2>
            <nav aria-labelledby="footer-services">
              <Link href="/botox" aria-current={page === "botox" ? "page" : undefined}>Botox services <ArrowUpRight size={14} aria-hidden="true" /></Link>
            </nav>
          </div>
          <div data-reveal="rise" data-reveal-delay="100" className={styles.group}>
            <h2 id="footer-connect">Connect</h2>
            <nav aria-labelledby="footer-connect"><PracticeFooterLinks /></nav>
          </div>
        </div>
      </div>
      <div className={styles.legal}>
        <span>© {new Date().getFullYear()} MDCACC PLLC</span>
        {page === "practice" && <span className={styles.attribution}>Heart model: <a href="https://sketchfab.com/3d-models/realistic-human-heart-3f8072336ce94d18b3d0d055a1ece089">neshallads</a> · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> · modified materials</span>}
      </div>
    </footer>
  );
}
