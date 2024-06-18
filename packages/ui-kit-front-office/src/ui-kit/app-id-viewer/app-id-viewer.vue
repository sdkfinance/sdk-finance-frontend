<template>
  <div
    role="button"
    :class="idViewerClassNames"
    @click="processCopyToClipboard">
    <i :class="idViewerIconClassNames" />
    <div class="id-viewer__text">
      {{ currentTextContent }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppIdViewer',
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      copiedToClipboard: false,
    };
  },
  computed: {
    idViewerClassNames(): string[] {
      return ['id-viewer', this.copiedToClipboard ? 'id-viewer--copied' : ''];
    },
    currentIcon(): string {
      return this.copiedToClipboard ? 'icon-copy' : 'icon-copy';
    },
    idViewerIconClassNames(): string[] {
      return ['id-viewer__icon', 'icon', this.currentIcon];
    },
    resultText(): string {
      return this.$i18n.t('notification.copied_to_clipboard').toString();
    },
    currentTextContent(): string {
      return this.copiedToClipboard ? this.resultText : this.id;
    },
  },
  methods: {
    isClipboardAvailable(): boolean {
      return typeof window.navigator.clipboard !== 'undefined' && window.isSecureContext;
    },
    legacyWriteToClipboard(content: string): boolean {
      if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        const textarea = document.createElement('textarea');
        textarea.textContent = content;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          return document.execCommand('copy');
        } catch (ex) {
          return false;
        } finally {
          document.body.removeChild(textarea);
        }
      }

      return false;
    },
    async copyToClipboard(content: string): Promise<boolean> {
      if (!this.isClipboardAvailable()) {
        return this.legacyWriteToClipboard(content);
      }

      await window.navigator.clipboard.writeText(content);
      return true;
    },
    async processCopyToClipboard() {
      const successCopy = await this.copyToClipboard(this.id);

      if (!successCopy) {
        return;
      }

      this.copiedToClipboard = true;
      setTimeout(() => {
        this.copiedToClipboard = false;
      }, 3000);
    },
  },
});
</script>

<style scoped lang="scss">
.id-viewer,
.id-viewer__text {
  @apply overflow-hidden w-full;
}

.id-viewer {
  @apply flex items-center gap-x-[0.375rem] relative w-fit max-w-full z-1 overflow-hidden box-border py-[0.375rem] transition-all;
  @apply before:bg-transparent
    before:rounded-[0.4375rem]
    before:w-full
    before:h-full
    before:absolute
    before:top-0
    before:left-0
    before:-z-1;

  &--copied,
  &--copied:hover {
    &.id-viewer {
      @apply before:bg-blue-300;
    }
  }

  &:not(&--copied):hover {
    @apply before:bg-blue-100;
  }

  &--copied .id-viewer__text,
  .id-viewer__icon {
    @apply text-blue-600;
  }

  &--copied {
    .id-viewer {
      &__text {
        @apply font-medium;
      }
    }
  }

  &--copied,
  &:hover {
    @apply px-[0.625rem];

    .id-viewer {
      &__icon {
        @apply flex;
      }
    }
  }

  &__icon {
    @apply items-center w-[1rem] h-[1rem] text-[0.5rem] justify-center hidden leading-[normal];
  }

  &__text {
    @apply overflow-ellipsis text-gray-500 text-sm leading-[1.125rem] font-normal whitespace-nowrap;
  }
}
</style>
