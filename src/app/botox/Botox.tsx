"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, LockKeyhole } from "lucide-react";
import shared from "../concept/concept.module.css";
import styles from "./botox.module.css";
import { BOOKING_MONTHS, getCalendarMonth, type CalendarDate } from "./calendar";
import PracticeNavigation from "@/components/PracticeNavigation/PracticeNavigation";
import PracticeFooter from "@/components/PracticeFooter/PracticeFooter";
import { useScrollMotion } from "@/components/ScrollMotion/useScrollMotion";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function BookingCalendar() {
  const [today, setToday] = useState<CalendarDate | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    const now = new Date();
    setToday({ year: now.getFullYear(), month: now.getMonth(), day: now.getDate() });
  }, []);

  const month = today ? getCalendarMonth(today.year, today.month + monthOffset) : null;

  return (
    <section className={styles.calendarCard} id="booking" aria-labelledby="booking-title">
      <div className={styles.calendarIntro}>
        <p className={shared.eyebrow}>ONLINE BOOKING</p>
        <div className={styles.calendarTitle}><h2 id="booking-title">Appointment availability</h2><CalendarDays size={24} aria-hidden="true" /></div>
        <p>Botox consultations &amp; treatments</p>
      </div>
      <div className={styles.calendarBody}>
        <div className={styles.monthControls}>
          <h3 id="month-title" aria-live="polite" aria-atomic="true">{month?.label ?? "Appointment calendar"}</h3>
          <div>
            <button type="button" aria-label="Previous month" disabled={!month || monthOffset === 0} onClick={() => setMonthOffset(value => Math.max(0, value - 1))}><ChevronLeft size={18} aria-hidden="true" /></button>
            <button type="button" aria-label="Next month" disabled={!month || monthOffset >= BOOKING_MONTHS - 1} onClick={() => setMonthOffset(value => Math.min(BOOKING_MONTHS - 1, value + 1))}><ChevronRight size={18} aria-hidden="true" /></button>
          </div>
        </div>
        <div className={styles.calendarGrid} aria-busy={!month}>
          {month ? <table aria-labelledby="month-title" aria-describedby="availability-message">
            <thead><tr>{weekdays.map(day => <th scope="col" key={day}><abbr title={day}>{day.slice(0, 3)}</abbr></th>)}</tr></thead>
            <tbody>{Array.from({ length: 6 }, (_, row) => <tr key={row}>{month.cells.slice(row * 7, row * 7 + 7).map((day, column) => {
              const isToday = !!today && monthOffset === 0 && day === today.day;
              const isPast = !!today && monthOffset === 0 && day !== null && day < today.day;
              return <td key={column}>{day !== null && <button type="button" disabled className={`${styles.date} ${isToday ? styles.today : ""} ${isPast ? styles.past : ""}`} aria-current={isToday ? "date" : undefined} aria-label={`${month.label}, ${day}${isToday ? ", today" : ""} — ${isPast ? "past date" : "no appointments available"}`}>{day}</button>}</td>;
            })}</tr>)}</tbody>
          </table> : <p className={styles.calendarLoading}>Loading calendar…</p>}
        </div>
        <div className={styles.calendarLegend}><span><i /> No availability</span><span>Outlined date = today</span></div>
        <div className={styles.bookingStatus} id="availability-message">
          <LockKeyhole size={20} aria-hidden="true" />
          <div><h3>Fully booked</h3><p>No appointments are currently available to book online.</p></div>
        </div>
        <p className={styles.bookingNote}>Online booking is currently closed. No dates can be reserved.</p>
      </div>
    </section>
  );
}

export default function Botox() {
  const motionRoot = useScrollMotion();
  return (
    <div ref={motionRoot} className={`${shared.concept} ${styles.page}`}>
      <a className={shared.skip} href="#booking">Skip to appointment availability</a>
      <header className={shared.header}>
        <Link href="/" className={shared.wordmark} aria-label="MD Cardiac Anesthesia home"><Image className={shared.brandLogo} src="/images/mainLogo.png" alt="" width={64} height={64} priority /><span>MD Cardiac Anesthesia<small>&amp; Critical Care</small></span></Link>
        <PracticeNavigation page="botox" />
      </header>

      <main className={styles.main}>
        <div className={styles.breadcrumb}><Link href="/"><ArrowLeft size={15} /> Back to the practice</Link><span>SERVICES / BOTOX</span></div>
        <div className={styles.appointmentLayout}>
          <section className={styles.intro} aria-labelledby="botox-title">
            <p className={shared.eyebrow}><span /> MDCACC SERVICES</p>
            <h1 id="botox-title">Botox<br /><span>consultations<br />&amp; treatments.</span></h1>
            <p className={styles.description}>View appointment availability for Botox services with MD Cardiac Anesthesia &amp; Critical Care.</p>
            <div className={styles.introStatus}><span /> Currently fully booked</div>
            <figure data-reveal="photo" className={styles.treatmentImage}><Image src="/images/botox.png" alt="Illustration of a cosmetic injection near the forehead" width={1024} height={1024} sizes="(max-width: 760px) 88vw, 36vw" /><figcaption>Botox services / MDCACC PLLC</figcaption></figure>
          </section>
          <BookingCalendar />
        </div>
        <div data-reveal="rise" className={styles.returnRow}><p>Learn more about our physician and the practice.</p><Link className={shared.textLink} href="/#physician">Meet Dr. Tinevez <ArrowUpRight size={18} /></Link></div>
      </main>

      <PracticeFooter page="botox" />
    </div>
  );
}
