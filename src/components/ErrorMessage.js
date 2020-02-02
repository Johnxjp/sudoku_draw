import React from "react";

import "../style/ErrorMessage.css";

const DrawingError = {
  NO_ERROR: 0,
  INVALID_PREDICTION: 1,
  ERROR_FROM_SERVER: 2
};

var displayText = {};
displayText[DrawingError.INVALID_PREDICTION] =
  "Bad Input: A number between 1-9 couldn't be predicted \
    with high enough confidence. Try to draw the digit in the center \
    of the canvas and large.";
displayText[DrawingError.ERROR_FROM_SERVER] =
  "Oops, something went wrong on the server!";

const ErrorMessage = props => {
  return (
    <div
      id="error-message"
      style={{
        display: props.error === DrawingError.NO_ERROR ? "none" : "block"
      }}
    >
      {displayText[props.error]}
    </div>
  );
};

export { DrawingError, ErrorMessage };
