import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
   
  wrapperElements = (type, config, value, validate, valid) => {
    return {
      elementType: type,
        elementConfig: config,
        value: value,
        validation: validate,
        valid: valid || true,
        touched: false
    }
  }

  state = {
    orderForm: {
      //creating with wrapper
      name: this.wrapperElements('input', {type: 'text', placeholder: 'Your Name' }, '', {required: true}, false),
      street: this.wrapperElements('input', {type: 'text', placeholder: 'Street' }, '', {required: true}, false),
      postalCode: this.wrapperElements('input', {type: 'text', placeholder: 'Postal Code' }, '', {required: true, minLength: 6, maxLength: 6}, false),
      country: this.wrapperElements('input', {type: 'text', placeholder: 'Country' }, '', {required: true}, false),
      email: this.wrapperElements('input', {type: 'email', placeholder: 'Your Email' }, '', {required: true}, false),
      deliveryMethod: this.wrapperElements('select', {options: [
        {value: 'fastest', displayValue: 'Fastest'},
        {value: 'regular', displayValue: 'Regular'},
      ] }, 'fastest', {}),
    },
    formIsValid: false
  };

  orderHandler = (e) => {
    e.preventDefault();
    const formData = {};
    for (let formElementId in this.state.orderForm) {
      formData[formElementId] = this.state.orderForm[formElementId].value
    }
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData
    };
    
    this.props.onOrderBurger(order);
  };

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid
    }

    return isValid;
  }

  inputChangeHandler = (e, inputId) => {
    // clone data but doesnt clone nested data
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    // to clone nested data
    const updatedFormElement = {
      ...updatedOrderForm[inputId]
    };
    // set changed value
    updatedFormElement.value = e.target.value;
    // check if rules are valid
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
    updatedFormElement.touched = true;
    updatedOrderForm[inputId] = updatedFormElement;

    let formIsValid = true;
    for (let inputId in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputId].valid && formIsValid;
    }

    this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
  }

  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(formElement => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangeHandler(event, formElement.id)}
          />
        ))}
        <Button disabled={!this.state.formIsValid} btnType="Success">
          Order
        </Button>
      </form>
    );
    if (this.props.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact info</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData) => dispatch(actions.purchaseBurger(orderData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
