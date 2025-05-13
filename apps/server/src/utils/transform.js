export function transform(object) {
  if (!object) return;

  const exlude = [
    "__v",
    "password",
  ]
  object = JSON.parse(JSON.stringify(object));

  if (Array.isArray(object)) return object.map((item) => transform(item));

  if (typeof object === "object") {
    const newObject = {};

    for (const [key, value] of Object.entries(object)) {
      if (exlude.includes(key)) continue;
      if (key === "_id") newObject.id = value;
      else {
        newObject[key] = transform(value);
      }
    }
    return newObject;
  }

  return object;
}
