import React from 'react';
import configureMockStore from 'redux-mock-store';
import { fireEvent } from '@testing-library/dom';

import { flushPromises } from '../../../../../../../test/lib/timer-helpers';
import { getMockConfirmStateForTransaction } from '../../../../../../../test/data/confirmations/helper';
import { renderWithConfirmContextProvider } from '../../../../../../../test/lib/confirmations/render-helpers';
import { upgradeAccountConfirmation } from '../../../../../../../test/data/confirmations/batch-transaction';
import { Confirmation } from '../../../../types/confirm';
import {
  disableAccountUpgradeForChain,
  rejectPendingApproval,
} from '../../../../../../store/actions';
import { SmartAccountUpdate } from './smart-account-update';

jest.mock('../../../../../../store/actions', () => ({
  disableAccountUpgradeForChain: jest.fn(),
  rejectPendingApproval: jest.fn().mockReturnValue({}),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

describe('Splash', () => {
  it('renders correctly', () => {
    const mockStore = configureMockStore([])(
      getMockConfirmStateForTransaction(
        upgradeAccountConfirmation as Confirmation,
      ),
    );
    const { getByText } = renderWithConfirmContextProvider(
      <SmartAccountUpdate />,
      mockStore,
    );

    expect(getByText('Use smart account?')).toBeInTheDocument();
  });

  it('closes after acknowledgement', () => {
    const mockStore = configureMockStore([])(
      getMockConfirmStateForTransaction(
        upgradeAccountConfirmation as Confirmation,
      ),
    );
    const { getAllByRole, container } = renderWithConfirmContextProvider(
      <SmartAccountUpdate />,
      mockStore,
    );

    expect(container.firstChild).not.toBeNull();

    fireEvent.click(
      getAllByRole('button', {
        name: /Use smart account/iu,
      })[1],
    );

    expect(container.firstChild).toBeNull();
  });

  it('reject confirmation if user does not accept', async () => {
    const mockStore = configureMockStore([])(
      getMockConfirmStateForTransaction(
        upgradeAccountConfirmation as Confirmation,
      ),
    );
    const { getByRole } = renderWithConfirmContextProvider(
      <SmartAccountUpdate />,
      mockStore,
    );

    fireEvent.click(
      getByRole('button', {
        name: /Don’t use smart account/iu,
      }),
    );
    expect(disableAccountUpgradeForChain).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(rejectPendingApproval).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
