export const ERROR_MESSAGES = {
   RESOURCE_NOT_FOUND: (resource: string, slug: string) => `Could not find ${resource} with slug "${slug}".`,
   ATTRIBUTE_BAD_REQUEST: (slug: string, values: string[]) => `Attribute "${slug}" can only have following values: ${values.join(', ')}.`
}