import { TransactionType } from '@metamask/transaction-controller';

export const upgradeAccountConfirmation = {
  batchId: '0x6046131032d748a6bfac42fd5117479f',
  chainId: '0xaa36a7',
  id: 'aa0ff2b0-150f-11f0-9325-8f0b8505bc4f',
  nestedTransactions: [
    {
      to: '0x0c54FcCd2e384b4BB6f2E405Bf5Cbc15a017AaFb',
      data: '0x654365436543',
      value: '0x3B9ACA00',
      type: TransactionType.simpleSend,
    },
    {
      to: '0xbc2114a988e9CEf5bA63548D432024f34B487048',
      data: '0x789078907890',
      value: '0x1DCD6500',
      type: TransactionType.simpleSend,
    },
  ],
  networkClientId: 'sepolia',
  securityAlertResponse: {
    block: 8082431,
    result_type: 'Benign',
    reason: '',
    description: '',
    features: [],
    source: 'api',
    securityAlertId: '31cda7d5-9657-4567-b364-d6918f0933a0',
  },
  status: 'unapproved',
  time: 1744181747035,
  txParams: {
    from: '0x8a0bbcd42cf79e7cee834e7808eb2fef1cebdb87',
    authorizationList: [
      { address: '0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B' },
    ],
    data: '0xe9ae5c530100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000c54fccd2e384b4bb6f2e405bf5cbc15a017aafb000000000000000000000000000000000000000000000000000000003b9aca00000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000066543654365430000000000000000000000000000000000000000000000000000000000000000000000000000bc2114a988e9cef5ba63548d432024f34b487048000000000000000000000000000000000000000000000000000000001dcd6500000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000067890789078900000000000000000000000000000000000000000000000000000',
    gas: '0x1a209',
    to: '0x8a0bbcd42cf79e7cee834e7808eb2fef1cebdb87',
    value: '0x0',
    maxFeePerGas: '0x21b65659b',
    maxPriorityFeePerGas: '0x59682f00',
    type: '0x4',
  },
  type: 'batch',
  userEditedGasLimit: false,
  verifiedOnBlockchain: false,
  gasLimitNoBuffer: '0x116b1',
  originalGasEstimate: '0x1a209',
  defaultGasEstimates: {
    gas: '0x1a209',
    maxFeePerGas: '0x21b65659b',
    maxPriorityFeePerGas: '0x59682f00',
    estimateType: 'medium',
  },
  userFeeLevel: 'medium',
  sendFlowHistory: [],
  history: [
    {
      batchId: '0x6046131032d748a6bfac42fd5117479f',
      chainId: '0xaa36a7',
      id: 'aa0ff2b0-150f-11f0-9325-8f0b8505bc4f',
      nestedTransactions: [
        {
          to: '0x0c54FcCd2e384b4BB6f2E405Bf5Cbc15a017AaFb',
          data: '0x654365436543',
          value: '0x3B9ACA00',
          type: 'simpleSend',
        },
        {
          to: '0xbc2114a988e9CEf5bA63548D432024f34B487048',
          data: '0x789078907890',
          value: '0x1DCD6500',
          type: 'simpleSend',
        },
      ],
      networkClientId: 'sepolia',
      securityAlertResponse: {
        securityAlertId: '31cda7d5-9657-4567-b364-d6918f0933a0',
      },
      status: 'unapproved',
      time: 1744181747035,
      txParams: {
        from: '0x8a0bbcd42cf79e7cee834e7808eb2fef1cebdb87',
        authorizationList: [
          { address: '0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B' },
        ],
        data: '0xe9ae5c530100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000c54fccd2e384b4bb6f2e405bf5cbc15a017aafb000000000000000000000000000000000000000000000000000000003b9aca00000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000066543654365430000000000000000000000000000000000000000000000000000000000000000000000000000bc2114a988e9cef5ba63548d432024f34b487048000000000000000000000000000000000000000000000000000000001dcd6500000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000067890789078900000000000000000000000000000000000000000000000000000',
        to: '0x8a0bbcd42cf79e7cee834e7808eb2fef1cebdb87',
        type: '0x4',
        value: '0x0',
        gas: '0x1a209',
        maxFeePerGas: '0x21b65659b',
        maxPriorityFeePerGas: '0x59682f00',
      },
      type: 'batch',
      userEditedGasLimit: false,
      verifiedOnBlockchain: false,
      gasLimitNoBuffer: '0x116b1',
      originalGasEstimate: '0x1a209',
      defaultGasEstimates: {
        gas: '0x1a209',
        maxFeePerGas: '0x21b65659b',
        maxPriorityFeePerGas: '0x59682f00',
        estimateType: 'medium',
      },
      userFeeLevel: 'medium',
      sendFlowHistory: [],
    },
    [
      {
        op: 'add',
        path: '/securityAlertResponse/result_type',
        value: 'loading',
        note: 'TransactionController:updatesecurityAlertResponse - securityAlertResponse updated',
        timestamp: 1744181748371,
      },
      {
        op: 'add',
        path: '/securityAlertResponse/reason',
        value: 'validation_in_progress',
      },
    ],
    [
      {
        op: 'add',
        path: '/gasFeeEstimates',
        value: {
          type: 'fee-market',
          low: {
            maxFeePerGas: '0x188ee0ee4',
            maxPriorityFeePerGas: '0x3b9aca00',
          },
          medium: {
            maxFeePerGas: '0x21b65659b',
            maxPriorityFeePerGas: '0x59682f00',
          },
          high: {
            maxFeePerGas: '0x2addcbc51',
            maxPriorityFeePerGas: '0x77359400',
          },
        },
        note: 'TransactionController#updateSimulationData - Update simulation data',
        timestamp: 1744181748673,
      },
      { op: 'add', path: '/gasFeeEstimatesLoaded', value: true },
      { op: 'add', path: '/gasFeeTokens', value: [] },
      {
        op: 'add',
        path: '/simulationData',
        value: {
          nativeBalanceChange: {
            previousBalance: '0x109f1f975d02012',
            newBalance: '0x109f1f91c67f112',
            difference: '0x59682f00',
            isDecrease: true,
          },
          tokenBalanceChanges: [],
        },
      },
    ],
    [
      {
        op: 'replace',
        path: '/securityAlertResponse/reason',
        value: '',
        note: 'TransactionController:updatesecurityAlertResponse - securityAlertResponse updated',
        timestamp: 1744181749212,
      },
      {
        op: 'replace',
        path: '/securityAlertResponse/result_type',
        value: 'Benign',
      },
      { op: 'add', path: '/securityAlertResponse/block', value: 8082431 },
      { op: 'add', path: '/securityAlertResponse/description', value: '' },
      { op: 'add', path: '/securityAlertResponse/features', value: [] },
      { op: 'add', path: '/securityAlertResponse/source', value: 'api' },
    ],
  ],
  gasFeeEstimates: {
    type: 'fee-market',
    low: { maxFeePerGas: '0x188ee0ee4', maxPriorityFeePerGas: '0x3b9aca00' },
    medium: { maxFeePerGas: '0x21b65659b', maxPriorityFeePerGas: '0x59682f00' },
    high: { maxFeePerGas: '0x2addcbc51', maxPriorityFeePerGas: '0x77359400' },
  },
  gasFeeEstimatesLoaded: true,
  gasFeeTokens: [],
  simulationData: {
    nativeBalanceChange: {
      previousBalance: '0x109f1f975d02012',
      newBalance: '0x109f1f91c67f112',
      difference: '0x59682f00',
      isDecrease: true,
    },
    tokenBalanceChanges: [],
  },
};

export const RevokeDelegation = {
  actionId: 1743757606797.6257,
  chainId: '0xaa36a7',
  delegationAddress: '0xcd8d6c5554e209fbb0dec797c6293cf7eae13454',
  id: '22c82900-1134-11f0-a4de-3b789e5a89ad',
  networkClientId: 'sepolia',
  origin: 'metamask',
  status: 'unapproved',
  time: 1743757606800,
  txParams: {
    from: '0x8a0bbcd42cf79e7cee834e7808eb2fef1cebdb87',
    authorizationList: [
      { address: '0x0000000000000000000000000000000000000000' },
    ],
    gas: '0x11017',
    to: '0x8a0bbcd42cf79e7cee834e7808eb2fef1cebdb87',
    value: '0x0',
    maxFeePerGas: '0xd0017b51',
    maxPriorityFeePerGas: '0x59682f00',
    type: '0x4',
  },
  type: TransactionType.revokeDelegation,
  userEditedGasLimit: false,
  verifiedOnBlockchain: false,
  gasLimitNoBuffer: '0xb565',
  originalGasEstimate: '0x11017',
  defaultGasEstimates: {
    gas: '0x11017',
    maxFeePerGas: '0xd0017b51',
    maxPriorityFeePerGas: '0x59682f00',
    estimateType: 'medium',
  },
  userFeeLevel: 'medium',
  sendFlowHistory: [],
  history: [
    {
      actionId: 1743757606797.6257,
      chainId: '0xaa36a7',
      delegationAddress: '0xcd8d6c5554e209fbb0dec797c6293cf7eae13454',
      id: '22c82900-1134-11f0-a4de-3b789e5a89ad',
      networkClientId: 'sepolia',
      origin: 'metamask',
      status: 'unapproved',
      time: 1743757606800,
      txParams: {
        from: '0x8a0bbcd42cf79e7cee834e7808eb2fef1cebdb87',
        authorizationList: [
          { address: '0x0000000000000000000000000000000000000000' },
        ],
        to: '0x8a0bbcd42cf79e7cee834e7808eb2fef1cebdb87',
        type: '0x4',
        value: '0x0',
        gas: '0x11017',
        maxFeePerGas: '0xd0017b51',
        maxPriorityFeePerGas: '0x59682f00',
      },
      type: 'revokeDelegation',
      userEditedGasLimit: false,
      verifiedOnBlockchain: false,
      gasLimitNoBuffer: '0xb565',
      originalGasEstimate: '0x11017',
      defaultGasEstimates: {
        gas: '0x11017',
        maxFeePerGas: '0xd0017b51',
        maxPriorityFeePerGas: '0x59682f00',
        estimateType: 'medium',
      },
      userFeeLevel: 'medium',
      sendFlowHistory: [],
    },
    [
      {
        op: 'add',
        path: '/gasFeeEstimates',
        value: {
          type: 'fee-market',
          low: {
            maxFeePerGas: '0x9374a3b7',
            maxPriorityFeePerGas: '0x3b9aca00',
          },
          medium: {
            maxFeePerGas: '0xd0017b51',
            maxPriorityFeePerGas: '0x59682f00',
          },
          high: {
            maxFeePerGas: '0x10c8e52eb',
            maxPriorityFeePerGas: '0x77359400',
          },
        },
        note: 'TransactionController#updateSimulationData - Update simulation data',
        timestamp: 1743757609512,
      },
      { op: 'add', path: '/gasFeeEstimatesLoaded', value: true },
      { op: 'add', path: '/gasFeeTokens', value: [] },
      {
        op: 'add',
        path: '/simulationData',
        value: { tokenBalanceChanges: [] },
      },
    ],
  ],
  gasFeeEstimates: {
    type: 'fee-market',
    low: { maxFeePerGas: '0x9374a3b7', maxPriorityFeePerGas: '0x3b9aca00' },
    medium: { maxFeePerGas: '0xd0017b51', maxPriorityFeePerGas: '0x59682f00' },
    high: { maxFeePerGas: '0x10c8e52eb', maxPriorityFeePerGas: '0x77359400' },
  },
  gasFeeEstimatesLoaded: true,
  gasFeeTokens: [],
  simulationData: { tokenBalanceChanges: [] },
};
