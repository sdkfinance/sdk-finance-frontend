export type TIbanValidationResponse = {
  ibanIsValid: boolean;
};
export type TIbanGenerationResponse = {
  iban: string;
  countryCode: string;
  bankId: string;
};
