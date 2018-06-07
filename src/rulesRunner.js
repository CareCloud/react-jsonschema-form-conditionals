import execute from "./actions";
import isEqual from "lodash/isEqual";
import findKey from "lodash/findKey";
import get from "lodash/get";
import deepcopy from "deepcopy";
import { deepEquals } from "react-jsonschema-form/lib/utils";
import predicate from "predicate";
import Engine from "json-rules-engine-simplified";

predicate.isForDropdown = predicate.curry((val, match) => {
  return !!val && predicate.equal(val.value === match);
});

function doRunRules(
  engine,
  formData,
  schema,
  uiSchema,
  extraActions = {},
  prevFormData
) {
  let schemaCopy = deepcopy(schema);
  let uiSchemaCopy = deepcopy(uiSchema);
  let formDataCopy = deepcopy(formData);

  let res = engine.run(formData).then(events => {
    return Promise.all(
      events.map(event =>
        execute(
          event,
          schemaCopy,
          uiSchemaCopy,
          formDataCopy,
          extraActions,
          prevFormData
        )
      )
    );
  });

  return res.then(() => {
    return {
      schema: schemaCopy,
      uiSchema: uiSchemaCopy,
      formData: formDataCopy,
    };
  });
}

export function normRules(rules) {
  return rules.sort(function(a, b) {
    if (a.order === undefined) {
      return b.order === undefined ? 0 : 1;
    }
    return b.order === undefined ? -1 : a.order - b.order;
  });
}

export default function rulesRunner(schema, uiSchema, rules, extraActions) {
  // class MyEngine extends Engine {
  //
  // }

  // normRules(rules).forEach(rule => engine.addRule(rule));

  return (formData, prevFormData) => {
    if (formData === undefined || formData === null) {
      return Promise.resolve({ schema, uiSchema, formData });
    }
    rules = normRules(deepcopy(rules)).filter(({ conditions }) => {
      const fieldName = findKey(conditions, (value, key) => {
        return (
          value === "changed" || (typeof value === "object" && value.changed)
        );
      });

      if (fieldName) {
        if (!isEqual(get(formData, fieldName), get(prevFormData, fieldName))) {
          conditions[fieldName] = { not: "empty" };
          return true;
        } else {
          return false;
        }
      }

      return true;
    });

    let engine = new Engine(normRules(rules), schema);

    return doRunRules(
      engine,
      formData,
      schema,
      uiSchema,
      extraActions,
      prevFormData
    ).then(conf => {
      if (deepEquals(conf.formData, formData)) {
        return conf;
      } else {
        return doRunRules(
          engine,
          conf.formData,
          schema,
          uiSchema,
          extraActions,
          prevFormData
        );
      }
    });
  };
}
