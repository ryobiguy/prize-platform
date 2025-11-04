import React from 'react';
import './Legal.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: November 4, 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Total Raffle ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Email address</li>
            <li>Username</li>
            <li>Password (encrypted)</li>
            <li>Prize delivery information (for winners only)</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>We automatically collect certain information when you use our Service:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Usage data (pages visited, time spent, etc.)</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain our Service</li>
            <li>Process sweepstakes entries and select winners</li>
            <li>Send you notifications about prizes and account activity</li>
            <li>Improve our Service and user experience</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our Service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2>5. Third-Party Services</h2>
          <p>We may use third-party services that collect, monitor and analyze data:</p>
          <ul>
            <li><strong>Survey Providers:</strong> TheoremReach, CPX Research - for earning opportunities</li>
            <li><strong>Analytics:</strong> To understand how users interact with our Service</li>
          </ul>
          <p>
            These third parties have their own privacy policies. We encourage you to review their privacy policies.
          </p>
        </section>

        <section>
          <h2>6. Data Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share your information:</p>
          <ul>
            <li>With service providers who assist in operating our Service</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With your consent</li>
          </ul>
        </section>

        <section>
          <h2>7. Your Rights (GDPR & CCPA)</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data</li>
            <li><strong>Deletion:</strong> Request deletion of your data</li>
            <li><strong>Opt-Out:</strong> Opt-out of marketing communications</li>
            <li><strong>Data Portability:</strong> Request transfer of your data</li>
          </ul>
          <p>To exercise these rights, contact us at: privacy@totalraffle.co.uk</p>
        </section>

        <section>
          <h2>8. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2>9. Children's Privacy</h2>
          <p>
            Our Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18.
          </p>
        </section>

        <section>
          <h2>10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and maintained on servers located outside of your country. We ensure appropriate safeguards are in place for such transfers.
          </p>
        </section>

        <section>
          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2>12. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p>Email: privacy@totalraffle.co.uk</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
