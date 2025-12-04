// Form validation rules

export const validationRules = {
  // Email validation
  email: (value) => {
    if (!value) return "Email là bắt buộc";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Email không hợp lệ";
    return null;
  },

  // Password validation
  password: (value) => {
    if (!value) return "Mật khẩu là bắt buộc";
    if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return "Mật khẩu phải có chữ hoa, chữ thường và số";
    }
    return null;
  },

  // Name validation
  name: (value) => {
    if (!value) return null; // Optional
    if (value.length < 2) return "Tên phải có ít nhất 2 ký tự";
    if (value.length > 50) return "Tên không được quá 50 ký tự";
    return null;
  },

  // Required field
  required: (value, fieldName = "Trường này") => {
    if (!value || value.toString().trim() === "") {
      return `${fieldName} là bắt buộc`;
    }
    return null;
  },

  // Min length
  minLength: (value, min, fieldName = "Trường này") => {
    if (value && value.length < min) {
      return `${fieldName} phải có ít nhất ${min} ký tự`;
    }
    return null;
  },

  // Max length
  maxLength: (value, max, fieldName = "Trường này") => {
    if (value && value.length > max) {
      return `${fieldName} không được quá ${max} ký tự`;
    }
    return null;
  },

  // Number validation
  number: (value, fieldName = "Trường này") => {
    if (value && isNaN(value)) {
      return `${fieldName} phải là số`;
    }
    return null;
  },

  // Min value
  minValue: (value, min, fieldName = "Trường này") => {
    if (value !== undefined && value !== null && parseFloat(value) < min) {
      return `${fieldName} phải lớn hơn hoặc bằng ${min}`;
    }
    return null;
  },

  // Product name validation
  productName: (value) => {
    if (!value) return "Tên sản phẩm là bắt buộc";
    if (value.length < 2) return "Tên sản phẩm phải có ít nhất 2 ký tự";
    if (value.length > 255) return "Tên sản phẩm không được quá 255 ký tự";
    return null;
  },

  // Price validation
  price: (value) => {
    if (value === undefined || value === null || value === "") {
      return "Giá sản phẩm là bắt buộc";
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "Giá phải là số";
    if (numValue < 0) return "Giá phải lớn hơn hoặc bằng 0";
    return null;
  },

  // Stock validation
  stock: (value) => {
    if (value === undefined || value === null || value === "") {
      return "Số lượng là bắt buộc";
    }
    const numValue = parseInt(value);
    if (isNaN(numValue)) return "Số lượng phải là số nguyên";
    if (numValue < 0) return "Số lượng phải lớn hơn hoặc bằng 0";
    if (!Number.isInteger(numValue)) return "Số lượng phải là số nguyên";
    return null;
  },

  // URL validation
  url: (value) => {
    if (!value) return null; // Optional
    try {
      new URL(value);
      return null;
    } catch {
      return "URL không hợp lệ";
    }
  },
};

// Validate entire form
export const validateForm = (values, rules) => {
  const errors = {};

  for (const field in rules) {
    const rule = rules[field];
    const value = values[field];

    if (typeof rule === "function") {
      const error = rule(value);
      if (error) errors[field] = error;
    } else if (Array.isArray(rule)) {
      // Multiple validators
      for (const validator of rule) {
        const error = validator(value);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export default validationRules;
