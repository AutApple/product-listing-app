import { FieldType } from '../../config/interfaces/query-parser-config.interface.js';
import { AttributeTypes }  from '../../attributes/types/attribute.types.enum.js';

const dict = {
    [AttributeTypes.NUMBER]: FieldType.NUMBER,
    [AttributeTypes.STRING]: FieldType.STRING,
    [AttributeTypes.BOOLEAN]: FieldType.BOOLEAN,
    [AttributeTypes.ENUM]: FieldType.STRING,

}

export function attributeTypeToFieldType(attrType: AttributeTypes): FieldType {
    return dict[attrType];
}
