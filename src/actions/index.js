import remove from "./remove";
import require from "./require";
import unRequire from "./unRequire";
import uiAppend from "./uiAppend";
import uiReplace from "./uiReplace";
import uiOverride from "./uiOverride";
import formData from "./formData";

export const DEFAULT_ACTIONS = {
  remove,
  require,
  unRequire,
  uiAppend,
  uiReplace,
  uiOverride,
  formData,
};

export default async function execute(
  { type, params },
  schema,
  uiSchema,
  formData,
  extraActions = {},
  prevFormData
) {
  let action = extraActions[type] ? extraActions[type] : DEFAULT_ACTIONS[type];
  await action(params, schema, uiSchema, formData, prevFormData);
}
