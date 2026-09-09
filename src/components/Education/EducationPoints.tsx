"use client";
import React from "react";
import styles from "./EducationPoints.module.css";
import { motion, type Variants } from "framer-motion";
import { FaHeartbeat, FaUserMd, FaProcedures, FaStethoscope } from "react-icons/fa";
import TitleSection from "../Titles/TitleSection";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const educationPoints = [
  {
    icon: <FaStethoscope />,
    title: "Surgical Stability",
    description:
      "Anesthesiologists maintain stable conditions before, during, and after surgery."
  },
  {
    icon: <FaUserMd />,
    title: "Patient Assessment",
    description:
      "They assess risk and optimize the patient’s condition before surgery."
  },
  {
    icon: <FaProcedures />,
    title: "Pain & Recovery",
    description:
      "They provide pain relief, post-op care, and support critical recovery."
  },
  {
    icon: <FaHeartbeat />,
    title: "Critical Care Experts",
    description:
      "Trained to handle life-threatening cases, resuscitations, and trauma."
  },
];

const AboutEducation: React.FC = () => {
  return (
    <section className={styles.educationSection}>
        <TitleSection title="What do we do?" subtitle="We put our love into critical care." />
      <div className={styles.grid}>
        {educationPoints.map((point, i) => (
          <motion.div
            key={i}
            className={styles.card}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            <div className={styles.icon}>{point.icon}</div>
            <h3>{point.title}</h3>
            <p>{point.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutEducation;
