const env = (key, defaultValue = "") => {
  const value = process.env[key];

  if (!value) {
    if (defaultValue) return defaultValue;

    throw new Error(`Environment variable ${key} is not set`);
  }

  return value;
};

export { env };
