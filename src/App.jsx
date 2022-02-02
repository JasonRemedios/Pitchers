import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "./App.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with your real test publishable API key.
const promise = loadStripe("pk_test_51Ji2hmLfZ1eyvu4gsYp6L2Qm97rumx0clXvr4gm8ltXMErkeBQlZfHrdMGKSaYXOYjm2rKIXglu5SLY1H59HPqNY00Ai9qoenS");

export default function App(props) {
  return (
    <div className="App w3-display-container">
      <Elements stripe={promise}>
        <CheckoutForm items={props.items} />
      </Elements>
    </div>
  );
}
