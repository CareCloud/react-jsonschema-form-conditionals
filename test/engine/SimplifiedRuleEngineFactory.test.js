import engineFactory from "../../src/engine/SimplifiedRuleEngineFactory";

let rules = [
  {
    conditions: {
      age: {
        greater: 5,
        less: 70,
      },
    },
    event: {
      type: "remove",
      params: { field: ["telephone"] },
    },
  },
];

let schema = {
  properties: {
    age: { type: "number" },
    telephone: { type: "string" },
  },
};

let engine = engineFactory.getEngine(rules, schema);

test("age greater 5", () => {
  return engine
    .run({ age: 10 })
    .then(actions =>
      expect(actions).toEqual([
        { type: "remove", params: { field: ["telephone"] } },
      ])
    );
});

test("age less 5", () => {
  return engine.run({ age: 4 }).then(actions => expect(actions).toEqual([]));
});

test("age less 70 ", () => {
  return engine
    .run({ age: 69 })
    .then(actions =>
      expect(actions).toEqual([
        { type: "remove", params: { field: ["telephone"] } },
      ])
    );
});

test("age greater 70 ", () => {
  return engine.run({ age: 71 }).then(actions => expect(actions).toEqual([]));
});
