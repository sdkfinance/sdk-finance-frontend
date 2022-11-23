<template>
  <div class="wallet-card">
    <div class="wallet-card__head">
      <div>
        <div class="wallet-card__head__title">
          {{ coin.name }}, <strong>{{ coin.issuer.currency }}</strong>
        </div>
        <div class="wallet-card__head__subtitle">
          Serial number: {{ coin.serial }}
        </div>
      </div>
    </div>
    <div class="wallet-card__body">
      <div class="wallet-card__body__row">
        <div class="wallet-card__body__label">
          Amount:
        </div>
        <div class="wallet-card__body__value">
          {{ coin.amount }}
        </div>
      </div>
      <div class="wallet-card__body__row">
        <div class="wallet-card__body__label">
          Available:
        </div>
        <div class="wallet-card__body__value">
          {{ coin.availableAmount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';

import { ICoin } from '@/services/requests/organizations/Coin.types';

@Component
export default class WalletCard extends Vue {

   @Prop({ type: Object, required: true }) private coin!: ICoin;

}
</script>

<style lang="scss">
  .wallet-card {
    width: 100%;
    height: 100%;
    background: $grey-color;
    color: $text-dark;
    border-radius: 8px;
    padding: 14px;
    line-height: 1.3;
    box-sizing: border-box;

    &__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;

      &__title {
        font-weight: 500;
        font-size: 16px;
        margin-bottom: 4px;

        strong {
          text-transform: uppercase;
        }
      }

      &__subtitle {
        font-size: 12px;
      }
    }

    &__body {
      &__row {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-bottom: 10px;
      }

      &__label {
        font-weight: 600;
      }

      &__value {
        font-weight: 300;
        margin-left: 5px;
      }
    }
  }
</style>
