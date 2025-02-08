import { labeledLogger } from '@src/modules/logger';

const logger = labeledLogger('utils:finance');

/**
 * Multiplies the costBase value by 100 if it exists in the object.
 *
 * @param {Record<string, any>} obj The object to process.
 * @param {boolean} reverse Whether to divide the costBase value by 100 instead.
 * @return {Record<string, any>} The revised object with costBase adjusted if present.
 */
export function adjustCostBase(
  obj: any & { costBase?: number },
  reverse = false,
): Record<string, any> {
  // Create a shallow copy of the object to avoid mutating the original
  const revisedObj = { ...obj };

  // Check if the object has a costBase property
  if (typeof revisedObj.costBase === 'number') {
    // Adjust the costBase value by 100
    if (reverse) {
      revisedObj.costBase /= 100;
    } else {
      revisedObj.costBase *= 100;
    }

    logger.info(
      `Adjusted costBase from ${obj.costBase} to ${revisedObj.costBase}.`,
    );
  }

  // Return the revised object
  return revisedObj;
}
