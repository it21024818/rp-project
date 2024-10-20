import React from "react";
import axios from "axios";

const CheckoutPage: React.FC = () => {
  const handleCheckout = async () => {
    try {
      // Retrieve the access token from local storage
      const accessToken = localStorage.getItem("accessToken");

      // Set up the request body with necessary details
      const requestBody = {
        // Include the price ID associated with the plan
        line_items: [
          {
            // Replace with a real price ID from your Stripe dashboard
            price: "price_12345", // Alternatively, you can use price_data here
            quantity: 1,
          },
        ],
      };

      // Make a POST request to the checkout endpoint
      const response = await axios.post(
        "http://localhost:3000/v1/payments/stripe/checkout",
        requestBody, // Pass the request body here
        {
          params: {
            "plan-id": "67153697ca6bb825f16486e6", // Passing the plan ID in the query parameters
          },
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add Authorization header with the Bearer token
          },
        }
      );

      // Check if a URL is returned from the server
      if (response.data.url) {
        // Redirect to the Stripe checkout page
        window.location.href = response.data.url;
      } else {
        console.error("No URL returned from the server");
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
    }
  };

  return (
    <div>
      <h2>Complete Your Checkout</h2>
      <button onClick={handleCheckout}>Checkout with Stripe</button>
    </div>
  );
};

export default CheckoutPage;
