import { TransactionMeta } from '@metamask/transaction-controller';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { useCallback, useMemo } from 'react';
import { getCustomNonceValue } from '../../../../selectors';
import { useConfirmContext } from '../../context/confirm';
import { useSelectedGasFeeToken } from '../../components/confirm/info/hooks/useGasFeeToken';
import { updateAndApproveTx } from '../../../../store/actions';
import { getIsSmartTransaction } from '../../../../../shared/modules/selectors';

export function useTransactionConfirm() {
  const dispatch = useDispatch();
  const customNonceValue = useSelector(getCustomNonceValue);
  const selectedGasFeeToken = useSelectedGasFeeToken();
  const isSmartTransaction = useSelector(getIsSmartTransaction);

  const { currentConfirmation: transactionMeta } =
    useConfirmContext<TransactionMeta>();

  const newTransactionMeta = useMemo(
    () => cloneDeep(transactionMeta),
    [transactionMeta],
  );

  const handleSmartTransaction = useCallback(() => {
    if (!selectedGasFeeToken) {
      return;
    }

    newTransactionMeta.batchTransactions = [
      selectedGasFeeToken.transferTransaction,
    ];

    newTransactionMeta.txParams.gas = selectedGasFeeToken.gas;
    newTransactionMeta.txParams.maxFeePerGas = selectedGasFeeToken.maxFeePerGas;

    newTransactionMeta.txParams.maxPriorityFeePerGas =
      selectedGasFeeToken.maxPriorityFeePerGas;
  }, [selectedGasFeeToken, newTransactionMeta]);

  const handleGasless7702 = useCallback(() => {
    newTransactionMeta.isExternalSign = true;
  }, [newTransactionMeta]);

  const onTransactionConfirm = useCallback(async () => {
    newTransactionMeta.customNonceValue = customNonceValue;

    if (isSmartTransaction) {
      handleSmartTransaction();
    } else if (selectedGasFeeToken) {
      handleGasless7702();
    }

    ///: BEGIN:ONLY_INCLUDE_IF(build-main,build-beta,build-flask)
    await dispatch(updateAndApproveTx(newTransactionMeta, true, ''));
    ///: END:ONLY_INCLUDE_IF
  }, [
    dispatch,
    handleGasless7702,
    handleSmartTransaction,
    isSmartTransaction,
    newTransactionMeta,
  ]);

  return {
    onTransactionConfirm,
  };
}
