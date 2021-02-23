import umap from 'umap';
import {parse} from './utils.js';

const {isArray} = Array;

const cache = umap(new WeakMap);

class ULine extends String {
  constructor(content) {
    super(String(content));
    this.is_uline = true;
  }
  min(){
    return this; // TODO: make this compatible with ucontent
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

export const raw = (template, ...values) => new ULine(
  stringify(template, values)
);

export const css = raw;

export const html = uhtmlParity((template, ...values) => new ULine(
  content(template, values, false)
));

export const svg = uhtmlParity((template, ...values) => new ULine(
  content(template, values, true)
));

function chunks(value, i) {
  return value + this[i + 1];
}

function update(value, i) {
  return this[i](value);
}
