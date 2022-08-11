export const copyToClipboard = (value: string): void => {
  const textArea: HTMLTextAreaElement = document.createElement('textarea');
  document.body.append(textArea);
  textArea.value = value;
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};
