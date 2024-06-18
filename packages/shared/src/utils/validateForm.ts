export function validateForm(this: any, form = this.$refs.form) {
  return form
    .validate()
    .then(() => true)
    .catch(() => false);
}

export function validateFormField(this: any, fields: string | string[], form = this.$refs.form): Promise<boolean> {
  return new Promise((resolve) => {
    form.validateField(fields, (errorMessage: string) => {
      if (errorMessage.length) {
        resolve(false);
      }

      resolve(true);
    });
  });
}

export function clearValidate(this: any, fields: string | string[], form = this.$refs.form) {
  return form.clearValidate(fields);
}
