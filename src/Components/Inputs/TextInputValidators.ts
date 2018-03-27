// import { isKennitala, isEmail } from '../../Utils/stringValidators'

export type TextInputValidator = (value: string) => string | null;

export const RequiredTextInputValidator: TextInputValidator = value => {
  if (value === '') {
    return 'Má ekki vera tómt';
  }
  return null;
};

export const OnlyDigitsTextInputValidator: TextInputValidator = value =>
  /^\d+$/.test(value) ? null : 'Einungis tölustafir leyfðir';

// export const EmailTextInputValidator: TextInputValidator = value => isEmail(value) ? null : 'Ekki gilt póstfang'
