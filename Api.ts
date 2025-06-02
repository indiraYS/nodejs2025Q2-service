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

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
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

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/api";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Home Library Service
 * @version 1.0.0
 * @baseUrl /api
 *
 * Home music library service
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  login = {
    /**
     * @description Logins a user and returns a JWT-token
     *
     * @tags Login
     * @name LoginCreate
     * @summary Login
     * @request POST:/login
     */
    loginCreate: (
      data: {
        /** Username */
        login: string;
        /** Password */
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          token?: string;
        },
        void
      >({
        path: `/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  signup = {
    /**
     * @description Signup a user
     *
     * @tags Signup
     * @name SignupCreate
     * @summary Signup
     * @request POST:/signup
     */
    signupCreate: (
      data: {
        /**
         * Username
         * @minLength 3
         * @maxLength 255
         */
        login: string;
        /**
         * Password
         * @format password
         * @pattern ^[a-zA-Z0-9]{3,30}
         */
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/signup`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  users = {
    /**
     * @description Gets all users
     *
     * @tags Users
     * @name UsersList
     * @summary Get all users
     * @request GET:/users
     * @secure
     */
    usersList: (params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/users`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new user
     *
     * @tags Users
     * @name UsersCreate
     * @summary Create user
     * @request POST:/users
     * @secure
     */
    usersCreate: (
      data: {
        /** The user's login */
        login: string;
        /** The user's password */
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<User, void>({
        path: `/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get single user by id
     *
     * @tags Users
     * @name UsersDetail
     * @summary Get single user by id
     * @request GET:/users/{userId}
     * @secure
     */
    usersDetail: (userId: string, params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/users/${userId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates a user's password by ID
     *
     * @tags Users
     * @name UsersUpdate
     * @summary Update a user's password
     * @request PUT:/users/{userId}
     * @secure
     */
    usersUpdate: (
      userId: string,
      data: {
        /** The user's old password */
        oldPassword: string;
        /** The user's new password */
        newPassword: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @format uuid */
          id?: string;
          /** @example "TestUser" */
          login?: string;
          /** @example 2 */
          version?: number;
          /** @example 1655000000 */
          createAt?: number;
          /** @example 1655999999 */
          updateAt?: number;
        },
        void
      >({
        path: `/users/${userId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes user by ID.
     *
     * @tags Users
     * @name UsersDelete
     * @summary Delete user
     * @request DELETE:/users/{userId}
     * @secure
     */
    usersDelete: (userId: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/users/${userId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  tracks = {
    /**
     * @description Gets all library tracks list
     *
     * @tags Track
     * @name TracksList
     * @summary Get tracks list
     * @request GET:/tracks
     * @secure
     */
    tracksList: (params: RequestParams = {}) =>
      this.request<Track[], any>({
        path: `/tracks`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Add new track information
     *
     * @tags Track
     * @name TracksCreate
     * @summary Add new track
     * @request POST:/tracks
     * @secure
     */
    tracksCreate: (
      data: {
        name: string;
        /** @format uuid */
        artistId?: string;
        /** @format uuid */
        albumId?: string;
        /** In seconds */
        duration: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Track, void>({
        path: `/tracks`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Gets single track by id
     *
     * @tags Track
     * @name TracksDetail
     * @summary Get single track by id
     * @request GET:/tracks/{id}
     * @secure
     */
    tracksDetail: (id: string, params: RequestParams = {}) =>
      this.request<Track, void>({
        path: `/tracks/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update library track information by UUID
     *
     * @tags Track
     * @name TracksUpdate
     * @summary Update track information
     * @request PUT:/tracks/{id}
     * @secure
     */
    tracksUpdate: (
      id: string,
      data: {
        /** @example "Bohemian Rhapsody" */
        name: string;
        /** @format uuid */
        artistId?: string | null;
        /**
         * In seconds
         * @example 355
         */
        duration: number;
        /** @format uuid */
        albumId?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @format uuid */
          id?: string;
          /** @example "Bohemian Rhapsody" */
          name?: string;
          /** @format uuid */
          artistId?: string | null;
          /**
           * In seconds
           * @example 355
           */
          duration?: number;
          /** @format uuid */
          albumId?: string | null;
        },
        void
      >({
        path: `/tracks/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete track from library
     *
     * @tags Track
     * @name TracksDelete
     * @summary Delete track
     * @request DELETE:/tracks/{id}
     * @secure
     */
    tracksDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/tracks/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  albums = {
    /**
     * @description Gets all library albums list
     *
     * @tags Album
     * @name AlbumsList
     * @summary Get albums list
     * @request GET:/albums
     * @secure
     */
    albumsList: (params: RequestParams = {}) =>
      this.request<Album[], any>({
        path: `/albums`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Add new album information
     *
     * @tags Album
     * @name AlbumsCreate
     * @summary Add new album
     * @request POST:/albums
     * @secure
     */
    albumsCreate: (
      data: {
        name: string;
        year: number;
        /** @format uuid */
        artistId?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<Album, void>({
        path: `/albums`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Gets single album by id
     *
     * @tags Album
     * @name AlbumsDetail
     * @summary Get single album by id
     * @request GET:/albums/{id}
     * @secure
     */
    albumsDetail: (id: string, params: RequestParams = {}) =>
      this.request<Album, void>({
        path: `/albums/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update library album information by UUID
     *
     * @tags Album
     * @name AlbumsUpdate
     * @summary Update album information
     * @request PUT:/albums/{id}
     * @secure
     */
    albumsUpdate: (
      id: string,
      data: {
        name: string;
        year: number;
        /** @format uuid */
        artistId?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<Album, void>({
        path: `/albums/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete album from library
     *
     * @tags Album
     * @name AlbumsDelete
     * @summary Delete album
     * @request DELETE:/albums/{id}
     * @secure
     */
    albumsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/albums/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  artists = {
    /**
     * @description Gets all artists
     *
     * @tags Artist
     * @name ArtistsList
     * @summary Get all artists
     * @request GET:/artists
     * @secure
     */
    artistsList: (params: RequestParams = {}) =>
      this.request<Artist[], any>({
        path: `/artists`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Add new artist
     *
     * @tags Artist
     * @name ArtistsCreate
     * @summary Add new artist
     * @request POST:/artists
     * @secure
     */
    artistsCreate: (
      data: {
        name: string;
        grammy: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Artist, void>({
        path: `/artists`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get single artist by id
     *
     * @tags Artist
     * @name ArtistsDetail
     * @summary Get single artist by id
     * @request GET:/artists/{id}
     * @secure
     */
    artistsDetail: (id: string, params: RequestParams = {}) =>
      this.request<Artist, void>({
        path: `/artists/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update artist information by UUID
     *
     * @tags Artist
     * @name ArtistsUpdate
     * @summary Update artist information
     * @request PUT:/artists/{id}
     * @secure
     */
    artistsUpdate: (
      id: string,
      data: {
        name: string;
        grammy: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Artist, void>({
        path: `/artists/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete artist from library
     *
     * @tags Artist
     * @name ArtistsDelete
     * @summary Delete artist
     * @request DELETE:/artists/{id}
     * @secure
     */
    artistsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/artists/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  favs = {
    /**
     * @description Gets all favorites movies, tracks and books
     *
     * @tags Favorites
     * @name FavsList
     * @summary Get all favorites
     * @request GET:/favs
     * @secure
     */
    favsList: (params: RequestParams = {}) =>
      this.request<Favorites, any>({
        path: `/favs`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Add track to the favorites
     *
     * @tags Favorites
     * @name TrackCreate
     * @summary Add track to the favorites
     * @request POST:/favs/track/{id}
     * @secure
     */
    trackCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/favs/track/${id}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Delete track from favorites
     *
     * @tags Favorites
     * @name TrackDelete
     * @summary Delete track from favorites
     * @request DELETE:/favs/track/{id}
     * @secure
     */
    trackDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/favs/track/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Add album to the favorites
     *
     * @tags Favorites
     * @name AlbumCreate
     * @summary Add album to the favorites
     * @request POST:/favs/album/{id}
     * @secure
     */
    albumCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/favs/album/${id}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Delete album from favorites
     *
     * @tags Favorites
     * @name AlbumDelete
     * @summary Delete album from favorites
     * @request DELETE:/favs/album/{id}
     * @secure
     */
    albumDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/favs/album/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Add artist to the favorites
     *
     * @tags Favorites
     * @name ArtistCreate
     * @summary Add artist to the favorites
     * @request POST:/favs/artist/{id}
     * @secure
     */
    artistCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/favs/artist/${id}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Delete artist from favorites
     *
     * @tags Favorites
     * @name ArtistDelete
     * @summary Delete artist from favorites
     * @request DELETE:/favs/artist/{id}
     * @secure
     */
    artistDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/favs/artist/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
