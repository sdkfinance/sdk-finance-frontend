export interface IOperationForm {
  method: string | null;
  cashDeskId: string | null;
  serial: string | null;
  amount: number | null;
  fullName: string | null;
}

export type TOperationFormFields = keyof IOperationForm;
