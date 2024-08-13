import { TransformFnParams } from 'class-transformer/types/interfaces';
import { isValidObjectId, Types } from 'mongoose';

export const toObjectId = (params: TransformFnParams, name: string): any => {
  if (!params.obj[name]) return undefined;
  return isValidObjectId(params.obj[name])
    ? new Types.ObjectId(params.obj[name])
    : params.obj[name];
};

export const toObjectIdArray = (
  params: TransformFnParams,
  name: string,
): any => {
  if (!params.obj[name] || !(params.obj[name] instanceof Array)) return null;
  return params.obj[name].map((item) => {
    return isValidObjectId(item) ? new Types.ObjectId(item) : null;
  });
};
