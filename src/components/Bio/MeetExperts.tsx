"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./MeetExperts.module.css";
import { motion, useAnimation, type Variants } from "framer-motion";

interface ExpertProps {
  name: string;
  image: string;
  cred0?: string;
  credentials: string;
  quote: string;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};


const ExpertCard: React.FC<ExpertProps> = ({ name, image, cred0, credentials, quote }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const controls = useAnimation();
  
    const handleClick = async () => {
        if (showOverlay) {
          // Bounce if already open using tween
          await controls.start({
            scale: 1.4,
            transition: { duration: 0.15, ease: "easeOut" },
          });
          await controls.start({
            scale: 1,
            transition: { duration: 0.2, ease: "easeInOut" },
          });
        } else {
          setShowOverlay(true);
        }
      };
      
  
    return (
      <motion.div
        className={styles.card}
        onClick={handleClick}
        onMouseEnter={() => !showOverlay && setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
        animate={controls}
      >
        <div className={styles.imageWrapper}>
          <Image
            src={image}
            alt={name}
            width={180}
            height={180}
            className={styles.image}
          />
          {showOverlay && (
            <div className={styles.overlay}>
              <h4 style={{fontSize: "1.1rem"}}>{name}</h4>
              {cred0 && <p className={styles.title}>{cred0}</p>}
              <p className={styles.credentials}>{credentials}</p>
              <blockquote className={styles.quote}>
                “{quote}”
              </blockquote>
            </div>
          )}
        </div>
      </motion.div>
    );
  };




const MeetTheExperts: React.FC = () => {
  const experts: ExpertProps[] = [
    {
      name: "Dr. Dillon Tinevez, MD",
      image: "/images/dillon.webp",
      cred0: "CEO of MDCACC PLLC",
      credentials: "ABA – Board Certified Anesthesiologist",
      quote: "Compassion and precision are at the heart of everything I do."
    },
  ];

  return (
    <motion.section
        className={styles.section}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className={styles.grid}>
          {experts.map((expert, index) => (
            <ExpertCard key={index} {...expert} />
          ))}
        </div>
      </motion.section>

  );
};

export default MeetTheExperts;
