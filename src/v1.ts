/* eslint-disable prefer-destructuring */
import { default as stringTemplate } from 'string-template';

export interface V1Orid {
  /**
   * The provider for this ORID.
   */
  provider: string,

  /**
   * Optional provider specific field 1.
   */
  custom1?: string,

  /**
   * Optional provider specific field 2.
   */
  custom2?: string,

  /**
   * Optional provider specific field 3.
   */
  custom3?: string,

  /**
   * The service that the resource belongs to.
   */
  service: string,

  /**
   * The resource identified by this ORID.
   */
  resourceId: string,

  /**
   * Optional resource type associated with resource.
   */
  resourceRider?: string,

  /**
   * True to use a slash (/) to separate the resourceId and resourceRider; False or omitted to use colon (:).
   */
  useSlashSeparator?: boolean,
}

/**
 * Generate a properly formatted V1 ORID.
 *
 * @param data The metadata object for all ORID parts.
 */
export function generate(data: V1Orid): string {
  const mainFormat = 'orid:1:{provider}:{custom1}:{custom2}:{custom3}:{service}:{suffix}';
  const suffixFormat = '{resourceId}{separator}{resourceRider}';

  let suffix;
  if (data.resourceRider) {
    const separator = data.useSlashSeparator ? '/' : ':';
    suffix = stringTemplate(suffixFormat, {
      resourceId: data.resourceId,
      separator,
      resourceRider: data.resourceRider,
    });
  } else {
    suffix = stringTemplate(suffixFormat, {
      resourceId: data.resourceId,
    });
  }

  return stringTemplate(mainFormat, {
    provider: data.provider,
    custom1: data.custom1,
    custom2: data.custom2,
    custom3: data.custom3,
    service: data.service,
    suffix,
  });
};

/**
 * 
 * @param value The item to validate if it is a V1 ORID or not.
 * @returns True if a valid orid string was supplied, false otherwise.
 */
export function isValid(value: string): boolean {
  // Leave the runtime type check in for those not using typescript.
  const quickCheck = typeof value === 'string' && value.startsWith('orid:1:');
  if (!quickCheck) return false;

  const parts = value.split(':');
  return parts.length === 8 || parts.length === 9;
};

/**
 * Parses a properly formatted ORID into an object for easier consumption.
 * @param orid The ORID to parse.
 * @returns A ORID object.
 */
export function parse (orid: string): V1Orid {
  // Leave the runtime type check in for those not using typescript.
  if (typeof orid !== 'string') throw TypeError('orid must be of type string');

  if (!orid.startsWith('orid:1:')) throw new Error('Provided string does not appear to be a orid');

  const oridParts = orid.split(':');
  if (oridParts.length !== 8 && oridParts.length !== 9) throw new Error('ORID appears to be invalid format');

  if (oridParts.length === 9) {
    return {
      provider: oridParts[2],
      custom1: oridParts[3],
      custom2: oridParts[4],
      custom3: oridParts[5],
      service: oridParts[6],
      resourceId: oridParts[7],
      resourceRider: oridParts[8],
    };
  }

  let resourceRider;
  let resourceId;

  if (oridParts[7].indexOf('/') > -1) {
    const resourceParts = oridParts[7].split('/');
    resourceId = resourceParts[0];
    resourceRider = resourceParts.slice(1).join('/');
  } else {
    resourceId = oridParts[7];
    resourceRider = undefined;
  }

  return {
    provider: oridParts[2],
    custom1: oridParts[3],
    custom2: oridParts[4],
    custom3: oridParts[5],
    service: oridParts[6],
    resourceId,
    resourceRider,
  };
};
