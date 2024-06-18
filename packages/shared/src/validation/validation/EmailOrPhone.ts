import EmailRegExp from '../regexp/Email';
import FormattedPhoneRegExp from '../regexp/FormattedPhone';
import PhoneRegExp from '../regexp/Phone';
import RegExpValidationRule from './RegExp';

export const EmailOrPhoneValidationRule = (required: boolean = true, trigger: string = 'blur') =>
  RegExpValidationRule('validation.please_input_email_or_phone', 'validation.invalid_email_or_phone', trigger, [PhoneRegExp, EmailRegExp], required);

export const EmailOrFormattedPhoneValidationRule = (required: boolean = true) =>
  RegExpValidationRule(
    'validation.please_input_email_or_phone',
    'validation.invalid_email_or_phone',
    'validation.blur',
    [FormattedPhoneRegExp, EmailRegExp],
    required,
  );

export default RegExpValidationRule(
  'validation.please_input_email_or_phone',
  'validation.invalid_email_or-phone',
  'validation.blur',
  [PhoneRegExp, EmailRegExp],
  true,
);
