import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

import { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef((props, refs) => {
  const [visable, setVisable] = useState(false);

  const hideWhenVisable = { display: visable ? "none" : "" };
  const showWhenVisable = { display: visable ? "" : "none" };

  const toggleVisibility = () => {
    setVisable(!visable);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <>
      <div style={hideWhenVisable}>
        <Button variant="primary" onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisable}>
        {props.children}
        <Button variant="primary" onClick={toggleVisibility}>cancel</Button>
      </div>
    </>
  );
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
