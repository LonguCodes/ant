import { Type } from '@nestjs/common';
import { Constructor } from '@nestjs/cqrs';

type Keys<T extends object> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]-?: T[K] extends Function ? never : K;
}[keyof T];

type ValueOrSetter<T extends object, P extends string> = P extends keyof T
  ? ((currentValue: T[P] extends object ? Builder<T[P], object, object> : T[P]) => T[P]) | T[P]
  : never;

export type Builder<T extends object, TExtendedInitial = never, TExtendedPermanent = never> = T & {
  [P in Keys<T> & string as `with${Capitalize<P>}`]: (
    value: ValueOrSetter<T, P>,
  ) => Builder<T, TExtendedPermanent, TExtendedPermanent>;
} & TExtendedInitial;

function computeStartingValues<T extends object>(
  cls: Type<T> | null,
  defaults: (() => Partial<T>) | null,
  values: Partial<T> | null,
) {
  const startValue = cls ? (new cls() as T) : ({} as T);

  if (defaults) {
    for (const [key, value] of Object.entries(defaults()) as [key: keyof T, value: any][]) {
      startValue[key] = value;
    }
  }
  if (values) {
    for (const [key, value] of Object.entries(values) as [key: keyof T, value: any][]) {
      startValue[key] = value;
    }
  }
  return startValue;
}
function createProxy<T extends object, TExtended extends object>(startValue: T, extended?: TExtended) {
  return new Proxy<T>(startValue, {
    get(target: T, p: string): any {
      if (p in extended) {
        return extended[p as keyof TExtended];
      }
      if (typeof p !== 'string') {
        return target[p];
      }
      if (!p.startsWith('with')) {
        return target[p as keyof T];
      }

      const propertyName = p[4].toLowerCase() + p.substring(5);
      return function (value: ValueOrSetter<T, typeof propertyName>) {
        this[propertyName] =
          typeof value === 'function'
            ? value(new (makeBuilder<(typeof this)[typeof propertyName], TExtended>())(this[propertyName]))
            : value;
        return this;
      };
    },
  }) as Builder<T, TExtended, TExtended>;
}

export function makeBuilder<T extends object, TExtended extends object>(cls?: Type<T>, defaults?: () => Partial<T>) {
  const builder = class InternalBuilder {
    constructor(values?: Partial<T>) {
      const startValue = computeStartingValues(cls, defaults, values);
      return createProxy<T, TExtended>(startValue, Object.getPrototypeOf(this));
    }
    static create(values?: Partial<T>) {
      const startValue = computeStartingValues(cls, defaults, values);
      return new builder(startValue) as Builder<T, object, object>;
    }
    static createMany(count: number, values?: Partial<T>) {
      const startValue = computeStartingValues(cls, defaults, values);
      return [...new Array(count).keys()].map(() => new builder(startValue) as Builder<T, TExtended, TExtended>);
    }
  };
  return builder as unknown as Constructor<Builder<T, object, TExtended>> & typeof builder;
}
