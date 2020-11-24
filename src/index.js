import umap from 'umap';
import {parse} from './utils.js';

const {isArray} = Array;

const cache = umap(new WeakMap);

class UString extends String {
  constructor(content) {
    super(String(content));
    this.is_ustring = true;
  }
};

const content = (template, values, svg) => {
  const {length} = values;
  const updates = cache.get(template) ||
                  cache.set(template, parse(template, length, svg));
  return length ? values.map(update, updates).join('') : updates[0]();
};

const join = (template, values) => (
  template[0] + values.map(chunks, template).join('')
);

const stringify = (template, values) =>
                    isArray(template) ? join(template, values) : template;

const uhtmlParity = fn => {
  // both `.node` and `.for` are for feature parity with uhtml
  // but don't do anything different from regular function call
  fn.node = fn;
  fn.for = () => fn;
  return fn;
};

export const css = (template, ...values) => new UString(
  stringify(template, values)
);

export const js = (template, ...values) => new UString(
  stringify(template, values)
);

export const raw = (template, ...values) => new UString(
  stringify(template, values)
);

export const html = uhtmlParity((template, ...values) => new UString(
  content(template, values, false)
));

export const svg = uhtmlParity((template, ...values) => new UString(
  content(template, values, true)
));

function chunks(value, i) {
  return value + this[i + 1];
}

function update(value, i) {
  return this[i](value);
}