const genStartPosition = (min, max, multiple) => {
  return Math.floor(Math.random() * ((max - min) / multiple)) * multiple + min;
};

export { genStartPosition };