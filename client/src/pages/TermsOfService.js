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
            Total Raffle is a prize draw platform where users can obtain entries in two ways:
          </p>
          <ul>
            <li>
              <strong>Paid entries:</strong> Users may purchase entry bundles using real money. Payments are processed
              securely by our third-party payment provider (currently Square). Purchased entries are added to your
              account balance and can be used to enter eligible prize draws.
            </li>
            <li>
              <strong>Promotional/free entries:</strong> From time to time, we may award free entries through
              promotions, bonuses, or other non-paid activities at our discretion.
            </li>
          </ul>
          <p>
            No purchase is required to hold an account, but purchasing entries allows you to participate in
            paid-entry prize draws. All use of the Service remains subject to these Terms and our Contest Rules.
          </p>
        </section>

        <section>
          <h2>3. Eligibility</h2>
          <p>
            You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that you are at least 18 years of age.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
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
            <strong>Entries:</strong> Entries represent chances to win in eligible prize draws. Entries may be
            purchased or awarded for free via promotions.
          </p>
          <p>
            <strong>Paid Entries:</strong> When you purchase entries, your payment grants you a specified number of
            entries credited to your account. All entry purchases are final and non-refundable, except where required by
            applicable law.
          </p>
          <p>
            <strong>Prize Draws:</strong> Winners are selected randomly from all eligible entries. Odds of winning
            depend on the number of entries submitted for that prize.
          </p>
          <p>
            <strong>Prize Fulfillment:</strong> Winners will be notified via email and must respond within 7 days to
            claim their prize, unless otherwise specified in the Contest Rules.
          </p>
        </section>

        <section>
          <h2>6. Payments and Billing</h2>
          <p>
            Payments for entry bundles are processed by trusted third-party providers (currently Square). We do not
            store full card details on our servers. By submitting a payment, you authorise us and our payment provider
            to charge your selected payment method for the specified amount.
          </p>
          <p>
            Due to the instant digital nature of entries, <strong>all entry purchases are final and non-refundable</strong>
            except where a refund is required by law or explicitly stated by us in writing.
          </p>
          <p>
            It is your responsibility to ensure that you are legally permitted to participate in prize draws and to
            comply with any local laws that apply to you.
          </p>
        </section>

        <section>
          <h2>7. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use automated systems or bots to earn entries</li>
            <li>Create multiple accounts</li>
            <li>Engage in fraudulent activity</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </section>

        <section>
          <h2>8. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account at any time for violations of these Terms of Service.
          </p>
        </section>

        <section>
          <h2>9. Limitation of Liability</h2>
          <p>
            Total Raffle shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the Service.
          </p>
        </section>

        <section>
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2>11. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at: support@totalraffle.co.uk
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
