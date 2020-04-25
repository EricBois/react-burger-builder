import React from 'react';
import classes from './BuildControls.module.css';
import BuildControl from './BuildControls/BuildControl/BuildControl';

const controls = [
  { label: 'Salad', type: 'salad' },
  { label: 'Bacon', type: 'bacon' },
  { label: 'Cheese', type: 'cheese' },
  { label: 'Meat', type: 'meat' },
];

const buildControls = (props) => (
  <div className={classes.BuildControls}>
    <p>
      Current Price: <strong>{props.price}</strong>{' '}
    </p>
    {controls.map((ctrl) => (
      <BuildControl
        key={ctrl.label}
        label={ctrl.label}
        deleted={() => props.remove(ctrl.type)}
        added={() => props.add(ctrl.type)}
        disabled={props.disabled[ctrl.type]}
      />
    ))}
    <button
      disabled={!props.purchasable}
      className={classes.OrderButton}
      onClick={props.ordered}
    >
      ORDER NOW
    </button>
  </div>
);

export default buildControls;
