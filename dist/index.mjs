import umap from 'umap';
import { escape } from 'html-escaper';
import uhyphen from 'uhyphen';
import instrument from 'uparser';

const {toString} = Function;
const {assign, keys} = Object;

const prefix = 'isµ' + Date.now();
const interpolation = new RegExp(
  `(<!--${prefix}(\\d+)-->|\\s*${prefix}(\\d+)=('|")([^\\4]+?)\\4)`, 'g'
);

const attribute = (name, quote, value) =>
                    ` ${name}=${quote}${escape(value)}${quote}`;

const getValue = value => {
  switch (typeof value) {
    case 'string':
      return escape(value);
    case 'boolean':
    case 'number':
      return String(value);
    case 'object':
      switch (true) {
        case value instanceof Array:
          return value.map(getValue).join('');
        case value && value.is_uline:
          return value.toString()
      }
  }
  return value == null ? '' : escape(String(value));
};

const parse = (template, expectedLength, svg) => {
  const text = instrument(template, prefix, svg);
  const html = text;
  const updates = [];
  let i = 0;
  let match = null;
  while (match = interpolation.exec(html)) {
    const pre = html.slice(i, match.index);
    i = match.index + match[0].length;
    if (match[2])
      updates.push(value => (pre + getValue(value)));
    else {
      const name = match[5];
      const quote = match[4];
      switch (true) {
        case name === 'aria':
          updates.push(value => (pre + keys(value).map(aria, value).join('')));
          break;
        case name === 'data':
          updates.push(value => typeof value === 'string' ? pre + attribute(name, quote, value) : (pre + keys(value).map(data, value).join('')));
          break;
        case name === 'style':
          updates.push(value => {
            let result = pre;
            if (typeof value === 'string')
              result += attribute(name, quote, value);
            if (value && value.toString)
              result += attribute(name, quote, value.toString());
            return result;
          });
          break;
        // setters as boolean attributes (.disabled .contentEditable)
        case name[0] === '.':
          const lower = name.slice(1).toLowerCase();
          updates.push(lower === 'dataset' ?
            (value => (pre + keys(value).map(data, value).join(''))) :
            (value => {
              let result = pre;
              // null, undefined, and false are not shown at all
              if (value != null && value !== false) {
                // true means boolean attribute, just show the name
                if (value === true)
                  result += ` ${lower}`;
                // in all other cases, just escape it in quotes
                else
                  result += attribute(lower, quote, value);
              }
              return result;
            })
          );
          break;
        case name.slice(0, 2) === 'on':
          updates.push(value => {
            let result = pre;
            // allow handleEvent based objects that
            // follow the `onMethod` convention
            // allow listeners only if passed as string,
            // as functions with a special toString method,
            // as objects with handleEvents and a method,
            // or as instance of JS
            switch (typeof value) {
              case 'object':
                if (value.is_uline) {
                  result += attribute(name, quote, value.toString());
                  break;
                }
                if (!(name in value))
                  break;
                value = value[name];
                if (typeof value !== 'function')
                  break;
              case 'function':
                if (value.toString === toString)
                  break;
              case 'string':
                result += attribute(name, quote, value);
                break;
            }
            return result;
          });
          break;
        default:
          updates.push(value => {
            let result = pre;
            if (value != null)
              result += attribute(name, quote, value);
            return result;
          });
          break;
      }
    }
  }
  const {length} = updates;
  if (length !== expectedLength)
    throw new Error(`invalid template ${template}`);
  if (length) {
    const last = updates[length - 1];
    const chunk = html.slice(i);
    updates[length - 1] = value => (last(value) + chunk);
  }
  else
    updates.push(() => html);
  return updates;
};

// declarations
function aria(key) {
  const value = escape(this[key]);
  return key === 'role' ?
          ` role="${value}"` :
          ` aria-${key.toLowerCase()}="${value}"`;
}

function data(key) {
  return ` data-${uhyphen(key)}="${escape(this[key])}"`;
}

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
}
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

const raw = (template, ...values) => new ULine(
  stringify(template, values)
);

const css = raw;

const html = uhtmlParity((template, ...values) => new ULine(
  content(template, values, false)
));

const svg = uhtmlParity((template, ...values) => new ULine(
  content(template, values, true)
));

function chunks(value, i) {
  return value + this[i + 1];
}

function update(value, i) {
  return this[i](value);
}

export { css, html, raw, svg };
