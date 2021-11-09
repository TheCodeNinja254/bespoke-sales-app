const validatePhoneNumber = (format = 'all', full = false, text) => {
  const firstCharLengthMap = {
    0: 10,
    2: 12,
    '+': 13,
    7: 9,
    1: 9
  };

  const validationMap = {
    leading_zero: {
      // eslint-disable-next-line no-nested-ternary
      format: full
        ? /0[71]\d{8}/g
        : text.length > 2
        ? /0[71]\d{1,8}/g
        : /0[71]/g,
      error: 'Phone number should match the format 0XXXXXXXXX',
      maxLength: 10
    },
    international: {
      format: full ? /\+254[71]\d{8}/g : /\+254[71]\d{0,8}/g,
      error: 'Phone number should match the pattern +254XXXXXXXXX',
      maxLength: 13
    },
    full: {
      // eslint-disable-next-line no-nested-ternary
      format: full
        ? /254[71]\d{8}/g
        : text.length > 3
        ? /254[71]\d{0,8}/g
        : /\d*/,
      error: 'Phone number should match the pattern 254XXXXXXXXX',
      maxLength: 12
    },
    all: {
      // eslint-disable-next-line no-nested-ternary
      format: full
        ? /(([71])|(0[71])|(\+254[71])|(254[71]))\d{8}/g
        : text.length > 3
        ? /([71]\d{0,8})|(254[71]\d{0,8})|(\+254[71]\d{0,8})|(0[71]\d{0,8})/g
        : /\d*/,
      error: 'Phone number format is invalid',
      maxLength: firstCharLengthMap[text.substr(0, 1)] || 13
    }
  };

  const matcher = text.match(validationMap[format].format);

  const isValid =
    matcher != null && matcher.length > 0 && matcher.shift() === text;
  const result = {
    isValid,
    validationError: '',
    maxLength: validationMap[format].maxLength
  };

  if (!isValid) {
    result.validationError =
      text.length > validationMap[format].maxLength
        ? `Phone number should not exceed ${validationMap[format].maxLength} digits`
        : validationMap[format].error || 'Invalid phone number.';
  }

  return result;
};
export default validatePhoneNumber;
