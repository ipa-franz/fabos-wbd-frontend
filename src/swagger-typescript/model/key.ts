/**
 * BaSyx Asset Administration Shell HTTP REST-API
 * The full description of the generic BaSyx Asset Administration Shell HTTP REST-API
 *
 * OpenAPI spec version: v1
 * Contact: constantin.ziesche@bosch.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { KeyElements } from './keyElements';
import { KeyType } from './keyType';

export interface Key { 
    type: KeyElements;
    idType: KeyType;
    value: string;
    local: boolean;
}