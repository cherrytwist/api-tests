export const organizationAccountNoLicenses = {
  subscriptions: [],
  authorization: {
    myPrivileges: ['READ', 'TRANSFER_RESOURCE', 'CREATE', 'UPDATE', 'DELETE'],
  },
  license: {
    type: 'ACCOUNT',
    authorization: { myPrivileges: ['READ', 'CREATE', 'UPDATE', 'DELETE'] },
    availableEntitlements: [],
    entitlements: [
      {
        type: 'ACCOUNT_SPACE_PREMIUM',
        isAvailable: false,
        enabled: false,
        limit: 0,
        usage: 0,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_SPACE_FREE',
        isAvailable: false,
        enabled: false,
        limit: 0,
        usage: 0,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_VIRTUAL_CONTRIBUTOR',
        isAvailable: false,
        enabled: false,
        limit: 0,
        usage: 0,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_INNOVATION_PACK',
        isAvailable: false,
        enabled: false,
        limit: 0,
        usage: 0,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_SPACE_PLUS',
        isAvailable: false,
        enabled: false,
        limit: 0,
        usage: 0,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_INNOVATION_HUB',
        isAvailable: false,
        enabled: false,
        limit: 0,
        usage: 0,
        dataType: 'LIMIT',
      },
    ],
  },
  spaces: [],
};

export const organizationAccountLicensePlus = {
  subscriptions: [{ expires: null, name: 'ACCOUNT_LICENSE_PLUS' }],
  authorization: {
    myPrivileges: [
      'READ',
      'TRANSFER_RESOURCE',
      'CREATE',
      'UPDATE',
      'DELETE',
      'CREATE_SPACE',
      'CREATE_VIRTUAL_CONTRIBUTOR',
      'CREATE_INNOVATION_PACK',
    ],
  },
  license: {
    type: 'ACCOUNT',
    authorization: { myPrivileges: ['READ', 'CREATE', 'UPDATE', 'DELETE'] },
    availableEntitlements: [
      'ACCOUNT_SPACE_FREE',
      'ACCOUNT_INNOVATION_HUB',
      'ACCOUNT_VIRTUAL_CONTRIBUTOR',
      'ACCOUNT_INNOVATION_PACK',
    ],
    entitlements: [
      {
        type: 'ACCOUNT_SPACE_PREMIUM',
        isAvailable: false,
        enabled: false,
        limit: 0,
        usage: 0,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_SPACE_FREE',
        isAvailable: true,
        enabled: true,
        limit: 3,
        usage: 0,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_VIRTUAL_CONTRIBUTOR',
        isAvailable: true,
        enabled: true,
        limit: 3,
        usage: 0,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_INNOVATION_PACK',
        isAvailable: true,
        enabled: true,
        limit: 3,
        usage: 0,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_SPACE_PLUS',
        isAvailable: false,
        enabled: false,
        limit: 0,
        usage: 0,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_INNOVATION_HUB',
        isAvailable: true,
        enabled: true,
        limit: 1,
        usage: 0,
        dataType: 'LIMIT',
      },
    ],
  },
  spaces: [],
};

export const organizationAccountLicensePlus1SpaceVCPack = {
  subscriptions: [{ expires: null, name: 'ACCOUNT_LICENSE_PLUS' }],
  authorization: {
    myPrivileges: [
      'READ',
      'TRANSFER_RESOURCE',
      'CREATE',
      'UPDATE',
      'DELETE',
      'CREATE_SPACE',
      'CREATE_VIRTUAL_CONTRIBUTOR',
      'CREATE_INNOVATION_PACK',
    ],
  },
  license: {
    type: 'ACCOUNT',
    authorization: { myPrivileges: ['READ', 'CREATE', 'UPDATE', 'DELETE'] },
    availableEntitlements: [
      'ACCOUNT_SPACE_FREE',
      'ACCOUNT_INNOVATION_HUB',
      'ACCOUNT_VIRTUAL_CONTRIBUTOR',
      'ACCOUNT_INNOVATION_PACK',
    ],
    entitlements: [
      {
        type: 'ACCOUNT_SPACE_PREMIUM',
        isAvailable: false,
        enabled: false,
        limit: 0,
        usage: 1,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_SPACE_FREE',
        isAvailable: true,
        enabled: true,
        limit: 3,
        usage: 1,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_VIRTUAL_CONTRIBUTOR',
        isAvailable: true,
        enabled: true,
        limit: 3,
        usage: 1,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_INNOVATION_PACK',
        isAvailable: true,
        enabled: true,
        limit: 3,
        usage: 1,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_SPACE_PLUS',
        isAvailable: false,
        enabled: false,
        limit: 0,
        usage: 1,
        dataType: 'LIMIT',
      },
      {
        type: 'ACCOUNT_INNOVATION_HUB',
        isAvailable: true,
        enabled: true,
        limit: 1,
        usage: 0,
        dataType: 'LIMIT',
      },
    ],
  },
  spaces: [
    {
      license: {
        type: 'SPACE',
        authorization: {
          myPrivileges: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'GRANT'],
        },
        entitlements: [
          {
            dataType: 'FLAG',
            enabled: true,
            isAvailable: true,
            limit: 1,
            type: 'SPACE_FLAG_VIRTUAL_CONTRIBUTOR_ACCESS',
            usage: -1,
          },
          {
            dataType: 'FLAG',
            enabled: true,
            isAvailable: true,
            limit: 1,
            type: 'SPACE_FLAG_SAVE_AS_TEMPLATE',
            usage: -1,
          },
          {
            dataType: 'FLAG',
            enabled: true,
            isAvailable: true,
            limit: 1,
            type: 'SPACE_FREE',
            usage: -1,
          },
          {
            dataType: 'FLAG',
            enabled: false,
            isAvailable: false,
            limit: 0,
            type: 'SPACE_PLUS',
            usage: -1,
          },
          {
            dataType: 'FLAG',
            enabled: false,
            isAvailable: false,
            limit: 0,
            type: 'SPACE_PREMIUM',
            usage: -1,
          },
          {
            dataType: 'FLAG',
            enabled: false,
            isAvailable: false,
            limit: 0,
            type: 'SPACE_FLAG_WHITEBOARD_MULTI_USER',
            usage: -1,
          },
        ],
      },
    },
  ],
};