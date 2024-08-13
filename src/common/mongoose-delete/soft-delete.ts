/* eslint-disable prefer-spread */
/* eslint-disable prefer-rest-params */
import mongoose from 'mongoose';

import { contains, notContains } from '../../util/array.util';

const Schema = mongoose.Schema;
const Model = mongoose.Model;

function parseUpdateArguments(conditions, doc, options, callback) {
  if ('function' === typeof options) {
    callback = options;
    options = null;
  } else if ('function' === typeof doc) {
    callback = doc;
    doc = conditions;
    conditions = {};
    options = null;
  } else if ('function' === typeof conditions) {
    callback = conditions;
    conditions = undefined;
    doc = undefined;
    options = undefined;
  } else if (typeof conditions === 'object' && !doc && !options && !callback) {
    doc = conditions;
    conditions = undefined;
    options = undefined;
    callback = undefined;
  }

  const args = [];

  if (conditions) args.push(conditions);
  if (doc) args.push(doc);
  if (options) args.push(options);
  if (callback) args.push(callback);

  return args;
}

function parseIndexFields(options) {
  const indexFields = {
    deleted: false,
    deletedAt: false,
    deletedBy: false,
  };

  if (!options.indexFields) {
    return indexFields;
  }

  if (
    (typeof options.indexFields === 'string' ||
      options.indexFields instanceof String) &&
    options.indexFields === 'all'
  ) {
    indexFields.deleted = indexFields.deletedAt = indexFields.deletedBy = true;
  }

  if (
    typeof options.indexFields === 'boolean' &&
    options.indexFields === true
  ) {
    indexFields.deleted = indexFields.deletedAt = indexFields.deletedBy = true;
  }

  if (Array.isArray(options.indexFields)) {
    indexFields.deleted = options.indexFields.indexOf('deleted') > -1;
    indexFields.deletedAt = options.indexFields.indexOf('deletedAt') > -1;
    indexFields.deletedBy = options.indexFields.indexOf('deletedBy') > -1;
  }
  return indexFields;
}

function createSchemaObject(typeKey, typeValue, options) {
  options[typeKey] = typeValue;
  return options;
}

/**
 *
 * @param schema
 * @param options
 *        {
 *          position: the place to add the soft delete match operation,
 *        }
 * @constructor
 */
export function SoftDelete(schema, options) {
  options = options || {};
  const indexFields = parseIndexFields(options);

  const typeKey = schema.options.typeKey;
  const mongooseMajorVersion = +mongoose.version[0]; // 4, 5...
  const mainUpdateMethod = mongooseMajorVersion < 5 ? 'update' : 'updateMany';
  const mainUpdateWithDeletedMethod = mainUpdateMethod + 'WithDeleted';

  function updateDocumentsByQuery(schema, conditions, updateQuery, callback) {
    if (schema[mainUpdateWithDeletedMethod]) {
      return schema[mainUpdateWithDeletedMethod](
        conditions,
        updateQuery,
        { multi: true },
        callback,
      );
    } else {
      return schema[mainUpdateMethod](
        conditions,
        updateQuery,
        { multi: true },
        callback,
      );
    }
  }

  schema.add({
    deleted: createSchemaObject(typeKey, Boolean, {
      default: false,
      index: indexFields.deleted,
    }),
  });

  if (options.deletedAt === true) {
    schema.add({
      deletedAt: createSchemaObject(typeKey, Date, {
        index: indexFields.deletedAt,
      }),
    });
  }

  if (options.deletedBy === true) {
    schema.add({
      deletedBy: createSchemaObject(
        typeKey,
        options.deletedByType || Schema.Types.ObjectId,
        { index: indexFields.deletedBy },
      ),
    });
  }

  let use$neOperator = true;
  if (
    options.use$neOperator !== undefined &&
    typeof options.use$neOperator === 'boolean'
  ) {
    use$neOperator = options.use$neOperator;
  }

  schema.pre('save', function (next) {
    if (!this.deleted) {
      this.deleted = false;
    }
    next();
  });

  if (options.overrideMethods) {
    const overrideItems = options.overrideMethods;
    const overridableMethods = [
      'count',
      'countDocuments',
      'find',
      'findOne',
      'findOneAndUpdate',
      'update',
      'updateOne',
      'updateMany',
      'aggregate',
    ];
    let finalList = [];

    if (
      (typeof overrideItems === 'string' || overrideItems instanceof String) &&
      overrideItems === 'all'
    ) {
      finalList = overridableMethods;
    }

    if (typeof overrideItems === 'boolean' && overrideItems === true) {
      finalList = overridableMethods;
    }

    if (Array.isArray(overrideItems)) {
      overrideItems.forEach(function (method) {
        if (overridableMethods.indexOf(method) > -1) {
          finalList.push(method);
        }
      });
    }

    if (finalList.indexOf('aggregate') > -1) {
      schema.pre('aggregate', function () {
        let matchOperation = 0;
        let queryDeletedItems = false;
        const queryDeletedCriteriaList = [
          '{"$match":{"deleted":{"$ne":false}}}',
          '{"$match":{"deleted":true}}',
        ];
        const queryUnDeletedCriteriaList = [
          '{"$match":{"deleted":{"$ne":true}}}',
          '{"$match":{"deleted":false}}',
        ];
        for (const operation of this.pipeline()) {
          if (operation.$match) {
            if (contains(queryDeletedCriteriaList, JSON.stringify(operation))) {
              queryDeletedItems = true;
              break;
            }
            matchOperation++;
            if (
              options?.position !== 'last' &&
              options?.position !== 'lastMatch'
            ) {
              break;
            }
          } else if (matchOperation !== 0) {
            break;
          }
        }
        if (!queryDeletedItems) {
          const preMatchPosition =
            matchOperation === 0 ? 0 : matchOperation - 1;
          const preMatchStr = JSON.stringify(this.pipeline()[preMatchPosition]);
          if (preMatchStr === '{"$match":{"showAllDocuments":"true"}}') {
            this.pipeline().shift();
          } else if (notContains(queryUnDeletedCriteriaList, matchOperation)) {
            this.pipeline().splice(matchOperation, 0, {
              $match: { deleted: { $ne: true } },
            });
          }
        }
      });
    }

    finalList.forEach((method) => {
      if (['count', 'countDocuments', 'find', 'findOne'].indexOf(method) > -1) {
        let modelMethodName = method;

        // countDocuments do not exist in Mongoose v4
        /* istanbul ignore next */
        if (
          mongooseMajorVersion < 5 &&
          method === 'countDocuments' &&
          typeof Model.countDocuments !== 'function'
        ) {
          modelMethodName = 'count';
        }

        schema.statics[method] = function () {
          const query = Model[modelMethodName].apply(this, arguments);
          if (!arguments[2] || arguments[2].withDeleted !== true) {
            if (use$neOperator) {
              query.where('deleted').ne(true);
            } else {
              query.where({ deleted: false });
            }
          }
          return query;
        };
        schema.statics[method + 'Deleted'] = function () {
          if (use$neOperator) {
            return Model[modelMethodName]
              .apply(this, arguments)
              .where('deleted')
              .ne(false);
          } else {
            return Model[modelMethodName]
              .apply(this, arguments)
              .where({ deleted: true });
          }
        };
        schema.statics[method + 'WithDeleted'] = function () {
          return Model[modelMethodName].apply(this, arguments);
        };
      } else {
        if (method === 'aggregate') {
          schema.statics[method + 'Deleted'] = function () {
            const args = [];
            Array.prototype.push.apply(args, arguments);
            const match = { $match: { deleted: { $ne: false } } };
            arguments.length ? args[0].unshift(match) : args.push([match]);
            return Model[method].apply(this, args);
          };
          schema.statics[method + 'WithDeleted'] = function () {
            const args = [];
            Array.prototype.push.apply(args, arguments);
            const match = { $match: { showAllDocuments: 'true' } };
            arguments.length ? args[0].unshift(match) : args.push([match]);
            return Model[method].apply(this, args);
          };
        } else {
          schema.statics[method] = function () {
            const args = parseUpdateArguments.apply(undefined, arguments);

            if (use$neOperator) {
              args[0].deleted = { $ne: true };
            } else {
              args[0].deleted = false;
            }

            return Model[method].apply(this, args);
          };

          schema.statics[method + 'Deleted'] = function () {
            const args = parseUpdateArguments.apply(undefined, arguments);

            if (use$neOperator) {
              args[0].deleted = { $ne: false };
            } else {
              args[0].deleted = true;
            }

            return Model[method].apply(this, args);
          };

          schema.statics[method + 'WithDeleted'] = function () {
            return Model[method].apply(this, arguments);
          };
        }
      }
    });
  }

  schema.methods.delete = function (deletedBy, cb) {
    if (typeof deletedBy === 'function') {
      cb = deletedBy;
      deletedBy = null;
    }

    this.deleted = true;

    if (schema.path('deletedAt')) {
      this.deletedAt = new Date();
    }

    if (schema.path('deletedBy')) {
      this.deletedBy = deletedBy;
    }

    if (options.validateBeforeDelete === false) {
      return this.save({ validateBeforeSave: false }, cb);
    }

    return this.save(cb);
  };

  schema.statics.delete = function (conditions, deletedBy, callback) {
    if (typeof deletedBy === 'function') {
      callback = deletedBy;
      // conditions = conditions;
      deletedBy = null;
    } else if (typeof conditions === 'function') {
      callback = conditions;
      conditions = {};
      deletedBy = null;
    }

    const doc = {
      deleted: true,
    };

    if (schema.path('deletedAt')) {
      doc['deletedAt'] = new Date();
    }

    if (schema.path('deletedBy')) {
      doc['deletedBy'] = deletedBy;
    }

    return updateDocumentsByQuery(this, conditions, doc, callback);
  };

  schema.statics.deleteById = function (id, deletedBy, callback) {
    if (arguments.length === 0 || typeof id === 'function') {
      const msg = 'First argument is mandatory and must not be a function.';
      throw new TypeError(msg);
    }

    const conditions = {
      _id: id,
    };

    return this.delete(conditions, deletedBy, callback);
  };

  schema.methods.restore = function (callback) {
    this.deleted = false;
    this.deletedAt = undefined;
    this.deletedBy = undefined;
    return this.save(callback);
  };

  schema.statics.restore = function (conditions, callback) {
    if (typeof conditions === 'function') {
      callback = conditions;
      conditions = {};
    }

    const doc = {
      deleted: false,
      deletedAt: undefined,
      deletedBy: undefined,
    };

    return updateDocumentsByQuery(this, conditions, doc, callback);
  };
}
