from flask import Flask, redirect, url_for, request, render_template, jsonify
import time
import re
import json
import os
import stripe

stripe.api_key = "sk_test_51Ji2hmLfZ1eyvu4gMo4tzK723HAjiFvkeSZYrba5rroZgSvzeW7jN5fmx5NmA3IDgzowdp9XkmP5TKzTk096wcjA00b7GCAPOt"

app = Flask(__name__, static_folder="public",
            static_url_path="", template_folder="public")

orderList = []
orderStatuses = {}

@app.route('/')
def home():
   return render_template('index1.html')

@app.route('/placeorder/<order>/<name>')
def placeOrder(order, name):
    #order = re.sub('&amp;', '&', order)
    orderStr = str(order) + str(name)
    orderList.append(orderStr)
    orderStatuses[orderStr] = 'pending'
    print(orderList)
    while orderStatuses[orderStr] == 'pending':
        None
    status = {'accepted': orderStatuses[orderStr]}
    orderStatuses.pop(orderStr)
    return status

@app.route('/getOrderString')
def getOrderString():
   while len(orderList) == 0:
      None
   print(orderList[0])
   orderName = orderList[0]
   orderList.pop(0)
   return {'order': orderName}


@app.route('/respondWithTime/<time>/<order>')
def respondWithTime(time, order):
   order = re.sub('&amp;', '&', order)
   print(order + ' RESPONSE')
   orderStatuses[order] = str(time) + ' minutes'
   return 'hello'

prices = {'1pc': 899, '2pc': 1299, '3pc': 1599}
def calculate_order_amount(data):
    #print(items)
    '''price = 0
    for item in items:
       print(item['id'])
       price += prices[item['id']]
    # Replace this constant with a calculation of the order's amount
    # Calculate the order total on the server to prevent
    # people from directly manipulating the amount on the client
    print(price)'''
    print(float(data['price']))
    return int(float(data['price']) * 100)

@app.route('/create-payment-intent', methods=['POST'])
def create_payment():
    try:
        data = json.loads(request.data)
        intent = stripe.PaymentIntent.create(
            amount=calculate_order_amount(data),
            currency='usd'
        )
        return jsonify({
          'clientSecret': intent['client_secret']
        })
    except Exception as e:
        return jsonify(error=str(e)), 403
if __name__ == '__main__':
    app.run()
