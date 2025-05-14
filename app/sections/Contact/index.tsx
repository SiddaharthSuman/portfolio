// sections/ContactSection/index.jsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';

import styles from './ContactSection.module.scss';

const ContactSection = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset submission states
    setSubmitSuccess(false);
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulating form submission
    try {
      // In a real application, you would send the form data to your backend
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Simulate a delay for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSubmitError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className={`${styles.contactSection}`} id="contact">
      <div className="container">
        <div ref={contentRef} className={styles.contactContent}>
          <h2 className={styles.heading}>
            <span className={styles.sectionNumber}>04.</span> Get In Touch
          </h2>
          <p className={styles.subtitle}>
            I&apos;m currently open to new opportunities and my inbox is always open. Whether you
            have a question or just want to say hi, I&apos;ll try my best to get back to you!
          </p>

          {submitSuccess ? (
            <div className={styles.successMessage}>
              <h3>Thank you for your message!</h3>
              <p>I&apos;ll get back to you as soon as possible.</p>
              <button className={styles.resetButton} onClick={() => setSubmitSuccess(false)}>
                Send another message
              </button>
            </div>
          ) : (
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="name">
                    Name
                  </label>
                  <input
                    className={`${styles.formInput} ${formErrors.name ? styles.hasError : ''}`}
                    id="name"
                    name="name"
                    placeholder="Your name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {formErrors.name && (
                    <span className={styles.errorMessage}>{formErrors.name}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="email">
                    Email
                  </label>
                  <input
                    className={`${styles.formInput} ${formErrors.email ? styles.hasError : ''}`}
                    id="email"
                    name="email"
                    placeholder="Your email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {formErrors.email && (
                    <span className={styles.errorMessage}>{formErrors.email}</span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="subject">
                  Subject
                </label>
                <input
                  className={`${styles.formInput} ${formErrors.subject ? styles.hasError : ''}`}
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                />
                {formErrors.subject && (
                  <span className={styles.errorMessage}>{formErrors.subject}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="message">
                  Message
                </label>
                <textarea
                  className={`${styles.formTextarea} ${formErrors.message ? styles.hasError : ''}`}
                  id="message"
                  name="message"
                  placeholder="Your message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                {formErrors.message && (
                  <span className={styles.errorMessage}>{formErrors.message}</span>
                )}
              </div>

              {submitError && <div className={styles.submitError}>{submitError}</div>}

              <button className={styles.submitButton} disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Sending...' : 'Send Message'}
                {!isSubmitting && <Send size={16} />}
              </button>
            </form>
          )}

          <div className={styles.orDivider}>
            <span>OR</span>
          </div>

          <div className={styles.directContact}>
            <p>Email me directly at:</p>
            <a className={styles.emailLink} href="mailto:siddaharthsuman@gmail.com">
              siddaharthsuman@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
