import { FormattedMessage } from 'react-intl';
import * as React from 'react';

// import { isKennitala, isEmail } from '../../Utils/stringValidators'

export type TextInputValidator = (textInput: string) => React.ReactNode;

export const RequiredTextInputValidator: TextInputValidator = value => {
  if (value === '') {
    return 'Má ekki vera tómt';
  }
  return null;
};

export const OnlyDigitsTextInputValidator: TextInputValidator = value =>
  /^\d+$/.test(value) ? null : 'Einungis tölustafir leyfðir';

export const MinLengthTextInputValidator: (
  minLength: number,
  messageId?: string,
) => TextInputValidator = (minLength, messageId = 'tivMinLenght') => value => {
  if (value.length < minLength) {
    return <FormattedMessage id={messageId} values={{ minLength }} />;
  }
  return null;
};

// export const EmailTextInputValidator: TextInputValidator = value => isEmail(value) ? null : 'Ekki gilt póstfang'
