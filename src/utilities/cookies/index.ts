import Cookies from "js-cookie";

const COOKIE_NAME = "uci";

/**
 * The function `SaveCookie` saves a token as a cookie with a one-year expiration date, using secure
 * settings.
 * @param {string} token - The `token` parameter in the `SaveCookie` function is a string that
 * represents the authentication token that will be saved in the cookie. This token is typically used
 * for authentication and authorization purposes when communicating with a server or accessing
 * protected resources.
 */
export const SaveCookie = (token: string): void => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 1); // 365 ngày hết hạn

  Cookies.set(
    COOKIE_NAME,
    JSON.stringify({token, expires: expires.toISOString()}),
    {
      expires: 0,
      secure: true,
      sameSite: "Strict",
    }
  );
};

/**
 * The type `SaveACookieProps` defines the properties required to save a cookie with a key, token, and
 * optional expiration time.
 * @property {string} key - The `key` property in the `SaveACookieProps` type represents the key or
 * name of the cookie that you want to save. It is a string type.
 * @property {string} token - The `token` property in the `SaveACookieProps` type represents the value
 * that will be stored in the cookie. It is a string type.
 * @property {number} expired - (default is 7 days) The `expired` property in the `SaveACookieProps` type represents the
 * expiration time of the cookie in milliseconds. It is an optional property, meaning it is not
 * required to be provided when creating an instance of `SaveACookieProps`. If provided, the cookie
 * will expire after the specified number
 */
type SaveACookieProps = {
  key: string;
  token: string;
  expired?: number;
};
export const SaveACookie = ({
  key,
  token,
  expired = 1,
}: SaveACookieProps): void => {
  const expires = new Date();
  expires.setDate(expires.getDate() + expired);

  Cookies.set(key, JSON.stringify({token, expires: expires.toISOString()}), {
    expires: expired,
    secure: true,
    sameSite: "Strict",
  });
};

/**
 * The function `GetCookie` retrieves a token from a cookie named `COOKIE_NAME` if it exists.
 * @returns The GetCookie function returns the token value extracted from the cookie named COOKIE_NAME.
 * If the cookie or token is not found, it returns undefined.
 */
export const GetCookie = (): string | undefined => {
  const cookieValue = Cookies.get(COOKIE_NAME);
  if (!cookieValue) return undefined;

  try {
    const {token} = JSON.parse(decodeURIComponent(cookieValue));
    return token;
  } catch {
    return undefined;
  }
};

/**
 * The function `GetACookie` retrieves a token from a cookie using the provided key in TypeScript.
 * @param {string} key - The `key` parameter in the `GetACookie` function is a string that represents
 * the name of the cookie whose value we want to retrieve.
 * @returns The GetACookie function returns the token value extracted from the cookie with the
 * specified key. If the cookie value is not found or cannot be parsed as JSON, it returns undefined.
 */
export const GetACookie = (key: string): string | undefined => {
  const cookieValue = Cookies.get(key);
  if (!cookieValue) return undefined;

  try {
    const {token} = JSON.parse(cookieValue);
    return token;
  } catch {
    return undefined;
  }
};

/**
 * The function `RemoveCookie` removes a cookie with the specified name.
 */
export const RemoveCookie = (): void => {
  Cookies.remove(COOKIE_NAME);
};

/**
 * The function `RemoveACookie` removes a cookie with the specified key.
 * @param {string} key - The `key` parameter in the `RemoveACookie` function is a string that
 * represents the name of the cookie that you want to remove.
 */
export const RemoveACookie = (key: string): void => {
  Cookies.remove(key);
};

/**
 * The UpdateCookie function updates the cookie with a new token by calling the SaveCookie function.
 * @param {string} newToken - A string representing the new token that will be used to update the
 * cookie.
 */
export const UpdateCookie = (newToken: string): void => {
  SaveCookie(newToken);
};

/**
 * The type `UpdateACookieProps` defines the properties for updating a cookie with a new token and
 * optional expiration time.
 * @property {string} key - The `key` property in the `UpdateACookieProps` type represents the key of
 * the cookie that you want to update.
 * @property {string} newToken - The `newToken` property in the `UpdateACookieProps` type represents
 * the new value that will be assigned to the specified key in the cookie.
 * @property {number} expired - (default is 7 days) The `expired` property in the `UpdateACookieProps` type represents the
 * expiration time of the cookie in milliseconds. It is an optional property, meaning it does not have
 * to be provided when updating a cookie. If provided, it specifies the duration after which the cookie
 * will expire.
 */
type UpdateACookieProps = {
  key: string;
  newToken: string;
  expired?: number;
};
export const UpdateACookie = ({
  key,
  newToken,
  expired = 7,
}: UpdateACookieProps): void => {
  key &&
    newToken &&
    expired &&
    SaveACookie({key: key, token: newToken, expired: expired});
};

/**
 * The function `isCookieExpired` checks if a cookie has expired based on its expiration date.
 * @returns The function `isCookieExpired` returns a boolean value indicating whether the cookie with
 * the name specified in `COOKIE_NAME` is expired or not.
 */
export const isCookieExpired = (): boolean => {
  const cookieValue = Cookies.get(COOKIE_NAME);
  if (!cookieValue) return true;

  try {
    const {expires} = JSON.parse(cookieValue);
    return new Date() > new Date(expires);
  } catch (error) {
    return true;
  }
};
/**
 * The function `isACookieExpired` checks if a cookie with the specified key is expired based on its
 * expiration date.
 * @param {string} key - The `key` parameter in the `isACookieExpired` function is a string that
 * represents the name of the cookie whose expiration status you want to check.
 * @returns A boolean value is being returned.
 */
export const isACookieExpired = (key: string): boolean => {
  const cookieValue = Cookies.get(key);
  if (!cookieValue) return true;

  try {
    const {expires} = JSON.parse(cookieValue);
    return new Date() > new Date(expires);
  } catch (error) {
    return true;
  }
};

// ----------------------------------------------------------------------------------------------------

/**
 * Hàm `SaveCookieNoExpired` lưu trữ một token vào cookie với tên cố định `uci`.
 * @param {string} token - Token cần lưu trữ vào cookie.
 */
export const SaveCookieNoExpired = (token: string): void => {
  Cookies.set(COOKIE_NAME, JSON.stringify({token}), {
    secure: true,
    sameSite: "Strict",
  });
};

/**
 * Hàm `SaveACookieNoExpired` lưu trữ token vào một cookie với tên tuỳ chỉnh.
 * @param {string} key - Tên cookie.
 * @param {string} token - Token cần lưu trữ vào cookie.
 */
type SaveACookieNoExpiredProps = {
  key: string;
  token: string;
};
export const SaveACookieNoExpired = ({
  key,
  token,
}: SaveACookieNoExpiredProps): void => {
  Cookies.set(key, JSON.stringify({token}), {
    secure: true,
    sameSite: "Strict",
  });
};

/**
 * Hàm `UpdateCookieNoExpired` cập nhật cookie mặc định `uci` với một token mới.
 * @param {string} newToken - Token mới để cập nhật vào cookie.
 */
export const UpdateCookieNoExpired = (newToken: string): void => {
  SaveCookieNoExpired(newToken);
};

/**
 * Hàm `UpdateACookieNoExpired` cập nhật cookie có tên tùy chỉnh với token mới.
 * @param {string} key - Tên cookie cần cập nhật.
 * @param {string} newToken - Token mới để cập nhật vào cookie.
 */
type UpdateACookieNoExpiredProps = {
  key: string;
  newToken: string;
};
export const UpdateACookieNoExpired = ({
  key,
  newToken,
}: UpdateACookieNoExpiredProps): void => {
  key && newToken && SaveACookieNoExpired({key, token: newToken});
};

/**
 * Hàm `RemoveCookieNoExpired` xoá cookie mặc định `uci`.
 */
export const RemoveCookieNoExpired = (): void => {
  Cookies.remove(COOKIE_NAME);
};

/**
 * Hàm `RemoveACookieNoExpired` xoá cookie với tên tuỳ chỉnh.
 * @param {string} key - Tên của cookie cần xoá.
 */
export const RemoveACookieNoExpired = (key: string): void => {
  Cookies.remove(key);
};
