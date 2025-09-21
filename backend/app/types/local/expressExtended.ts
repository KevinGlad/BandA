import { Request } from "express";

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export type TypedRequestWithParams<TBody, TParams> = Request<TParams, {}, TBody, {}>;
