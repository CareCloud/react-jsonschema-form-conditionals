import PropTypes from "prop-types";

import { toArray } from "../utils";
import { hasConfig, getValueFromData } from "./utils";
import { validateFields } from "./validateAction";

/**
 * Append original field in uiSchema with external configuration.
 *
 * @param uiSchema
 * @param params
 * @param formData
 */
function doAppend(uiSchema, params, formData) {
  Object.keys(params).forEach(field => {
    let appendVal = params[field];
    let fieldUiSchema = uiSchema[field];

    console.log("$$ appendVal", appendVal);
    // Special case, to get the value from formData
    if (hasConfig(appendVal)) {
      appendVal = getValueFromData(formData, appendVal);
    }
    console.log("$$ fieldUiSchema", fieldUiSchema);

    if (!fieldUiSchema) {
      uiSchema[field] = appendVal;
    } else if (Array.isArray(fieldUiSchema)) {
      toArray(appendVal)
        .filter(v => !fieldUiSchema.includes(v))
        .forEach(v => fieldUiSchema.push(v));
    } else if (typeof appendVal === "object" && !Array.isArray(appendVal)) {
      doAppend(fieldUiSchema, appendVal, formData);
    } else if (typeof fieldUiSchema === "string") {
      if (!fieldUiSchema.includes(appendVal)) {
        uiSchema[field] = fieldUiSchema + " " + appendVal;
      }
    } else {
      uiSchema[field] = appendVal;
    }
  });
}

export default function uiAppend(params, schema, uiSchema, formData) {
  doAppend(uiSchema, params, formData);
}

uiAppend.propTypes = PropTypes.object.isRequired;
uiAppend.validate = validateFields("uiAppend", function(params) {
  return Object.keys(params);
});
