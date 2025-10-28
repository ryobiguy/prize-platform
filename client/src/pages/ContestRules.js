import React from 'react';
import { Award } from 'lucide-react';
import './Legal.css';

const ContestRules = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <div className="container">
          <Award size={48} />
          <h1>Contest Rules</h1>
          <p>Official Rules for Total Raffle Prize Draws</p>
        </div>
      </div>

      <div className="container">
        <div className="legal-content">
          <section>
            <h2>1. Overview</h2>
            <p>
              Total Raffle operates a skill-free prize draw platform where participants can enter draws by 
              earning free entries through completing tasks and offers. No purchase is necessary to participate.
            </p>
          </section>

          <section>
            <h2>2. Eligibility</h2>
            <p>To participate in prize draws, you must:</p>
            <ul>
              <li>Be at least 18 years of age</li>
              <li>Be a legal resident of the United Kingdom</li>
              <li>Have a valid email address</li>
              <li>Create a free account on the Platform</li>
              <li>Comply with all Terms & Conditions</li>
            </ul>
            <p><strong>Employees and immediate family members of Total Raffle are not eligible to participate.</strong></p>
          </section>

          <section>
            <h2>3. How to Enter</h2>
            
            <h3>3.1 Earning Entries</h3>
            <p>Participants can earn free entries by:</p>
            <ul>
              <li><strong>Registration Bonus:</strong> Receive 10 free entries upon account creation</li>
              <li><strong>Completing Tasks:</strong> Follow social media accounts, share content, etc.</li>
              <li><strong>Watching Advertisements:</strong> View video ads (typically 30 seconds)</li>
              <li><strong>Completing Offers:</strong> Sign up for trials, download apps, complete surveys</li>
              <li><strong>Daily Bonuses:</strong> Log in daily for bonus entries</li>
              <li><strong>Referrals:</strong> Invite friends to join the Platform</li>
            </ul>

            <h3>3.2 Using Entries</h3>
            <p>Once you have entries in your account:</p>
            <ol>
              <li>Browse available prize draws</li>
              <li>Select the prize you want to enter</li>
              <li>Choose how many entries to use (minimum 1, maximum varies by prize)</li>
              <li>Confirm your entry</li>
            </ol>
            <p><strong>Entries are non-refundable once used for a draw.</strong></p>

            <h3>3.3 Entry Limits</h3>
            <p>
              Each prize draw has a maximum entry limit per user (typically 100 entries). This ensures fair 
              participation for all users.
            </p>
          </section>

          <section>
            <h2>4. Prize Draw Schedule</h2>
            
            <h3>4.1 Draw Frequency</h3>
            <p>Prize draws are conducted weekly, typically on Fridays at 8:00 PM GMT.</p>

            <h3>4.2 Draw Period</h3>
            <p>Each prize has:</p>
            <ul>
              <li><strong>Start Date:</strong> When entries begin being accepted</li>
              <li><strong>End Date:</strong> When entries close (typically Friday 8:00 PM)</li>
              <li><strong>Draw Date:</strong> When the winner is selected (same as end date)</li>
            </ul>

            <h3>4.3 Minimum Entry Requirement</h3>
            <p>
              Each prize draw has a minimum total entry requirement. If this minimum is not met by the draw date:
            </p>
            <ul>
              <li>The draw will be postponed to the following week</li>
              <li>OR the draw will be cancelled and all entries refunded</li>
              <li>Participants will be notified via email</li>
            </ul>
          </section>

          <section>
            <h2>5. Winner Selection</h2>
            
            <h3>5.1 Selection Method</h3>
            <p>Winners are selected using a provably fair random number generator:</p>
            <ol>
              <li>All entries are assigned sequential numbers</li>
              <li>A cryptographically secure random number is generated</li>
              <li>The entry matching that number wins</li>
              <li>The process is logged and can be verified</li>
            </ol>

            <h3>5.2 Odds of Winning</h3>
            <p>
              Your odds of winning depend on the number of entries you have versus the total entries in the draw. 
              More entries increase your chances but do not guarantee a win.
            </p>
            <p><strong>Example:</strong> If you have 10 entries and there are 1,000 total entries, your odds are 10/1,000 or 1%.</p>

            <h3>5.3 Multiple Winners</h3>
            <p>
              Some prizes may have multiple winners. The same user cannot win the same prize multiple times in one draw.
            </p>
          </section>

          <section>
            <h2>6. Winner Notification</h2>
            
            <h3>6.1 Notification Process</h3>
            <p>Winners will be notified via:</p>
            <ul>
              <li>Email to the address on file (within 48 hours of draw)</li>
              <li>In-app notification on the Platform</li>
              <li>Public announcement on the Winners page (first name + last initial only)</li>
            </ul>

            <h3>6.2 Response Deadline</h3>
            <p>
              Winners must respond to the notification email within <strong>7 days</strong> to claim their prize. 
              Failure to respond may result in forfeiture, and an alternate winner may be selected.
            </p>

            <h3>6.3 Verification</h3>
            <p>Winners may be required to:</p>
            <ul>
              <li>Verify their identity</li>
              <li>Confirm eligibility</li>
              <li>Provide shipping information (for physical prizes)</li>
              <li>Sign a winner's declaration form</li>
            </ul>
          </section>

          <section>
            <h2>7. Prizes</h2>
            
            <h3>7.1 Prize Types</h3>
            <p>Prizes may include:</p>
            <ul>
              <li><strong>Cash:</strong> Transferred via bank transfer or PayPal</li>
              <li><strong>Gift Cards:</strong> Delivered via email</li>
              <li><strong>Physical Items:</strong> Shipped to winner's address</li>
            </ul>

            <h3>7.2 Prize Values</h3>
            <p>Prize values range from £50 to £1,000 or more. The exact value is displayed on each prize listing.</p>

            <h3>7.3 Prize Delivery</h3>
            <p>Prizes will be delivered within <strong>30 days</strong> of winner confirmation:</p>
            <ul>
              <li><strong>Cash/Gift Cards:</strong> 7-14 days</li>
              <li><strong>Physical Items:</strong> 14-30 days (depending on availability and shipping)</li>
            </ul>

            <h3>7.4 Shipping</h3>
            <p>
              Physical prizes are shipped to UK addresses only (unless otherwise stated). 
              Winners are responsible for providing accurate shipping information.
            </p>

            <h3>7.5 Prize Substitution</h3>
            <p>
              We reserve the right to substitute a prize with one of equal or greater value if the advertised 
              prize becomes unavailable due to circumstances beyond our control.
            </p>

            <h3>7.6 Non-Transferable</h3>
            <p>Prizes are non-transferable and cannot be exchanged for cash (except cash prizes).</p>
          </section>

          <section>
            <h2>8. Taxes and Fees</h2>
            <p>
              Winners are responsible for any taxes, duties, or fees associated with prize acceptance as required 
              by UK law. We will provide any necessary documentation for tax purposes.
            </p>
            <p>
              For prizes valued over £500, winners may be required to complete tax forms.
            </p>
          </section>

          <section>
            <h2>9. Publicity</h2>
            <p>
              By accepting a prize, winners consent to the use of their first name and last initial for 
              promotional purposes without additional compensation. Full names will not be disclosed without consent.
            </p>
            <p>Winners may be asked (but not required) to:</p>
            <ul>
              <li>Provide a testimonial</li>
              <li>Participate in promotional photos</li>
              <li>Share their winning experience</li>
            </ul>
          </section>

          <section>
            <h2>10. Disqualification</h2>
            <p>Participants may be disqualified for:</p>
            <ul>
              <li>Violating Terms & Conditions</li>
              <li>Using multiple accounts</li>
              <li>Using bots or automated entry methods</li>
              <li>Providing false information</li>
              <li>Attempting to manipulate the draw</li>
              <li>Fraudulent activity</li>
              <li>Failure to respond to winner notification</li>
            </ul>
            <p>Disqualified participants forfeit all entries and prizes.</p>
          </section>

          <section>
            <h2>11. Cancellation and Modification</h2>
            <p>We reserve the right to:</p>
            <ul>
              <li>Cancel or postpone a draw if minimum entries are not met</li>
              <li>Modify draw dates or prize details with notice</li>
              <li>Cancel the Platform or specific draws at our discretion</li>
              <li>Modify these rules with notice to participants</li>
            </ul>
            <p>In the event of cancellation, unused entries will be refunded or credited to your account.</p>
          </section>

          <section>
            <h2>12. Disputes</h2>
            <p>
              All decisions regarding winner selection, eligibility, and rule interpretation are final and binding. 
              Disputes will be resolved in accordance with UK law.
            </p>
            <p>
              If you have a complaint, please contact us at support@totalraffle.com. We will investigate and 
              respond within 14 days.
            </p>
          </section>

          <section>
            <h2>13. Limitation of Liability</h2>
            <p>Total Raffle is not responsible for:</p>
            <ul>
              <li>Technical failures or interruptions</li>
              <li>Lost, late, or misdirected entries</li>
              <li>Unauthorized access to accounts</li>
              <li>Errors in prize descriptions or values</li>
              <li>Delays in prize delivery beyond our control</li>
              <li>Third-party offer completion issues</li>
            </ul>
          </section>

          <section>
            <h2>14. No Purchase Necessary</h2>
            <p>
              <strong>NO PURCHASE IS NECESSARY TO ENTER OR WIN.</strong> All entries can be earned for free 
              by completing tasks and offers. Purchasing products or services does not increase your chances of winning.
            </p>
          </section>

          <section>
            <h2>15. Skill-Free Competition</h2>
            <p>
              This is a prize draw based purely on chance, not skill. Winners are selected randomly, and no 
              skill or knowledge is required to participate or win.
            </p>
          </section>

          <section>
            <h2>16. Data Protection</h2>
            <p>
              Personal information collected during prize draws is used in accordance with our Privacy Policy 
              and UK GDPR regulations.
            </p>
          </section>

          <section>
            <h2>17. Governing Law</h2>
            <p>
              These Contest Rules are governed by the laws of England and Wales. Any disputes shall be subject 
              to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2>18. Contact Information</h2>
            <p>For questions about these Contest Rules or prize draws, contact us at:</p>
            <p>
              <strong>Email:</strong> support@totalraffle.com<br />
              <strong>Prize Inquiries:</strong> prizes@totalraffle.com<br />
              <strong>Address:</strong> [Your Business Address]
            </p>
          </section>

          <section className="important-notice">
            <h2>⚠️ Important Notice</h2>
            <p>
              <strong>Please play responsibly.</strong> While our platform is free to use, we encourage responsible 
              participation. If you feel you are spending too much time on the platform, please contact us or 
              seek support.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContestRules;
