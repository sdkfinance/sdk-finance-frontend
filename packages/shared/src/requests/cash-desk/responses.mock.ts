import type { TViewCashDesksResponseMock } from './CashDesk.types';

export const VIEW_CASH_DESKS_RESPONSE_MOCK: TViewCashDesksResponseMock = {
  pageNumber: 0,
  pageSize: 10,
  totalPages: 5,
  totalRecords: 50,
  records: [
    {
      id: '7cf1f309-09cd-4eda-8b2c-682bf64fd7cd',
      type: 'cash_desk',
      name: 'Mono',
      organizationStatus: 'approved',
      contract_info: {
        id: '5bc369de-4fee-4d72-b5e5-73769adeec4e',
        personType: 'standart',
        name: 'standard contract for org individual',
      },
      coins: [
        {
          serial: '460385351405',
          name: 'Cash coin',
          amount: 0.0,
          availableAmount: 0.0,
          futureAmount: 0.0,
          heldAmount: 0.0,
          creditLimit: 0.0,
          currency: {
            id: '0059db1d-985a-4ce9-99d7-21d275e544ed',
            sn: 'B',
            code: 'BLB',
            symbol: 'BBB',
          },
          active: true,
          type: 'cash',
          main: true,
          accounting: false,
          smartCards: [],
        },
      ],
      contact: {
        phoneNumber: '12345678900',
        phoneVerified: true,
        email: 'test@test.com',
        emailVerified: true,
        countryCode: 'LT',
      },
      address: {
        country: 'LT',
        zipCode: '03147',
        city: 'Vilnius',
        street: 'Gerosios Vilties',
        houseNumber: '1-7',
      },
      addressLine: 'Gerosios Vilties g. 1-7, Vilnius, Lithuania, 03147',
      coordinate: {
        latitude: 'string',
        longitude: 'string',
      },
      workingDay: {
        id: '13f9aa5d-2ca2-44f3-b07f-7769b620ca42',
        cashier: {
          id: 'b97e5cad-e8de-4306-89e1-824d0bed55da',
          name: 'Tony Stark',
          profileOrganizationId: '13f9aa5d-2ca2-44f3-b07f-7769b620ca42',
        },
        status: 'opened',
        createdAt: '2023-03-21T16:53:40.969Z',
        start: '2023-03-21T00:00:00.000Z',
      },
      cashiers: [
        {
          id: 'b97e5cad-e8de-4306-89e1-824d0bed55da',
          name: 'Tony Stark',
          profileOrganizationId: '13f9aa5d-2ca2-44f3-b07f-7769b620ca42',
        },
      ],
    },
  ],
};
