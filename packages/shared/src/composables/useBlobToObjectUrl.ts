import { isRef, onBeforeUnmount, ref, watch } from 'vue';

import type { MaybeRef } from '../types';

export const useBlobToObjectUrl = (blob: MaybeRef<Blob | null>) => {
  const blobRef = isRef(blob) ? blob : ref(blob);

  const objectUrl = ref(null as string | null);

  const revokeObjectUrl = () => {
    if (objectUrl.value) {
      URL.revokeObjectURL(objectUrl.value);
    }
  };

  watch(
    blobRef,
    (blobOption) => {
      revokeObjectUrl();

      objectUrl.value = blobOption ? URL.createObjectURL(blobOption) : null;
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    revokeObjectUrl();
  });

  return {
    objectUrl,
  };
};
