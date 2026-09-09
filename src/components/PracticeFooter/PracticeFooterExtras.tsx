import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import styles from "./PracticeFooterExtras.module.css";

const careersUrl = "https://www.indeed.com/q-md-cardiac-anesthesia-critical-care-pllc-l-leesburg,-fl-jobs.html?vjk=b5e1e6b9d0467196";

export function PracticeFooterLinks({ contactHref }: { contactHref?: string }) {
  return (
    <>
      <a href={careersUrl}>Careers <ArrowUpRight size={14} aria-hidden="true" /></a>
      {contactHref ? (
        <a href={contactHref}>Contact</a>
      ) : (
        <button type="button" className={styles.contactPending} disabled title="Contact details pending" aria-describedby="footer-contact-pending">Contact</button>
      )}
      {!contactHref && <span id="footer-contact-pending" className={styles.srOnly}>Contact details pending.</span>}
    </>
  );
}

export default function PracticeFooterExtras() {
  return (
    <div className={styles.row}>
      <div className={styles.badges} role="group" aria-label="Organization logos">
        <div className={styles.badge}>
          <Image src="/images/uf-logo.png" alt="UF Health Emergency & Urgent Care Center" width={323} height={120} sizes="124px" className={styles.ufLogo} />
        </div>
        <div className={styles.badge}>
          <Image src="/images/aba-logo.avif" alt="The American Board of Anesthesiology" width={384} height={220} sizes="110px" className={styles.abaLogo} />
        </div>
      </div>
    </div>
  );
}
