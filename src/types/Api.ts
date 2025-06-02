/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface User {
  /** @format uuid */
  id: string;
  /** @example "TestUser" */
  login: string;
  /** @example 1 */
  version?: number;
  /** @example 1655000000 */
  createAt?: number;
  /** @example 1655000000 */
  updateAt?: number;
}

export interface Artist {
  /** @format uuid */
  id: string;
  /** @example "Freddie Mercury" */
  name: string;
  /** @example false */
  grammy?: boolean;
}

export interface Album {
  /** @format uuid */
  id: string;
  /** @example "Innuendo" */
  name: string;
  /** @example 1991 */
  year?: number;
  /** @format uuid */
  artistId?: string | null;
}

export interface Track {
  /** @format uuid */
  id: string;
  /** @example "The Show Must Go On" */
  name: string;
  /** @format uuid */
  artistId?: string | null;
  /** @format uuid */
  albumId?: string | null;
  /**
   * In seconds
   * @example 262
   */
  duration: number;
}

export interface Favorites {
  artists?: Artist[];
  albums?: Album[];
  tracks?: Track[];
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;



export interface HttpResponse<D extends unknown, E extends HttpException> {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export interface Dummy {}

export class AuthSuccessResponse {
  public constructor(public token: string){}
}