import { config } from "@/configs/app";

export function transform(object) {
  if (!object) return;

  const exlude = ["__v", "password"];
  object = JSON.parse(JSON.stringify(object));

  if (Array.isArray(object)) return object.map((item) => transform(item));

  if (typeof object === "object") {
    const newObject = {};

    for (const [key, value] of Object.entries(object)) {
      if (exlude.includes(key)) continue;
      else if (key === "_id") {
        newObject.id = value;
        continue;
      }
      else if (key === "avatar") {
        if (isValidURL(value)) {
          newObject.avatar = value;
        } else {
          newObject.avatar = config.STATIC_FILE_SERVER_URL + value;
        }
      } else {
        newObject[key] = transform(value);
      }
    }
    return newObject;
  }

  return object;
}

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (e) {
    return false;
  }
}
