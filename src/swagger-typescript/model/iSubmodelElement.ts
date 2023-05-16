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
import { IConstraint } from './iConstraint';
import { IEmbeddedDataSpecification } from './iEmbeddedDataSpecification';
import { LangString } from './langString';
import { ModelType } from './modelType';
import { ModelingKind } from './modelingKind';
import { Reference } from './reference';

export interface ISubmodelElement { 
    readonly idShort?: string;
    semanticId?: Reference;
    readonly constraints?: Array<IConstraint>;
    readonly description?: Array<LangString>;
    readonly category?: string;
    kind?: ModelingKind;
    modelType?: ModelType;
    readonly embeddedDataSpecifications?: Array<IEmbeddedDataSpecification>;
    value?: string;
    valueType?: string;
}