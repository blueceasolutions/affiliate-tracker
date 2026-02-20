/**
 * Bluecea Affiliate Destination Tracker
 * 
 * Instructions for Merchants:
 * Place this script in the <head> of your website (e.g. example.com).
 * This captures the ?ref=UUID parameter when a user visits from Bluecea
 * and stores it in localStorage so you can access it at checkout.
 */
(function () {
  // 1. Check URL for affiliate referral code
  const urlParams = new URLSearchParams(window.location.search);
  const refId = urlParams.get('ref');

  if (refId) {
    // 2. Save it to localStorage for persistence across the user's session
    localStorage.setItem('bc_aff_id', refId);
  }

  // 3. Expose a helper method globally to retrieve the ID at checkout time
  window.Bluecea = window.Bluecea || {};
  window.Bluecea.getAffiliateId = function () {
    return localStorage.getItem('bc_aff_id');
  };

  /**
   * Usage Example during Paystack Initialization:
   * 
   * const affiliateId = window.Bluecea.getAffiliateId();
   * 
   * const paymentSetup = {
   *   email: customerEmail,
   *   amount: amountInKobo,
   *   metadata: {
   *     custom_fields: [
   *       {
   *         display_name: "Affiliate Link ID",
   *         variable_name: "affiliate_link_id",
   *         value: affiliateId
   *       }
   *     ]
   *   }
   * };
   */
})();
