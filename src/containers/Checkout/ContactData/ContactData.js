import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';

class ContactData extends Component {
   
  wrapperElements = (type, config, value, validate) => {
    return {
      elementType: type,
        elementConfig: config,
        value: value,
        validation: validate,
        valid: false,
        touched: false
    }
  }

  state = {
    orderForm: {
      //creating with wrapper
      name: this.wrapperElements('input', {type: 'text', placeholder: 'Your Name' }, '', {required: true}),
      street: this.wrapperElements('input', {type: 'text', placeholder: 'Street' }, '', {required: true}),
      postalCode: this.wrapperElements('input', {type: 'text', placeholder: 'Postal Code' }, '', {required: true, minLength: 6, maxLength: 6}),
      country: this.wrapperElements('input', {type: 'text', placeholder: 'Country' }, '', {required: true}),
      email: this.wrapperElements('input', {type: 'email', placeholder: 'Your Email' }, '', {required: true}),
      deliveryMethod: this.wrapperElements('select', {options: [
        {value: 'fastest', displayValue: 'Fastest'},
        {value: 'regular', displayValue: 'Regular'},
      ] }, ''),
    },
    loading: false,
  };

  orderHandler = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementId in this.state.orderForm) {
      formData[formElementId] = this.state.orderForm[formElementId].value
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData
    };
    axios
      .post('/orders.json', order)
      .then((res) => {
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
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
    this.setState({orderForm: updatedOrderForm});
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
        <Button btnType="Success">
          Order
        </Button>
      </form>
    );
    if (this.state.loading) {
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

export default ContactData;
