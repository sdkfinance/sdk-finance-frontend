import type { IDocumentType, IProfileDocument } from '@sdk5/shared';

export interface TProfileDocumentItem
  extends Pick<Partial<IProfileDocument>, 'status' | 'label' | 'id' | 'documentIdentifier'>,
    Pick<IProfileDocument, 'type'>,
    Pick<IDocumentType, 'asPlainText'> {
  fileUrl?: string;
}
