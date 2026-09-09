"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type MotionProps } from "framer-motion";
import { MdLocationOn } from "react-icons/md";
import SocialLinks from "../SocialLinks/SocialLinks";
import styles from "./Footer.module.css";

// Animation configuration for Framer Motion
const floatUp: MotionProps = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 },
};

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      {/* Upper Section */}
      <div className={styles.upperFooter}>
        {/* Logo */}
        <motion.div className={styles.logoBlock} {...floatUp}>
          <div className={styles.logo}>
            <Image
              src="/images/mainLogo.png"
              alt="Your Company Logo"
              width={250}
              height={160}
            />
          </div>
        </motion.div>

        {/* Description */}
        <motion.div className={styles.descriptionBlock} {...floatUp}>
          <p className={styles.description}>
            Your company tagline or brief description goes here. Customize this
            section to describe your products or services.
          </p>
        </motion.div>

        {/* Map / Location */}
        <motion.div className={styles.mapBlock} {...floatUp}>
          <div className={styles.locationRow}>
            <MdLocationOn className={styles.locationIcon} />
            <h3>Serving Your City</h3>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102410.96638528618!2d-114.18252740611754!3d51.02734996478432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53717000c3bfb93f%3A0x2f4e48ed62761efb!2sCalgary%2C%20AB%2C%20Canada!5e0!3m2!1sen!2sus!4v1710600000000"
            className={styles.map}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map showing location of Your Company"
          />
        </motion.div>

        {/* Hours of Operation */}
        <motion.div className={styles.hoursBlock} {...floatUp}>
          <h4>Hours of Operation</h4>
          <p>Monday - Saturday: 8am - 8pm</p>
          <p>Sunday: 10am - 7pm</p>
          <p>Holidays: 10am - 5pm</p>
        </motion.div>

        {/* Social Media Icons */}
        <motion.div className={styles.socialIconsBlock} {...floatUp}>
          <h4>Follow Us</h4>
          <SocialLinks size={25} />
        </motion.div>
      </div>

      {/* Bottom Section */}
      <motion.div className={styles.bottomFooter} {...floatUp}>
        <div className={styles.bottomLinks}>
          <Link href="/privacy-policy" aria-label="Privacy Policy">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" aria-label="Terms of Service">
            Terms of Service
          </Link>
        </div>
        <p className={styles.copyText}>
          Your Company © {new Date().getFullYear()}. All Rights Reserved.
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;
