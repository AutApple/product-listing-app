import { FilterType } from '../../query-parser/types/query-parser-config.type.js';
import AttributeTypes from '../../attributes/types/attribute.types.enum.js';

const dict = {
    [AttributeTypes.NUMBER]: FilterType.NUMBER,
    [AttributeTypes.STRING]: FilterType.STRING,
    [AttributeTypes.BOOLEAN]: FilterType.BOOLEAN,
    [AttributeTypes.ENUM]: FilterType.STRING,

}

export function attributeTypeToFilterType(attrType): FilterType {
    return dict[attrType];
}
