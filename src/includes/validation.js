import {
  Form as VeeForm,
  Field as VeeField,
  ErrorMessage,
  defineRule,
  configure,
} from 'vee-validate';

import {
  required,
  min,
  max,
  min_value as
  minValue,
  mimes,
  size,
  alpha_spaces as alphaSpaces,
  max_value as maxValue,
  not_one_of as excluded,
  email,
  confirmed,
} from '@vee-validate/rules';

export default {
  install(app) {
    app.component('vee-form', VeeForm);
    app.component('vee-field', VeeField);
    app.component('error-message', ErrorMessage);

    defineRule('size', size);
    defineRule('mimes', mimes);
    defineRule('required', required);
    defineRule('user_agreement', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('min_value', minValue);
    defineRule('max_value', maxValue);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('not_one_of', excluded);
    defineRule('password_mismatch', confirmed);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: 'The field is required',
          min: 'The field is too short',
          max: 'The field is too long',
          alpha_spaces: 'The field may only contain alphabetical characters and spaces',
          email: 'The field must be a valid email',
          min_value: 'The field is too low',
          max_value: 'The field is too high',
          not_one_of: 'This country is currently not supported',
          user_agreement: 'You must agree upon the terms of service of this app',
          password_mismatch: 'Passwords do not match',
          mimes: 'Invalid file type',
          size: 'File size should not exceed 2MB',
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid`;

        return message;
      },
    });
  },
};
