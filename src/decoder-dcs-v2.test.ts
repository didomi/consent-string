import { decodeDCS } from '@/decoder-dcs';

describe('Decode DCS v2', () => {
  it('should decode DCS v2 consent string', () => {
    const consentString = 'CGHWv4UYba5-dZnABdKu__D6iWHsD6iWHsAABEACKUqIAEUpVAAAIixwAACIsYAA';
    const expectedUserStatus = {
      user_id: '1875afe1-461b-6b9f-9d66-700174abbffc',
      created: '2023-04-12T18:10:00.000Z',
      updated: '2023-04-12T18:10:00.000Z',
      regulation_id: 1,
      vendors_optin: {
        enabled: [128, 129, 130, 131, 132],
        disabled: [],
      },
      purposes_optin: {
        enabled: [1, 2, 6, 7, 8],
        disabled: [3, 4],
      },
      vendors_optout: {
        enabled: [128, 129, 130, 131, 132],
        disabled: [],
      },
      purposes_optout: {
        enabled: [1, 2, 6, 7, 8],
        disabled: [3, 4],
      },
    };
    expect(decodeDCS(consentString)).toEqual(expectedUserStatus);
  });
  it('should decode DCS v2 consent string with optional fields', () => {
    const consentString = 'CGHWv4UYba5-dZnABdKu__D6iWHsD6iWHsAAKn2J57YEACKUqIAEUpVAAAIixwAACIsY';
    const expectedUserStatus = {
      user_id: '1875afe1-461b-6b9f-9d66-700174abbffc',
      created: '2023-04-12T18:10:00.000Z',
      updated: '2023-04-12T18:10:00.000Z',
      regulation_id: 10,
      sync: '2023-05-24T18:10:00.000Z',
      vendors_optin: {
        enabled: [128, 129, 130, 131, 132],
        disabled: [],
      },
      purposes_optin: {
        enabled: [1, 2, 6, 7, 8],
        disabled: [3, 4],
      },
      vendors_optout: {
        enabled: [128, 129, 130, 131, 132],
        disabled: [],
      },
      purposes_optout: {
        enabled: [1, 2, 6, 7, 8],
        disabled: [3, 4],
      },
    };
    expect(decodeDCS(consentString)).toEqual(expectedUserStatus);
  });
});
