import React from 'react';
import './Legal.css';

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: November 4, 2025</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Total Raffle ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            Total Raffle is a free-to-enter sweepstakes platform where users can earn entries by completing tasks such as surveys, watching advertisements, and daily logins. No purchase is necessary to enter or win.
          </p>
        </section>

        <section>
          <h2>3. Eligibility</h2>
          <p>
            You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that you are at least 18 years of age.
          </p>
        </section>

        <section>
          <h2>4. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2>5. Sweepstakes Rules</h2>
          <p>
            <strong>No Purchase Necessary:</strong> Entries can be earned for free by completing available tasks.
          </p>
          <p>
            <strong>Entry Methods:</strong> Users earn entries by completing surveys, watching ads, daily logins, and other promotional activities.
          </p>
          <p>
            <strong>Prize Draws:</strong> Winners are selected randomly from all eligible entries. Odds of winning depend on the number of entries submitted.
          </p>
          <p>
            <strong>Prize Fulfillment:</strong> Winners will be notified via email and must respond within 7 days to claim their prize.
          </p>
        </section>

        <section>
          <h2>6. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use automated systems or bots to earn entries</li>
            <li>Create multiple accounts</li>
            <li>Engage in fraudulent activity</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </section>

        <section>
          <h2>7. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account at any time for violations of these Terms of Service.
          </p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            Total Raffle shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the Service.
          </p>
        </section>

        <section>
          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2>10. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at: support@totalraffle.co.uk
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
