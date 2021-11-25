import { getKlayFromAddress } from '@/helpers/klaymint.api';
import { setWallet } from '@/redux/reducers/Wallet.reducer';
import { prepare, request, getResult, getCardList } from 'klip-sdk';
import KlayMint from '@/helpers/linkBlockchainNetwork';
import { ModalButton } from '@/_components/commons/modals';
import cx from 'classnames';
import css from '@/pages/_layouts/_layout.module.scss';
import React from 'react';

import { remoteWizardOpener } from '@/_components/commons/wizard';

/* 비동기 요청을 모두 promise 객체로 만든 뒤 promise all 로 한번에 실행, **순서 뒤죽박죽** */
export const setPromiseAll = async (dna, callback) => {
    const promises = dna.map(callback);
    await Promise.all(promises);
};

/* klay -> Peb */
export const toPebFromKlay = (caver, price): string => {
    return caver.utils.convertToPeb(price + '', 'KLAY');
};

/* Peb -> klay */
export const toKlayFromPeb = (caver, peb): number => {
    return +caver.utils.fromPeb(peb, 'KLAY');
};

export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getBackgroundColor = (attr, background?) => {
    const style = {
        color: undefined,
        border: undefined,
    };

    switch (attr) {
        case 'Normal':
            if (background) style.border = '1.5px solid #c6c6c6';
            else style.color = '#c6c6c6';
            break;
        case 'Uncommon':
            if (background) style.border = '1.5px solid #f4f4f4';
            else style.color = '#f4f4f4';
            break;
        case 'Rare':
            if (background) style.border = '1.5px solid #27e1d5';
            else style.color = '#27e1d5';
            break;
        case 'Unique':
            if (background) style.border = '1.5px solid #ff0ff5';
            else style.color = '#ff0ff5';
            break;
        case 'Legendary':
            if (background) style.border = '1.5px solid #f6c019';
            else style.color = '#f6c019';
            break;
        case 'Myth':
            if (background) style.border = '1.5px solid #f72919';
            else style.color = '#f72919';
            break;
        default:
            style.color = undefined;
            break;
    }

    return style;
};

/* mobile deepLink 로 연결됬을 때 실행되는 polling interval 함수 */
export const makeMobilePolling = (wallet, res, Lang, dispatch, closeModal, contractInfo, list) => {
    const mobilePolling = setInterval(async () => {
        try {
            const data = await getResult(res.request_key);

            if (data.status === 'completed') {
                const balance = await getKlayFromAddress(wallet.info.address);

                if (res.err) {
                    console.log(res.err);

                    clearInterval(mobilePolling);

                    remoteWizardOpener('trade_chk_stepwizard');
                    closeModal ? closeModal(false) : null;
                    window?.toast('success', Lang.err);
                }

                if (data.result) {
                    const klaymint = new KlayMint(contractInfo.contract_address, contractInfo.factory_address, list);
                    klaymint.getToken(wallet, list).then(async (tokens) => {
                        await dispatch(
                            setWallet({
                                isConn: true,
                                type: 'klip',
                                info: {
                                    ...wallet.info,
                                    address: wallet.info.address,
                                    balance: balance.data,
                                    myToken: {
                                        ...wallet.info.myToken,
                                        unlisted: tokens.unlisted,
                                        onSale: tokens.onSale,
                                    },
                                },
                            }),
                        );

                        /* 유효 기간 */
                        clearInterval(mobilePolling);

                        closeModal ? closeModal(false) : null;
                        window?.toast('success', Lang.suc);
                    });
                }
            }
        } catch (e) {
            console.error(e);
            window?.toast('error', Lang.err);
        } finally {
        }
    }, 1000);
};

/* mobile deepLink 로 연결됬을 때 실행되는 approved polling interval 함수 */
export const makeMobileApprovedPolling = (wallet, res, Lang, dispatch, executeData, closeModal, contractInfo, list) => {
    const apporvedPolling = setInterval(async () => {
        try {
            const data = await getResult(res.request_key);

            if (data.status === 'completed') {
                if (res.err) {
                    console.log('sell error');
                    console.log(res.err);

                    clearInterval(apporvedPolling);

                    remoteWizardOpener('trade_chk_stepwizard');
                    closeModal ? closeModal(false) : null;
                    window?.toast('success', Lang.err_msg_sucs_sell_approved_klip);
                }

                if (data.result) {
                    console.log(executeData);
                    console.log('마지막 sell check 하는곳');
                    window?.toast('success', Lang.suc_msg_sucs_sell_approved_klip);
                    clearInterval(apporvedPolling);

                    const sellRes = await prepare.executeContract({ ...executeData });

                    makeMobilePolling(
                        wallet,
                        sellRes,
                        { err: Lang.err_msg_sucs_sell_klip, suc: Lang.suc_msg_sucs_sell_klip },
                        dispatch,
                        closeModal,
                        contractInfo,
                        list,
                    );
                }
            }
        } catch (e) {
            console.error(e);
            window?.toast('error', Lang.err_msg_sucs_sell_approved_klip);
        } finally {
        }
    }, 1000);
};
