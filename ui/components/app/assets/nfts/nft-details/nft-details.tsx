import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { isEqual } from 'lodash';
import { getTokenTrackerLink, getAccountLink } from '@metamask/etherscan-link';
import { Nft } from '@metamask/assets-controllers';
import { Hex } from '@metamask/utils';
import {
  BlockSize,
  BorderColor,
  TextColor,
  IconColor,
  TextVariant,
  FontWeight,
  JustifyContent,
  Display,
  FlexWrap,
  FontStyle,
  TextAlign,
  AlignItems,
} from '../../../../../helpers/constants/design-system';
import { useI18nContext } from '../../../../../hooks/useI18nContext';
import { shortenAddress } from '../../../../../helpers/utils/util';
import { getNftImage, getNftImageAlt } from '../../../../../helpers/utils/nfts';
import {
  getCurrentChainId,
  getNetworkConfigurationsByChainId,
} from '../../../../../../shared/modules/selectors/networks';
import {
  getCurrentNetwork,
  getIpfsGateway,
  getNetworkConfigurationIdByChainId,
} from '../../../../../selectors';
import {
  ASSET_ROUTE,
  DEFAULT_ROUTE,
  SEND_ROUTE,
} from '../../../../../helpers/constants/routes';
import {
  checkAndUpdateSingleNftOwnershipStatus,
  removeAndIgnoreNft,
  setRemoveNftMessage,
  setNewNftAddedMessage,
  setActiveNetworkWithError,
} from '../../../../../store/actions';
import { CHAIN_IDS } from '../../../../../../shared/constants/network';
import NftOptions from '../nft-options/nft-options';
import { startNewDraftTransaction } from '../../../../../ducks/send';
import InfoTooltip from '../../../../ui/info-tooltip';
import { usePrevious } from '../../../../../hooks/usePrevious';
import { useCopyToClipboard } from '../../../../../hooks/useCopyToClipboard';
import {
  AssetType,
  TokenStandard,
} from '../../../../../../shared/constants/transaction';
import {
  ButtonIcon,
  IconName,
  Text,
  Box,
  ButtonIconSize,
  ButtonPrimarySize,
  ButtonPrimary,
  Icon,
} from '../../../../component-library';
import { NftItem } from '../../../../multichain/nft-item';
import {
  MetaMetricsEventName,
  MetaMetricsEventCategory,
} from '../../../../../../shared/constants/metametrics';
import { MetaMetricsContext } from '../../../../../contexts/metametrics';
import { Content, Footer, Page } from '../../../../multichain/pages/page';
import { formatCurrency } from '../../../../../helpers/utils/confirm-tx.util';
import { getShortDateFormatterV2 } from '../../../../../pages/asset/util';
import { CHAINID_DEFAULT_BLOCK_EXPLORER_URL_MAP } from '../../../../../../shared/constants/common';
import {
  getConversionRate,
  getCurrentCurrency,
} from '../../../../../ducks/metamask/metamask';
import { Numeric } from '../../../../../../shared/modules/Numeric';
// TODO: Remove restricted import
import {
  addUrlProtocolPrefix,
  isWebUrl,
  // eslint-disable-next-line import/no-restricted-paths
} from '../../../../../../app/scripts/lib/util';
import useGetAssetImageUrl from '../../../../../hooks/useGetAssetImageUrl';
import { getImageForChainId } from '../../../../../selectors/multichain';
import useFetchNftDetailsFromTokenURI from '../../../../../hooks/useFetchNftDetailsFromTokenURI';
import NftDetailInformationRow from './nft-detail-information-row';
import NftDetailInformationFrame from './nft-detail-information-frame';
import NftDetailDescription from './nft-detail-description';
import { renderShortTokenId } from './utils';

const MAX_TOKEN_ID_LENGTH = 15;

// TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
// eslint-disable-next-line @typescript-eslint/naming-convention
export function NftDetailsComponent({
  nft,
  nftChainId,
}: {
  nft: Nft;
  nftChainId: string;
}) {
  const {
    image: _image,
    imageOriginal,
    name,
    description,
    address,
    tokenId,
    standard,
    isCurrentlyOwned,
    lastSale,
    collection,
    rarityRank,
    topBid,
    attributes,
    tokenURI,
  } = nft;

  const t = useI18nContext();
  const history = useHistory();
  const dispatch = useDispatch();
  const ipfsGateway = useSelector(getIpfsGateway);
  const currentNetwork = useSelector(getCurrentChainId);
  const currentChain = useSelector(getCurrentNetwork);
  const trackEvent = useContext(MetaMetricsContext);
  const currency = useSelector(getCurrentCurrency);
  const selectedNativeConversionRate = useSelector(getConversionRate);

  const nftNetworkConfigs = useSelector(getNetworkConfigurationsByChainId);
  const nftChainNetwork = nftNetworkConfigs[nftChainId as Hex];
  const { defaultRpcEndpointIndex } = nftChainNetwork;
  const { networkClientId: nftNetworkClientId } =
    nftChainNetwork.rpcEndpoints[defaultRpcEndpointIndex];
  const nftChainImage = getImageForChainId(nftChainId as string);
  const networks = useSelector(getNetworkConfigurationIdByChainId) as Record<
    string,
    string
  >;

  const [addressCopied, handleAddressCopy] = useCopyToClipboard();

  const { image: imageFromTokenURI, name: nameFromTokenURI } =
    useFetchNftDetailsFromTokenURI(tokenURI);

  const nftImageAlt = getNftImageAlt(nft);
  const image = getNftImage(_image);
  const nftSrcUrl = imageOriginal ?? image ?? imageFromTokenURI;
  const isIpfsURL = nftSrcUrl?.startsWith('ipfs:');

  const isImageHosted =
    // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    (image && isWebUrl(image)) ||
    (imageFromTokenURI && isWebUrl(imageFromTokenURI));

  const nftImageURL = useGetAssetImageUrl(
    imageOriginal ?? image ?? undefined,
    ipfsGateway,
  );

  const hasFloorAskPrice = Boolean(
    collection?.floorAsk?.price?.amount?.usd &&
      collection?.floorAsk?.price?.amount?.native,
  );
  const hasLastSalePrice = Boolean(
    lastSale?.price?.amount?.usd && lastSale?.price?.amount?.native,
  );
  const hasOnlyContractAddress =
    !hasLastSalePrice && !hasFloorAskPrice && !rarityRank;

  const getFloorAskSource = () => {
    if (hasFloorAskPrice && Boolean(collection?.floorAsk?.source?.url)) {
      return collection?.floorAsk?.source?.url;
    }
    return undefined;
  };

  const getCurrentHighestBidValue = () => {
    if (
      topBid?.price?.amount?.native &&
      collection?.topBid?.price?.amount?.native
    ) {
      // return the max between collection top Bid and token topBid
      const topBidValue = Math.max(
        topBid?.price?.amount?.native,
        collection?.topBid?.price?.amount?.native,
      );
      const currentChainSymbol = currentChain.ticker;
      return `${topBidValue}${currentChainSymbol}`;
    }
    // return the one that is available
    const topBidValue =
      // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      topBid?.price?.amount?.native ||
      collection?.topBid?.price?.amount?.native;
    if (!topBidValue) {
      return undefined;
    }
    const currentChainSymbol = currentChain.ticker;
    return `${topBidValue}${currentChainSymbol}`;
  };

  const getTopBidSourceDomain = () => {
    return (
      // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      topBid?.source?.url ||
      (collection?.topBid?.sourceDomain
        ? `https://${collection.topBid?.sourceDomain}`
        : undefined)
    );
  };

  const { chainId } = currentChain;

  useEffect(() => {
    trackEvent({
      event: MetaMetricsEventName.NftDetailsOpened,
      category: MetaMetricsEventCategory.Tokens,
      properties: {
        // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
        // eslint-disable-next-line @typescript-eslint/naming-convention
        chain_id: chainId,
      },
    });
  }, [trackEvent, chainId]);

  const onRemove = async () => {
    let isSuccessfulEvent = false;
    try {
      await dispatch(removeAndIgnoreNft(address, tokenId, nftNetworkClientId));
      dispatch(setNewNftAddedMessage(''));
      dispatch(setRemoveNftMessage('success'));
      isSuccessfulEvent = true;
    } catch (err) {
      dispatch(setNewNftAddedMessage(''));
      dispatch(setRemoveNftMessage('error'));
    } finally {
      // track event
      trackEvent({
        event: MetaMetricsEventName.NFTRemoved,
        category: 'Wallet',
        properties: {
          // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
          // eslint-disable-next-line @typescript-eslint/naming-convention
          token_contract_address: address,
          tokenId: tokenId.toString(),
          // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
          // eslint-disable-next-line @typescript-eslint/naming-convention
          asset_type: AssetType.NFT,
          // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
          // eslint-disable-next-line @typescript-eslint/naming-convention
          token_standard: standard,
          // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
          // eslint-disable-next-line @typescript-eslint/naming-convention
          chain_id: currentNetwork,
          isSuccessful: isSuccessfulEvent,
        },
      });
      history.push(DEFAULT_ROUTE);
    }
  };

  const prevNft = usePrevious(nft);
  useEffect(() => {
    if (!isEqual(prevNft, nft)) {
      checkAndUpdateSingleNftOwnershipStatus(nft, nftNetworkClientId);
    }
  }, [nft, nftNetworkClientId, prevNft]);

  const getOpenSeaLink = () => {
    switch (currentNetwork) {
      case CHAIN_IDS.MAINNET:
        return `https://opensea.io/assets/ethereum/${address}/${tokenId}`;
      case CHAIN_IDS.POLYGON:
        return `https://opensea.io/assets/matic/${address}/${tokenId}`;
      case CHAIN_IDS.GOERLI:
        return `https://testnets.opensea.io/assets/goerli/${address}/${tokenId}`;
      case CHAIN_IDS.SEPOLIA:
        return `https://testnets.opensea.io/assets/sepolia/${address}/${tokenId}`;
      default:
        return null;
    }
  };

  const getBoughtForLink = () => {
    const currentSource = lastSale?.orderSource;
    if (currentSource) {
      return addUrlProtocolPrefix(currentSource);
    }
    return null;
  };

  const openSeaLink = getOpenSeaLink();
  const sendDisabled =
    standard !== TokenStandard.ERC721 && standard !== TokenStandard.ERC1155;

  const setCorrectChain = async () => {
    // If we aren't presently on the chain of the nft, change to it
    if (nftChainId !== currentChain.chainId) {
      try {
        const networkConfigurationId = networks[nftChainId as Hex];
        await dispatch(setActiveNetworkWithError(networkConfigurationId));
      } catch (err) {
        console.error(`Failed to switch chains for NFT.
          Target chainId: ${nftChainId}, Current chainId: ${
            currentChain.chainId
          }.
          ${
            // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31893
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            err
          }`);
        throw err;
      }
    }
  };

  const onSend = async () => {
    await setCorrectChain();
    await dispatch(
      startNewDraftTransaction({
        type: AssetType.NFT,
        details: {
          ...nft,
          tokenId: nft.tokenId as unknown as number,
          image: nft.image ?? imageFromTokenURI ?? undefined,
          name: nft.name ?? nameFromTokenURI ?? undefined,
        },
      }),
    );
    // We only allow sending one NFT at a time
    history.push(SEND_ROUTE);
  };

  const getDateCreatedTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return Math.floor(date.getTime() / 1000);
  };

  const getFormattedDate = (dateString: number) => {
    const date = new Date(dateString * 1000).getTime();
    return getShortDateFormatterV2().format(date);
  };

  // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const hasPriceSection = getCurrentHighestBidValue() || lastSale?.timestamp;
  const hasCollectionSection =
    // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    collection?.name || collection?.tokenCount || collection?.creator;
  const hasAttributesSection = attributes && attributes?.length !== 0;

  const blockExplorerTokenLink = (tokenAddress: string) => {
    return getTokenTrackerLink(
      tokenAddress,
      chainId,
      null as unknown as string, // no networkId
      null as unknown as string, // no holderAddress
      {
        blockExplorerUrl:
          CHAINID_DEFAULT_BLOCK_EXPLORER_URL_MAP[chainId] ?? null,
      },
    );
  };

  const handleImageClick = () => {
    return history.push(`${ASSET_ROUTE}/image/${address}/${tokenId}`);
  };

  const getValueInFormattedCurrency = (
    nativeValue: number,
    usdValue: number,
  ) => {
    const numericVal = new Numeric(nativeValue, 16);
    // if current currency is usd or if fetching conversion rate failed then always return USD value
    if (!selectedNativeConversionRate || currency === 'usd') {
      const usdValueFormatted = formatCurrency(usdValue.toString(), 'usd');
      return usdValueFormatted;
    }

    const value = numericVal
      .applyConversionRate(selectedNativeConversionRate)
      .toNumber();

    return formatCurrency(new Numeric(value, 10).toString(), currency);
  };
  // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const nftItemSrc = isImageHosted ? image || imageFromTokenURI : nftImageURL;

  return (
    <Page>
      <Content className="nft-details__content">
        <Box
          display={Display.Flex}
          justifyContent={JustifyContent.spaceBetween}
        >
          <ButtonIcon
            color={IconColor.iconAlternative}
            size={ButtonIconSize.Sm}
            ariaLabel={t('back')}
            iconName={IconName.ArrowLeft}
            onClick={() => history.push(DEFAULT_ROUTE)}
            data-testid="nft__back"
          />
          <NftOptions
            showOpenSeaLink={Boolean(openSeaLink)}
            onViewOnOpensea={() => {
              if (!openSeaLink) {
                return null;
              }
              return global.platform.openTab({ url: openSeaLink });
            }}
            // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31879
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onRemove={onRemove}
          />
        </Box>
        <Box
          display={Display.Flex}
          justifyContent={JustifyContent.center}
          marginBottom={8}
          marginTop={1}
        >
          <Box className="nft-details__nft-item">
            <NftItem
              src={nftItemSrc as string | undefined}
              alt={nftImageAlt}
              networkName={nftChainNetwork.name ?? ''}
              networkSrc={nftChainImage}
              isIpfsURL={isIpfsURL}
              onClick={handleImageClick}
              detailView
              clickable
            />
          </Box>
        </Box>
        <Box>
          {/* TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880 */}
          {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
          {name || collection?.name ? (
            <Box display={Display.Flex} alignItems={AlignItems.center}>
              <Text
                variant={TextVariant.headingSm}
                fontWeight={FontWeight.Medium}
                color={TextColor.textDefault}
                fontStyle={FontStyle.Normal}
                style={{ fontSize: '24px' }}
                data-testid="nft-details__name"
              >
                {/* TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880 */}
                {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
                {name || collection?.name}
              </Text>
              {collection?.openseaVerificationStatus === 'verified' ? (
                <Icon
                  marginLeft={1}
                  name={IconName.SecurityTick}
                  color={IconColor.primaryDefault}
                />
              ) : null}
            </Box>
          ) : null}

          <NftDetailDescription value={description} />

          <Box
            marginTop={4}
            marginBottom={4}
            display={Display.Flex}
            gap={4}
            flexWrap={FlexWrap.Wrap}
          >
            {hasLastSalePrice || hasFloorAskPrice ? (
              <>
                <NftDetailInformationFrame
                  frameClassname="nft-details__nft-frame"
                  title={t('boughtFor')}
                  frameTextTitleProps={{
                    textAlign: TextAlign.Center,
                    color: TextColor.textAlternative,
                    variant: TextVariant.bodyMdMedium,
                  }}
                  frameTextTitleStyle={{
                    fontSize: '12px',
                    lineHeight: '20px',
                  }}
                  value={
                    lastSale?.price?.amount?.usd &&
                    lastSale?.price?.amount?.native
                      ? getValueInFormattedCurrency(
                          lastSale?.price?.amount?.native,
                          lastSale?.price?.amount?.usd,
                        )
                      : t('dataUnavailable')
                  }
                  frameTextValueProps={{
                    color: hasLastSalePrice
                      ? TextColor.textDefault
                      : TextColor.textAlternative,
                    variant: hasLastSalePrice
                      ? TextVariant.headingSm
                      : TextVariant.bodyMdMedium,
                    textAlign:
                      hasLastSalePrice && lastSale?.orderSource
                        ? undefined
                        : TextAlign.Center,
                  }}
                  frameTextValueStyle={{
                    fontSize: hasLastSalePrice ? '16px' : '12px',
                    lineHeight: hasLastSalePrice ? '24px' : '16px',
                  }}
                  icon={
                    lastSale?.orderSource ? (
                      <ButtonIcon
                        size={ButtonIconSize.Sm}
                        padding={2}
                        color={IconColor.iconMuted}
                        onClick={() => {
                          global.platform.openTab({
                            url: getBoughtForLink() as string,
                          });
                        }}
                        iconName={IconName.Export}
                        ariaLabel="redirect"
                      />
                    ) : undefined
                  }
                />
                <NftDetailInformationFrame
                  frameClassname="nft-details__nft-frame"
                  title={t('highestFloorPrice')}
                  frameTextTitleProps={{
                    textAlign: TextAlign.Center,
                    color: TextColor.textAlternative,
                    variant: TextVariant.bodyMdMedium,
                  }}
                  frameTextTitleStyle={{
                    fontSize: '12px',
                    lineHeight: '20px',
                  }}
                  value={
                    collection?.floorAsk?.price?.amount?.usd &&
                    collection?.floorAsk?.price?.amount?.native
                      ? getValueInFormattedCurrency(
                          collection?.floorAsk?.price?.amount?.native,
                          collection?.floorAsk?.price?.amount?.usd,
                        )
                      : t('priceUnavailable')
                  }
                  frameTextValueProps={{
                    color: hasFloorAskPrice
                      ? TextColor.textDefault
                      : TextColor.textAlternative,
                    variant: hasFloorAskPrice
                      ? TextVariant.headingSm
                      : TextVariant.bodyMdMedium,
                    textAlign:
                      hasFloorAskPrice && getFloorAskSource()
                        ? undefined
                        : TextAlign.Center,
                  }}
                  frameTextValueStyle={{
                    fontSize: hasFloorAskPrice ? '16px' : '12px',
                    lineHeight: hasFloorAskPrice ? '24px' : '16px',
                  }}
                  icon={
                    collection?.floorAsk?.source?.url ? (
                      <ButtonIcon
                        size={ButtonIconSize.Sm}
                        padding={2}
                        color={IconColor.iconMuted}
                        onClick={() => {
                          global.platform.openTab({
                            url: collection?.floorAsk?.source?.url as string,
                          });
                        }}
                        iconName={IconName.Export}
                        ariaLabel="redirect"
                      />
                    ) : undefined
                  }
                />
              </>
            ) : null}

            {rarityRank ? (
              <NftDetailInformationFrame
                frameClassname="nft-details__nft-frame"
                title={t('rank')}
                frameTextTitleProps={{
                  textAlign: TextAlign.Center,
                  color: TextColor.textAlternative,
                  variant: TextVariant.bodyMdMedium,
                }}
                frameTextTitleStyle={{
                  fontSize: '12px',
                  lineHeight: '20px',
                }}
                value={`#${rarityRank}`}
                frameTextValueProps={{
                  color: TextColor.textDefault,
                  variant: TextVariant.headingSm,
                  textAlign: TextAlign.Center,
                }}
                frameTextValueStyle={{
                  fontSize: '16px',
                  lineHeight: '24px',
                }}
              />
            ) : null}
            {hasLastSalePrice || hasFloorAskPrice || rarityRank ? (
              <NftDetailInformationFrame
                frameClassname="nft-details__nft-frame"
                title={t('contractAddress')}
                frameTextTitleProps={{
                  textAlign: TextAlign.Center,
                  color: TextColor.textAlternative,
                  variant: TextVariant.bodyMdMedium,
                }}
                frameTextTitleStyle={{
                  fontSize: '12px',
                  lineHeight: '20px',
                }}
                buttonAddressValue={
                  <button
                    className="nft-details__addressButton"
                    onClick={() => {
                      global.platform.openTab({
                        url: blockExplorerTokenLink(address),
                      });
                    }}
                  >
                    <Text
                      color={TextColor.primaryDefault}
                      fontStyle={FontStyle.Normal}
                      variant={TextVariant.bodySmMedium}
                    >
                      {shortenAddress(address)}
                    </Text>
                  </button>
                }
                icon={
                  <ButtonIcon
                    ariaLabel="copy"
                    size={ButtonIconSize.Sm}
                    color={IconColor.primaryDefault}
                    padding={1}
                    data-testid="nft-address-copy"
                    onClick={() => {
                      (handleAddressCopy as (text: string) => void)?.(
                        address || '',
                      );
                    }}
                    iconName={
                      addressCopied ? IconName.CopySuccess : IconName.Copy
                    }
                  />
                }
              />
            ) : null}
          </Box>
          {hasOnlyContractAddress ? (
            <NftDetailInformationRow
              title={t('contractAddress')}
              buttonAddressValue={
                address ? (
                  <button
                    className="nft-details__addressButton"
                    onClick={() => {
                      global.platform.openTab({
                        url: blockExplorerTokenLink(address),
                      });
                    }}
                  >
                    <Text
                      color={TextColor.primaryDefault}
                      fontStyle={FontStyle.Normal}
                      variant={TextVariant.bodySmMedium}
                    >
                      {shortenAddress(address)}
                    </Text>
                  </button>
                ) : null
              }
              valueColor={TextColor.primaryDefault}
              icon={
                <ButtonIcon
                  ariaLabel="copy"
                  size={ButtonIconSize.Sm}
                  color={IconColor.primaryDefault}
                  data-testid="nft-address-copy"
                  onClick={() => {
                    (handleAddressCopy as (text: string) => void)?.(
                      address || '',
                    );
                  }}
                  iconName={
                    addressCopied ? IconName.CopySuccess : IconName.Copy
                  }
                  justifyContent={JustifyContent.flexEnd}
                />
              }
            />
          ) : null}
          <NftDetailInformationRow
            title={t('tokenId')}
            value={renderShortTokenId(tokenId, 5)}
            fullValue={tokenId}
            withPopover={tokenId.length > MAX_TOKEN_ID_LENGTH}
          />
          <NftDetailInformationRow
            title={t('tokenSymbol')}
            value={collection?.symbol}
          />
          <NftDetailInformationRow
            title={t('numberOfTokens')}
            value={collection?.tokenCount}
          />
          <NftDetailInformationRow
            title={t('tokenStandard')}
            value={standard}
          />
          <NftDetailInformationRow
            title={t('dateCreated')}
            value={
              collection?.contractDeployedAt
                ? getFormattedDate(
                    getDateCreatedTimestamp(collection?.contractDeployedAt),
                  )
                : undefined
            }
          />
          {hasPriceSection ? (
            <>
              <Box
                marginTop={4}
                borderColor={BorderColor.borderMuted}
                width={BlockSize.Full}
                style={{
                  height: '1px',
                  borderBottomWidth: 0,
                  borderBottomStyle: 'solid',
                }}
              />
              <Box
                display={Display.Flex}
                justifyContent={JustifyContent.spaceBetween}
                marginTop={4}
              >
                <Text
                  color={TextColor.textDefault}
                  variant={TextVariant.headingSm}
                >
                  {t('price')}
                </Text>
              </Box>
            </>
          ) : null}
          <NftDetailInformationRow
            title={t('lastSold')}
            value={
              lastSale?.timestamp
                ? getFormattedDate(lastSale?.timestamp)
                : undefined
            }
            icon={
              lastSale?.orderSource ? (
                <ButtonIcon
                  size={ButtonIconSize.Sm}
                  color={IconColor.iconMuted}
                  onClick={() => {
                    global.platform.openTab({
                      url: getBoughtForLink() as string,
                    });
                  }}
                  iconName={IconName.Export}
                  justifyContent={JustifyContent.flexEnd}
                  ariaLabel="export"
                />
              ) : undefined
            }
          />
          <NftDetailInformationRow
            title={t('highestCurrentBid')}
            value={getCurrentHighestBidValue()}
            icon={
              getTopBidSourceDomain() ? (
                <ButtonIcon
                  size={ButtonIconSize.Sm}
                  color={IconColor.iconMuted}
                  onClick={() => {
                    global.platform.openTab({
                      url: getTopBidSourceDomain() as string, // Adding cast here because verification has been done on line 594
                    });
                  }}
                  iconName={IconName.Export}
                  justifyContent={JustifyContent.flexEnd}
                  ariaLabel="redirect"
                />
              ) : undefined
            }
          />
          {hasCollectionSection ? (
            <>
              <Box
                marginTop={4}
                borderColor={BorderColor.borderMuted}
                width={BlockSize.Full}
                style={{
                  height: '1px',
                  borderBottomWidth: 0,
                  borderBottomStyle: 'solid',
                }}
              />
              <Box
                display={Display.Flex}
                justifyContent={JustifyContent.spaceBetween}
                marginTop={4}
              >
                <Text
                  color={TextColor.textDefault}
                  variant={TextVariant.headingSm}
                >
                  {t('notificationItemCollection')}
                </Text>
              </Box>
            </>
          ) : null}
          <NftDetailInformationRow
            title={t('collectionName')}
            value={collection?.name}
          />
          <NftDetailInformationRow
            title={t('tokensInCollection')}
            value={collection?.tokenCount}
          />
          <NftDetailInformationRow
            title={t('creatorAddress')}
            buttonAddressValue={
              collection?.creator ? (
                <button
                  className="nft-details__addressButton"
                  onClick={() => {
                    global.platform.openTab({
                      url: getAccountLink(
                        collection?.creator as string,
                        chainId,
                      ),
                    });
                  }}
                >
                  <Text
                    color={TextColor.primaryDefault}
                    fontStyle={FontStyle.Normal}
                    variant={TextVariant.bodySmMedium}
                  >
                    {shortenAddress(collection?.creator)}
                  </Text>
                </button>
              ) : null
            }
            valueColor={TextColor.primaryDefault}
            icon={
              <ButtonIcon
                ariaLabel="copy"
                size={ButtonIconSize.Sm}
                color={IconColor.primaryDefault}
                data-testid="nft-address-copy"
                onClick={() => {
                  (handleAddressCopy as (text: string) => void)?.(
                    // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    collection?.creator || '',
                  );
                }}
                iconName={addressCopied ? IconName.CopySuccess : IconName.Copy}
                justifyContent={JustifyContent.flexEnd}
              />
            }
          />
          {hasAttributesSection ? (
            <>
              <Box
                marginTop={4}
                borderColor={BorderColor.borderMuted}
                width={BlockSize.Full}
                style={{
                  height: '1px',
                  borderBottomWidth: 0,
                  borderBottomStyle: 'solid',
                }}
              />
              <Box
                display={Display.Flex}
                justifyContent={JustifyContent.spaceBetween}
                marginTop={4}
              >
                <Text
                  color={TextColor.textDefault}
                  variant={TextVariant.headingSm}
                >
                  {t('attributes')}
                </Text>
              </Box>
            </>
          ) : null}
          <Box
            marginTop={2}
            display={Display.Flex}
            gap={2}
            flexWrap={FlexWrap.Wrap}
          >
            {' '}
            {attributes?.map((elm, idx) => {
              const { key, value } = elm;
              return (
                <NftDetailInformationFrame
                  key={`${key}-${value}-${idx}`}
                  frameClassname="nft-details__nft-attribute-frame"
                  title={key}
                  frameTextTitleProps={{
                    color: TextColor.textAlternative,
                    variant: TextVariant.bodyMdMedium,
                  }}
                  frameTextTitleStyle={{
                    fontSize: '16px',
                    lineHeight: '24px',
                  }}
                  value={value}
                  frameTextValueProps={{
                    color: TextColor.textDefault,
                    variant: TextVariant.bodyMdMedium,
                  }}
                  frameTextValueStyle={{
                    fontSize: '16px',
                  }}
                />
              );
            })}
          </Box>
          <Box>
            <Text
              color={TextColor.textAlternative}
              variant={TextVariant.bodyXs}
            >
              {t('nftDisclaimer')}
            </Text>
          </Box>
        </Box>
      </Content>
      {isCurrentlyOwned === true ? (
        <Footer className="nft-details__content">
          <ButtonPrimary
            // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31879
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={onSend}
            disabled={sendDisabled}
            size={ButtonPrimarySize.Lg}
            block
            data-testid="nft-send-button"
          >
            {t('send')}
          </ButtonPrimary>
          {sendDisabled ? (
            <InfoTooltip position="top" contentText={t('sendingDisabled')} />
          ) : null}
        </Footer>
      ) : null}
    </Page>
  );
}

// TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
// eslint-disable-next-line @typescript-eslint/naming-convention
function NftDetails({ nft }: { nft: Nft }) {
  const { chainId } = useParams();

  return <NftDetailsComponent nft={nft} nftChainId={chainId ?? ''} />;
}

export default NftDetails;
