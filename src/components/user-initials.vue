<template>
  <div class="user-initials">
    {{ initials }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import { Profile } from '@/store/modules';
import { IPlainObject } from '@/types/interfaces';

@Component
export default class UserInitials extends Vue {

  protected profileModule = getModule(Profile, this.$store);

  protected get namePlain(): IPlainObject {
    return this.profileModule.namePlain;
  }

  protected get initials(): string {
    const firstName: string = this.namePlain.first || '';
    const lastName: string = this.namePlain.last || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

}
</script>

<style lang="scss" scoped>
.user-initials {
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  color: #fff;
  border-radius: 50%;
  background-color: $primary-color;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}
</style>
