import { Validator } from "formstate";
import { TypeValidation, TypeConversion } from "../dependency/web3";

type StringOrNull = string | null | undefined;

export const requiredText: Validator<StringOrNull> = value => {
  const error = "This is required.";

  if (value == null || value.trim().length === 0) {
    return error;
  }

  return null;
};

export const validAddress: Validator<string> = value => {
  const error = "Please enter a valid address.";
  value = value.trim();

  if (!TypeValidation.isAddress(value)) {
    return error;
  }

  return null;
};

export const validTokenSymbol: Validator<string> = value => {
  const error = "Must be all caps and 4 characters or less";
  value = value.trim();

  if (value.length > 4 || !/^[A-Z]+$/.test(value)) {
    return error;
  }

  return null;
};

export const validBigNumber: Validator<string> = value => {
  const error = "Please enter a valid whole number.";
  value = value.trim();

  try {
    TypeConversion.toBN(value);
  } catch (e) {
    return error;
  }

  return null;
};

export const validNumber: Validator<string> = value => {
  value = value.trim();

  const number = Number(value);

  if (isNaN(number)) {
    return "Please enter a valid number.";
  }

  // Serializes to exponential value
  if (number.toString().indexOf('e') > -1) {
    return "Please remove decimal places.";
  }

  return null;
};

export const validName: Validator<string> = value => {
  const error = "Names must be less than 70 characters.";
  value = value.trim();

  if (value.length > 70) {
    return error;
  }

  return null;
};

export const validPercentage: Validator<number> = value => {
  const error = "Percentages must be between 0 and 100.";

  if (value > 100 || value < 0) {
    return error;
  }

  return null;
};

export const validDuration: Validator<string> = value => {
  const error = "Duration format is incorrect. Please use DD:hh:mm:ss";
  value = value.trim();
  const parts = value.split(":");

  if (parts.length !== 4) {
    return error;
  }

  return null;
};

export const positiveDuration: Validator<string> = value => {
  let error = null;
  value = value.trim();
  const parts = value.split(":");

  parts.forEach((part, index) => {
    if (Number(part) < 0) {
      switch (index) {
        case 0:
          error = "Days cannot be negative.";
          return;
        case 1:
          error = "Hours cannot be negative.";
          return;
        case 2:
          error = "Minutes cannot be negative.";
          return;
        case 3:
          error = "Seconds cannot be negative.";
          return;
        default:
          throw Error("This should never happen.");
      }
    }
  });

  return error;
};

export const futureDate: Validator<Date | undefined> = value => {
  let error = "Date must be in the future.";
  const currentTime = new Date().getTime();

  if (value && value.getTime() < currentTime) {
    return error;
  }

  return null;
};

export const greaterThan = (bound: number) => (value: string | number) => {
  const error = `Number must be greater than ${bound}.`;

  if (typeof value === "number") {
    if (value > bound) {
      return null;
    }
  } else {
    value = value.trim();

    if (validNumber(value) === null && Number(value) > bound) {
      return null;
    }
  }

  return error;
};

export const greaterThanOrEqual = (bound: number) => (
  value: string | number
) => {
  const error = `Number must be greater than or equal to ${bound}.`;

  if (typeof value === "number") {
    if (value >= bound) {
      return null;
    }
  } else {
    value = value.trim();

    if (validNumber(value) === null && Number(value) >= bound) {
      return null;
    }
  }

  return error;
};

export const lessThanOrEqual = (bound: number) => (value: string | number) => {
  const error = `Number must be less than or equal to ${bound}.`;

  if (typeof value === "number") {
    if (value >= bound) {
      return null;
    }
  } else {
    value = value.trim();

    if (validNumber(value) === null && Number(value) <= bound) {
      return null;
    }
  }

  return error;
};

export const minMaxInclusive = (min: number, max: number) => (value: string | number) => {
  const error = `Number must be between ${min} and ${max}.`;

  if (typeof value === "number") {
    if (value >= min && value <= max) {
      return null;
    }
  } else {
    value = value.trim();

    if (validNumber(value) === null) {
      const number = Number(value);

      if (number >= min && number <= max) {
        return null;
      }
    }
  }

  return error;
};

export const nonZeroAddress: Validator<string> = value => {
  const error = "Address must not be zero.";
  value = value.trim();

  if (value === "0x0000000000000000000000000000000000000000") {
    return error;
  }

  return null;
};

export const requireElement = (elementName: string) => (array: any[]) =>
  !array.length && `Please add a ${elementName}.`;

export const noDuplicates = (
  evaluate: (a: any, b: any) => boolean,
  toString: (value: any) => string
) => (array: any[]) => {
  for (let i = 0; i < array.length; ++i) {
    const a = array[i];

    for (let k = 0; k < array.length; ++k) {
      if (k === i) continue;
      const b = array[k];

      if (evaluate(a, b)) {
        return `Duplicate entry detected: ${toString(a)}`;
      }
    }
  }
};
