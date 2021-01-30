import register from 'ignore-styles';

register(
  ['.css'],
  (module) =>
    (module.exports = new Proxy(
      {},
      {
        get(target, prop) {
          return prop;
        },
      }
    ))
);
