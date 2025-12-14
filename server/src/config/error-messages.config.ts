export const ERROR_MESSAGES = {
   //database messages
   DB_ERROR_GENERAL: () => 'Database query failed.',
   
   DB_UNIQUE_CONSTRAINT_VIOLATION: (field: string = '') => `Field ${field} should be unique!`,
   DB_FOREIGN_KEY_VIOLATION: (entity: string = 'something') => `Cannot delete the resource because it\'s still being referenced by ${entity}.`,

   // general resource messages
   RESOURCE_NOT_FOUND: (resource: string, value: string, valueIdentity: string = 'slug') => `Could not find ${resource} with ${valueIdentity} "${value}".`,
   NO_DATA_PROVIDED: () => `No data provided`,

   // product attributes validation messages
   ATTRIBUTE_BAD_REQUEST: (slug: string, values: string[]) => `Attribute "${slug}" can only have following values: ${values.join(', ')}.`,
   ATTRIBUTE_NOT_FOUND: (key: string) => `Attribute with key ${key} was not found in the attributes of a given product type.`,
   ATTRIBUTE_WRONG_TYPE: (key: string, type: string) => `Value of attribute ${key} should be type of ${type}`,

   // filter validation messages
   FILTER_WRONG_TYPE: (key: string, type: string) => `Wrong value type provided to the filter of ${key}. Expected ${type}`,
   FILTER_WRONG_SIGNATURE: (key: string) => `Wrong signature of a filter of ${key}`,
   
   // authentication messages
   AUTH_PASSWORDS_DONT_MATCH: () => `Coniform password and password do not match`,
   AUTH_INVALID_CREDENTIALS: () => `Invalid credentials`,
   AUTH_NO_USER: () => `No user provided in request`,
   AUTH_FORBIDDEN: () => `Forbidden`,
   UNEXPECTED: (action: string) => {console.error(`Unexpected error occured while ${action}.`); return `Unexpected internal server error`}
}