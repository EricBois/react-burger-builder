import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import ContactData from './ContactData/ContactData';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

class Checkout extends Component {
  state = {
    ingredients: null,
    totalPrice: 0
  }

  componentWillMount () {
    // extract ingredients from search and set them to state
    const query = new URLSearchParams(this.props.location.search);
    const ingredients = {};
    let price = 0;
    for (let param of query.entries()) {
      if (param[0] === 'price') {
        price = param[1];
      } else {
        ingredients[param[0]] = +param[1]
      } 
    }
    this.setState({ ingredients: ingredients, totalPrice: price})
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinuedHander = () => {
    this.props.history.replace('/checkout/contact-data');
  }

  render () {
    return (
      <div>
        <CheckoutSummary
          cancelled={this.checkoutCancelledHandler}
          continued={this.checkoutContinuedHander}
          ingredients={this.state.ingredients}
        />
        {/* props to be able to use history.push in contact data, passing all props in module */}
        <Route path={this.props.match.path + '/contact-data'} render={(props) => (<ContactData price={this.state.totalPrice} ingredients={this.state.ingredients} {...props} />)} />
      </div>
    );
  }
}

export default Checkout;