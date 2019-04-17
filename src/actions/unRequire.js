import PropTypes from "prop-types";
import { pull } from "lodash";

import { toArray, findRelSchemaAndField } from "../utils";
import { validateFields } from "./validateAction";

function doUnRequire({ field, schema }) {
  pull(schema.required, field);
}

/**
 * Makes provided field required
 *
 * @param params
 * @param schema
 * @param uiSchema
 * @returns {{schema: *, uiSchema: *}}
 */
export default function unRequire({ field }, schema) {
  const fieldArr = toArray(field);

  toArray(fieldArr).forEach(field =>
    doUnRequire(findRelSchemaAndField(field, schema))
  );
}

unRequire.propTypes = {
  field: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

unRequire.validate = validateFields("unRequire", function({ field }) {
  return field;
});
