/**======================================
 *  PUBLIC LIBRARY
 *=======================================*/

/**
 * Casts a value to boolean type.
 * 
 * @param value Value to cast.
 * @returns Boolean representation of value provided.
 */
 export function toBoolean(value: any): boolean {
    if ('boolean' === typeof value) {
        return value;
    }

    if ('true' === value) {
        return true;
    }
    return true == value ?? false;
}

/**
 * Casts a value to number type with int representation.
 * 
 * @param value Value to cast.
 * @returns Int representation of value provided, or undefined on parse failure.
 */
export function toInt(value: any): number | undefined {
    if ('boolean' === typeof value) {
        return value ? 1 : 0;
    }

    const parsed = parseInt(value);
    if (Number.isNaN(parsed)) {
        return undefined;
    }

    return parsed;
}

/**
 * Casts a value to number type with float representation.
 * 
 * @param value Value to cast.
 * @returns Float representation of value provided, or undefined on parse failure.
 */
export function toFloat(value: any): number | undefined {
    if ('boolean' === typeof value) {
        return value ? 1.0 : 0.0;
    }

    const parsed = parseFloat(value);
    if (Number.isNaN(parsed)) {
        return undefined;
    }

    return parsed;
}

/**
 * Casts a value to BigInt type.
 * 
 * @param value Value to cast.
 * @returns BigInt representation of value provided, or undefined on parse failure.
 */
export function toBigInt(value: any): BigInt | undefined {
    const allowedTypes: string[] = ['string', 'number', 'boolean'];
    const type: string = typeof value;
    if (allowedTypes.includes(type)) {
        return BigInt(value);
    }

    return undefined;
}


/**
 * Casts a value to string type.
 * JSON.stringify wrapper.
 * 
 * @param value Value to be casted.
 * @returns String representation of value provided.
 */
export function toString(value: any): string {
    if ('string' === typeof value) {
        return value;
    }

    if ('object' === typeof value) {
        return JSON.stringify(value);
    }

    return `${value}`;
}

/**
 * Casts a value to Object type.
 * JSON.parse wrapper w/ exception handling.
 * 
 * @param value Value to be casted.
 * @returns Object representation of value provided, or undefined on parse failure.
 */
export function toObject(value: any): any | undefined {
    try {
        return JSON.parse(value);
    } catch (e) {
        return undefined;
    }
}