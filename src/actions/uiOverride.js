import PropTypes from "prop-types";

import { hasConfig, getValueFromData } from "./utils";
import { validateFields } from "./validateAction";

/**
 * Override original field in uiSchema with defined configuration.
 *
 * @param uiSchema
 * @param params
 * @param formData
 */
function doOverride(uiSchema, params, formData) {
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
    } else if (typeof appendVal === "object" && !Array.isArray(appendVal)) {
      doOverride(fieldUiSchema, appendVal, formData);
    } else {
      uiSchema[field] = appendVal;
    }
  });
}

export default function uiOverride(params, schema, uiSchema, formData) {
  doOverride(uiSchema, params, formData);
}

uiOverride.propTypes = PropTypes.object.isRequired;
uiOverride.validate = validateFields("uiOverride", function(params) {
  return Object.keys(params);
});
