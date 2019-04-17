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
    console.log("$$ setFormData", field);
    let value = params[field];

    // Special case, to get the value from formData
    if (hasConfig(value)) {
      const config = getConfig(value);
      value = config.value || getValueFromData(formData, value);
      console.log("$$ setFormData value", value);

      // Only execute this if the value has actually changed
      // if (!isEqual(get(prevFormData, config.changed), get(formData, config.changed))) {
      // const value = valueParser(valueFrom);
      // set(formData, field, value);

      const toSchema = get(schema, `properties.${field}`);

      if (toSchema && toSchema.enum) {
        const optionIndex = toSchema.enum.findIndex(o => o === value);
        value = {
          value: toSchema.enum[optionIndex],
          label: toSchema.enumNames[optionIndex],
        };
      }

      set(formData, field, value);
      // }
    }
  });
}
