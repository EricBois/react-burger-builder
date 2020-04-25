import React from 'react';
import logoBurger from '../../assets/images/logo.png';
import classes from './Logo.module.css';

const logo = (props) => (
  <div className={classes.Logo}>
    <img src={logoBurger} alt="Logo"/>
  </div>
);

export default logo;