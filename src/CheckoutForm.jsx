import React, { useState, useEffect } from "react";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

export default function CheckoutForm(props) {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    window
      .fetch("/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(props.items)
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setClientSecret(data.clientSecret);
      });
  }, []);
  console.log(props.items);
  var str = ''
  for (let item of props.items.items) {
    console.log(item);
    str += item.id;
    str += ' ';
  };
  console.log(str);

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
    let ellipses = '.';
    var interval = setInterval(function(){ 
    document.getElementById('wholeCheckoutForm').innerHTML = 'Awaiting response from restaurant' + ellipses;
    //document.getElementById('wholeCheckoutForm').style.textAlign = 'left!important';
    ellipses += '.';
    if (ellipses === '....') {
      ellipses = '.';
    } }, 500);
    let name = document.getElementById('name').value;
    fetch('/placeorder/' + str + '/' + name)
      .then(res => res.json())
      .then(data => changeAndClear(data, interval));
      //.then(clearInterval(interval));
  };

  return (
    <div id='checkoutDiv' style={{textAlign: 'center!important'}}><span id='checkoutForm'>Name:<br></br><input id='name' style={{width: '90%'}}></input></span><br></br>
    <form id="payment-form" onSubmit={handleSubmit} style={{width: '90%', position: 'relative', left: '50%', bottom: '0', transform: 'translate(-50%,0%)'}}>
      <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
      <button
        disabled={processing || disabled || succeeded}
        id="submit"
      >
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            "Pay now"
          )}
        </span>
      </button>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      {/* Show a success message upon completion */}
      <p className={succeeded ? "result-message" : "result-message hidden"}>
        Payment succeeded, see the result in your
        <a
          href={`https://dashboard.stripe.com/test/payments`}
        >
          {" "}
          Stripe dashboard.
        </a> Refresh the page to pay again.
      </p>
    </form>
    </div>
  );
}

function changeAndClear(data, interval) {
  clearInterval(interval);
  document.getElementById('wholeCheckoutForm').innerHTML = 'Your order should be ready in ' + data.accepted + '.';
  document.getElementById('wholeCheckoutForm').style.textAlign = 'center';
}
