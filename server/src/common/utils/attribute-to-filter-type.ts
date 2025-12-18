import { FieldType } from '../../query-parser/types/query-parser-config.type.js';
import AttributeTypes from '../../attributes/types/attribute.types.enum.js';

const dict = {
    [AttributeTypes.NUMBER]: FieldType.NUMBER,
    [AttributeTypes.STRING]: FieldType.STRING,
    [AttributeTypes.BOOLEAN]: FieldType.BOOLEAN,
    [AttributeTypes.ENUM]: FieldType.STRING,

}

export function attributeTypeToFieldType(attrType: AttributeTypes): FieldType {
    return dict[attrType];
}
