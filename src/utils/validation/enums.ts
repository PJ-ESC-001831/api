/**
 * Enum representing the objects to validate in a request.
 *
 * @enum {string}
 */
export enum ObjectsToValidate {
  /**
   * Represents the body of the request.
   */
  BODY = 'body',

  /**
   * Represents the URL parameters of the request.
   */
  PARAMS = 'params',

  /**
   * Represents the query parameters of the request.
   */
  QUERY = 'query',
}
