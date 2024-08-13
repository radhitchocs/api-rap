import { Transform } from 'class-transformer';
import * as _ from 'lodash';

export function ToQueryMongodb(): (target: any, key: string) => void {
  return Transform(({ value }) => {
    if (typeof value === 'string' && !_.isEmpty(value)) {
      const allowedOperators = [
        'eq',
        'ne',
        'gt',
        'gte',
        'lt',
        'lte',
        'like',
        'nlike',
        'in',
        'nin',
        'between',
        'nbetween',
        'null',
        'nnull',
        'empty',
        'nempty',
      ];
      const terms = value.split(',');
      const query = {};

      terms.forEach((term) => {
        const operators = term.split('|');
        if (operators.length === 2) {
          //
        } else if (operators.length === 3) {
          const [key, operator, value] = operators;
          if (allowedOperators.includes(operator)) {
            if (operator === 'in' || operator === 'nin') {
              query[key] = {
                [`$${operator}`]: value.split(':'),
              };
            } else if (operator === 'like') {
              query[key] = {
                $regex: value,
                $options: 'i',
              };
            } else if (
              operator === 'gt' ||
              operator === 'gte' ||
              operator === 'lt' ||
              operator === 'lte'
            ) {
              query[key] = {
                [`$${operator}`]: value,
              };
            } else if (operator === 'empty' || operator === 'nempty') {
              query[key] = {
                $exists: operator === 'empty' ? false : true,
              };
            } else {
              query[key] = {
                [`$${operator}`]: value,
              };
            }
          }
        }
      });
      return query;
    }

    return value;
  });
}
