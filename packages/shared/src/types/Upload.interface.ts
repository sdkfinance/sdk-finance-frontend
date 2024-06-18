export interface IUploadConfig {
  action: string;
  tip: {
    message: string;
    params: {
      size: number;
      extensions: string;
    };
  };
}
