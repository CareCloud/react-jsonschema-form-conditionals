import get from "lodash/get";
import set from "lodash/set";

import { hasConfig, getConfig, getValueFromData } from "./utils";

export default function formData(
  params,
  schema,
  uiSchema,
  formData,
  prevFormData
) {
  Object.keys(params).forEach(field => {
    let value = params[field];

    // Special case, to get the value from formData
    if (hasConfig(value)) {
      const config = getConfig(value);
      value = config.value || getValueFromData(formData, value);

      const toSchema = get(schema, `properties.${field}`);

      if (toSchema && toSchema.enum) {
        const optionIndex = toSchema.enum.findIndex(o => o === value);
        value = {
          value: toSchema.enum[optionIndex],
          label: toSchema.enumNames[optionIndex],
        };
      }

      set(formData, field, value);
    }
  });
}
