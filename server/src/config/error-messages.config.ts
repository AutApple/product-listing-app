export const ERROR_MESSAGES = {
   //database messages
   DB_ERROR_GENERAL: () => 'Database query failed.',
   
   DB_UNIQUE_CONSTRAINT_VIOLATION: () => `Conflict on trying to add a new resource.`,
   DB_FOREIGN_KEY_VIOLATION: () => `Cannot delete: related resources exist.`,
   DB_NOT_NULL_VIOLATION: () => `Missing required field.`,
   DB_STRING_DATA_TRUNCATION: () => `Value is too long.`,

   // general resource messages
   RESOURCE_NOT_FOUND: (resource: string, value: string, valueIdentity: string = 'slug') => `Could not find ${resource} with ${valueIdentity} "${value}".`,
   NO_DATA_PROVIDED: () => `No data provided`,
   RESOURCE_VALIDATION_FAIL: () => `Validation failed.`,
   // product attributes validation messages
   ATTRIBUTE_BAD_REQUEST: (slug: string, values: string[]) => `Attribute "${slug}" can only have following values: ${values.join(', ')}.`,
   ATTRIBUTE_NOT_FOUND: (key: string) => `Attribute with key ${key} was not found in the attributes of a given product type.`,
   ATTRIBUTE_WRONG_TYPE: (key: string, type: string) => `Value of attribute ${key} should be type of ${type}`,

   // filter validation messages
   FILTER_WRONG_TYPE: (key: string, type: string) => `Wrong value type provided to the filter of ${key}. Expected ${type}`,
   FILTER_WRONG_SIGNATURE: (key: string) => `Wrong signature of a filter of ${key}`,
   
   // authentication messages
   AUTH_PASSWORDS_DONT_MATCH: () => `Coniform password and password do not match.`,
   AUTH_INVALID_CREDENTIALS: () => `Invalid credentials.`,
   AUTH_FORBIDDEN: () => `Forbidden.`,
   AUTH_REQUIRED: () => `Authorization required.`,
   AUTH_REFRESH_TOKEN_REQUIRED: () => `Provide refresh token in the header`,
   UNEXPECTED: (action: string) => {console.error(`Unexpected error occured while ${action}.`); return `Unexpected internal server error.`}
}