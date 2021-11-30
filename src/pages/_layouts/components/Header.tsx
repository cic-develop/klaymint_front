import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { prepare, request, getResult, getCardList } from 'klip-sdk';
import cx from 'classnames';
import css from './../_layout.module.scss';

import QRCode from 'qrcode';

import { useLanguages } from '@/hooks/useLanguages.hook';
import usePreventLeave from '@/hooks/usePreventLeave.hook';
import { copyToClipboard } from '@/helpers/common.helper';

import { autologin, setModal } from '@/redux/reducers/GlobalStatus.reducer';
import {
    saveWallet,
    loadWallet,
    setWallet,
    setAddress,
    setNetwork,
    resetWallet,
    changeKlaytnWallet,
    updateKlaytnBalance,
} from '@/redux/reducers/Wallet.reducer';
import { RootState } from '@/redux/connectors.redux';

import { ModalButton, Modal, remoteModalOpener, remoteCollapseOpener } from '@/_components/commons/modals';
import { BtnStrLanguages } from '@/_components/commons/buttons/BtnLanguages';
import BtnMyProfile from '@/pages/_layouts/components/BtnMyProfile';
import Secure from '@/_components/commons/Secure';
import Timer from './Timer';
import { makeMobilePolling, toKlayFromPeb } from '@/helpers/_common';
import { enNode, myBAppName } from '@/helpers/_common.linkChain';
import { getKlayFromAddress } from '@/helpers/klaymint.api';

import iconKlip from '@/_statics/images/icon_klip.svg';
import iconKlip_W from '@/_statics/images/icon_klip_w.png';
import iconKaikas from '@/_statics/images/icon_kaikas.png';
import logo from '@/_statics/images/mint-logo.png';

import iconKakao from '@/_statics/images/KakaoTalk_icon_256.png';
import iconRG from '@/_statics/images/KakaoTalk_rg_256.png';
import iconScan from '@/_statics/images/KakaoTalk_scan_256.png';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

const Header: React.FC<any> = (props): JSX.Element => {
    const adressStrRef = useRef(null);
    const closeConnectModalRef = useRef(null); //connect Modal
    const closeLoadingModalRef = useRef(null);
    const closeConnectKlipModalRef = useRef(null);
    const qrCanvasRef = useRef(null);
    const dispatch = useDispatch();
    const Lang = useLanguages();

    /**
     * 새로고침 또는 페이지 이동 발생시 redux Store에 있는 유저정보를
     * sessionStorage에 임시 저장
     * */
    const { enablePrevent, disablePrevent } = usePreventLeave(() => {
        dispatch(saveWallet(wallet));
    });

    const { autoconn, mobile } = useSelector((store: RootState) => store.GlobalStatus);
    const wallet = useSelector((store: RootState) => store.Wallet);

    const [_autoconn, setAutoconn] = useState<boolean>(autoconn);
    const [qrcord, toggleQRCORD] = useState<boolean>(false);

    const [expireKlipTime, setExpireKlipTime] = useState(0);

    /**
     * 지갑 주소 복사하기 핸들러
     */
    const copyToClipboardHandler = (data: string): void => {
        copyToClipboard(data);
        window.toast('info', Lang.inf_msg_copy_to_clipboard);
    };

    /**
     * KAIKAS 연결 핸들러
     */
    const connectKaikasHandler = async () => {
        //closeConnectModalRef.current.click();

        //기존 로그인 정보가 Klip이라면 kaikas 로그인을 하지 않음
        const lastType = sessionStorage.getItem('klmin_lt');
        if (lastType === 'klip') return;

        const { klaytn, caver } = window;

        toggleQRCORD(false);

        // Kaika가 설치 되어 있을때...
        if (klaytn) {
            try {
                await klaytn.enable();

                await dispatch(
                    setWallet({
                        isConn: await klaytn._kaikas.isUnlocked(),
                        type: 'kaikas',
                        info: {
                            ...wallet.info,
                            name: 'My Wallet',
                            address: klaytn.selectedAddress,
                            //balance: klayBalance,
                            network: klaytn.networkVersion,
                            expire: null,
                        },
                    }),
                );

                await dispatch(updateKlaytnBalance());

                dispatch(autologin(true));
                sessionStorage.removeItem('klmin_lt');
                window.toast('success', Lang.suc_msg_sucs_connect_kaikas);
            } catch (error) {
                console.error(error);
                window?.toast('error', Lang.err_msg_fail_connect_kaikas);
            }
        } else {
            // Kaikas가 설치되어 있지 않을 때...
            window?.toast('error', Lang.err_msg_need_kaikas);
            window.open('https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi');

            console.error('Non-Kaikas browser detected. You should consider trying Kaikas!');
        }

        setTimeout(() => {
            closeLoadingModalRef.current.click();
        }, 1000);
    };

    /**
     * KLIP 연결 핸들러
     */
    const connectKlipHandler = async () => {
        closeConnectModalRef.current.click();
        const bappName = myBAppName;
        const successLink = '#';
        const failLink = '#';

        const res = await prepare.auth({ bappName, successLink, failLink });
        if (res.err) {
            // 에러 처리} else
        }

        if (res.request_key) {
            const date = new Date();
            setExpireKlipTime(Math.floor((res.expiration_time * 1000 - date.getTime()) / 1000));
        }

        const IorA = navigator.userAgent.toLowerCase();

        if (IorA.indexOf('android') !== -1 || IorA.indexOf('iphone') !== -1) {
            request(res.request_key, () => alert(Lang.alert_please_excuting_mobile));
            const mobilePolling = setInterval(async () => {
                try {
                    const data = await getResult(res.request_key);

                    if (data.status === 'completed') {
                        const balance = await getKlayFromAddress(data.result.klaytn_address);

                        if (data.result) {
                            await dispatch(
                                setWallet({
                                    isConn: true,
                                    type: 'klip',
                                    info: {
                                        ...wallet.info,
                                        name: 'My Wallet',
                                        address: data.result.klaytn_address,
                                        balance: balance.data,
                                        expire: res.expiration_time * 1000,
                                    },
                                }),
                            );

                            await dispatch(autologin(true));

                            /* 유효 기간 */
                            clearInterval(mobilePolling);

                            window?.toast('success', Lang.suc_msg_sucs_connect_klip);
                            sessionStorage.setItem('klmin_lt', 'klip');
                            closeConnectModalRef.current.click();
                            closeConnectKlipModalRef.current.click();
                        }
                    }
                } catch (e) {
                    console.error(e);
                    window?.toast('error', Lang.err_msg_fail_connect_klip);
                    closeConnectKlipModalRef.current.click();
                } finally {
                }
            }, 1000);
        } else {
            // pc catch
            toggleQRCORD(true);
            await QRCode.toCanvas(
                qrCanvasRef.current,
                `https://klipwallet.com/?target=/a2a?request_key=${res.request_key}`,
                () => {
                    const polling = setInterval(async () => {
                        try {
                            const data = await getResult(res.request_key);

                            if (data.status === 'completed') {
                                const date = new Date();
                                toggleQRCORD(false);

                                setTimeout(() => {
                                    window?.toast('noti', Lang.inf_msg_expires_in_one_minute);
                                }, res.expiration_time * 1000 - date.getTime() - 60000);

                                setTimeout(() => {
                                    dispatch(resetWallet());
                                    window?.toast('alert', Lang.inf_msg_expires_in_disconnect);
                                }, res.expiration_time * 1000 - date.getTime());

                                const balance = await getKlayFromAddress(data.result.klaytn_address);

                                if (data.result) {
                                    await dispatch(
                                        setWallet({
                                            isConn: true,
                                            type: 'klip',
                                            info: {
                                                ...wallet.info,
                                                name: 'My Wallet',
                                                address: data.result.klaytn_address,
                                                balance: balance.data,
                                                expire: res.expiration_time * 1000,
                                            },
                                        }),
                                    );
                                    await dispatch(autologin(true));

                                    /* 유효 기간 */
                                    clearInterval(polling);

                                    window?.toast('success', Lang.suc_msg_sucs_connect_klip);
                                    closeConnectModalRef.current.click();
                                    closeConnectKlipModalRef.current.click();
                                }
                            }
                        } catch (e) {
                            console.error(e);
                            window?.toast('error', Lang.err_msg_fail_connect_klip);
                            closeConnectKlipModalRef.current.click();
                        } finally {
                        }
                    }, 1000);
                },
            );
        }
    };

    /**
     * 지갑 연결 해제
     */
    const disconnectWallet = () => {
        if (!confirm(Lang.header_disconn_wallet_Questions)) return;
        dispatch(resetWallet());
        dispatch(autologin(false));
        sessionStorage.removeItem('klmin_lt');
        window?.toast('error', Lang.header_disconn_wallet);
    };

    useEffect(() => {
        const { klaytn, caver } = window;

        if (klaytn) {
            if (wallet.type === 'kaikas') {
                klaytn._kaikas
                    .isUnlocked()
                    .then((res) => {
                        if (!res) {
                            dispatch(resetWallet());
                        }
                    })
                    .catch((err) => {
                        console.log(wallet.type, err);
                    });
            }

            klaytn.on('accountsChanged', async (account) => {
                if (wallet.type === 'klip') return;
                console.log('check accountsChanged', wallet.type);

                dispatch(
                    changeKlaytnWallet({
                        address: account[0],
                    }),
                );
                dispatch(updateKlaytnBalance());
            });

            klaytn.on('networkChanged', async (network) => {
                if (wallet.type === 'klip') return;
                console.log('check networkChanged', wallet.type);

                if (network === 1001 || network === '1001') {
                    console.error('test network : ', network);
                    window?.toast('error', Lang.err_msg_fail_do_not_test_network);
                    return;
                }

                dispatch(
                    changeKlaytnWallet({
                        network: network,
                    }),
                );
                dispatch(updateKlaytnBalance());
            });
        }

        //새로고침시 지갑 정보 저장 이밴트 핸들러 시작
        enablePrevent();

        //새로고침시 지갑 정보 저장 이밴트 핸들러 종료
        return () => {
            console.log('disable Restore Wallat Data');
            disablePrevent();
        };
    }, []);

    return (
        <div className={cx('position-absolute top-0 start-0 p-3', css.headerSection)}>
            <header className="blog-header position-relective top-0 start-0">
                {mobile ? (
                    <>
                        {/* 모바일일때 Header 버튼 */}
                        <nav className="navbar navbar-dark p-0 m-0">
                            <div className="col-12 d-flex justify-content-between">
                                <Link to={'/'}>
                                    <img className="py-2" src={logo} width={128} />
                                </Link>
                                <div className="d-flex justify-content-end align-items-center">
                                    <BtnStrLanguages />

                                    <div className="dropdown">
                                        <button
                                            className="border-0"
                                            type="button"
                                            id="mToggleBurger"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <span className="navbar-toggler-icon"></span>
                                        </button>
                                        <ul
                                            className={cx('dropdown-menu dropdown-menu-end', css.burgerDropMenu)}
                                            aria-labelledby="mToggleBurger"
                                        >
                                            {wallet?.type === 'none' ? ( //지갑 연결 안되어 있을때.
                                                <li
                                                    className="dropdown-item bg-dark text-white justify-content-end"
                                                    onClick={() => remoteModalOpener('conn_modal')}
                                                >
                                                    <button type="button" className="border-0 text-white">
                                                        <i className="fas fa-wallet" />
                                                        <b> {Lang.header_conn_wallet}</b>
                                                    </button>
                                                </li>
                                            ) : (
                                                <>
                                                    <li className="dropdown-item bg-dark text-white justify-content-end">
                                                        <div className="d-flex justify-content-between" role="group">
                                                            {/**************** 지갑 주소 복사 ****************/}
                                                            <button
                                                                className="btn loginWalletBtn"
                                                                onClick={() =>
                                                                    copyToClipboardHandler(wallet.info.address)
                                                                }
                                                            >
                                                                <i className="far fa-copy" />{' '}
                                                                <span ref={adressStrRef}>
                                                                    {wallet.info.address.slice(0, 8)}...{' '}
                                                                </span>
                                                            </button>
                                                            {/**************** 코인 갯수 ****************/}
                                                            <button className="btn loginWalletBtn">
                                                                {wallet.type === 'kaikas' && (
                                                                    <>
                                                                        <img
                                                                            src={iconKaikas}
                                                                            width="16px"
                                                                            height="16px"
                                                                        />{' '}
                                                                        {wallet.info.balance}
                                                                    </>
                                                                )}
                                                                {wallet.type === 'klip' && (
                                                                    <img src={iconKlip_W} width="25px" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </li>
                                                    <Link className="dropdown-item text-white" to="/myPage">
                                                        {/* 마이페이지 버튼 */}
                                                        <i className={'fas fa-id-card'} /> {Lang.header_my_page}
                                                    </Link>
                                                </>
                                            )}
                                            <Link className="dropdown-item text-white" to="/collections">
                                                {/* 마이페이지 버튼 */}
                                                <i className={'fas fa-trophy'} /> {Lang.header_menu1}
                                            </Link>
                                            <Link className="dropdown-item text-white" to="/helpCenter">
                                                {/* 마이페이지 버튼 */}
                                                <i className={'fas fa-question-circle'} /> {Lang.header_menu3}
                                            </Link>
                                            {wallet?.type !== 'none' && (
                                                <button
                                                    className="dropdown-item text-white"
                                                    onClick={() => {
                                                        disconnectWallet();
                                                    }}
                                                >
                                                    {/* 지갑 연결 해제 (Store 초기화) */}
                                                    <i className={'fas fa-unlock-alt'} /> {Lang.header_disconn_wallet}
                                                </button>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </>
                ) : (
                    <div className="row d-flex justify-content-start m-0">
                        {/* ********************************* 메인 로고 ********************************* */}
                        <div className="col-12 col-md-3 d-flex justify-content-between">
                            <Link to={'/'}>
                                <img className="py-2" src={logo} />
                            </Link>
                        </div>
                        {/* ********************************* 메인 메뉴 라인 ********************************* */}
                        {!mobile && (
                            <div className="col-12 col-md-5 d-flex align-items-center justify-content-between">
                                <Link className="link-secondary" to="#"></Link>

                                <Link
                                    className={cx('p-2 link-secondary rounded', css.headerMainMenus)}
                                    to="/collections"
                                >
                                    <i className="fas fa-trophy" /> {Lang.header_menu1}
                                </Link>

                                {/* <Link className={cx('p-2 link-secondary rounded', css.headerMainMenus)} to="#">
                        <i className="fas fa-align-justify" /> {Lang.header_menu2}
                        </Link> */}

                                <Link
                                    className={cx('p-2 link-secondary rounded', css.headerMainMenus)}
                                    to="/helpCenter"
                                >
                                    <i className="fas fa-question-circle" /> {Lang.header_menu3}
                                </Link>

                                {wallet?.type !== 'none' && (
                                    <Link
                                        className={cx('p-2 link-secondary rounded', css.headerMainMenus)}
                                        to="/myPage"
                                    >
                                        {/* 마이페이지 버튼 */}
                                        <i className={'fas fa-id-card'} /> {Lang.header_my_page}
                                    </Link>
                                )}
                            </div>
                        )}
                        {/* ********************************* 지갑 연결 & 마이 메뉴 ********************************* */}
                        <div className="col-12 col-md-4 d-flex justify-content-end m-0 p-0">
                            {wallet?.type === 'none' ? ( //case by Wallet Type
                                // kaikas에 로그인
                                <ModalButton
                                    className={cx('btn btn-outline-secondary me-2', css.headerModalButton)}
                                    id="conn_modal"
                                >
                                    <i className="fas fa-wallet" />
                                    <b> {Lang.header_conn_wallet}</b>
                                </ModalButton>
                            ) : (
                                <>
                                    <div className="btn-group btn-group-sm" role="group">
                                        <div className="btn-group btn-group-sm" role="group">
                                            {/**************** 지갑 주소 복사 ****************/}
                                            <button
                                                className="btn loginWalletBtn"
                                                onClick={() => copyToClipboardHandler(wallet.info.address)}
                                            >
                                                <i className="far fa-copy" />{' '}
                                                <span ref={adressStrRef}>
                                                    {wallet.info.address ? (
                                                        wallet.info.address.slice(0, 8)
                                                    ) : (
                                                        <div className="spinner-border text-light" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    )}{' '}
                                                </span>
                                            </button>
                                            {/**************** 코인 갯수 ****************/}
                                            <button className="btn loginWalletBtn">
                                                {wallet.type === 'kaikas' && (
                                                    <>
                                                        <img src={iconKaikas} width="16px" height="16px" />{' '}
                                                        {wallet.info.balance}
                                                    </>
                                                )}
                                                {wallet.type === 'klip' && <img src={iconKlip_W} width="25px" />}
                                            </button>
                                            <button className="btn loginWalletBtn" onClick={disconnectWallet}>
                                                {/* 지갑 연결 해제 (Store 초기화) */}
                                                <i className={'fas fa-unlock-alt'} /> {Lang.header_disconn_wallet}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                            <BtnStrLanguages />
                        </div>
                    </div>
                )}
            </header>

            {/* *********************************************************************************************** */}
            {/* **************************************** Connect Modal **************************************** */}
            {/* *********************************************************************************************** */}

            <Modal id="conn_modal" closeHold={true}>
                {/* <div className={cx('modal-header', css.modalHeaderContainer)}>
                    <h5 className="modal-title" id="conn_modal_area">
                        {Lang.header_modal_conn_title}
                    </h5>
                </div> */}
                <div className="d-flex justify-content-end mt-3 mx-3">
                    <button
                        ref={closeConnectModalRef}
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div className={cx('modal-body', css.modalBodyContainer)}>
                    <div className="row m-3">
                        {/* PC 화면일 때 */}
                        {!mobile && (
                            <>
                                <ModalButton
                                    id="modalLoading"
                                    modalKlip
                                    type="button"
                                    className={cx('col-md-12 btn py-2 mb-3 fw-bold', css.kaiasButton)}
                                    onClick={connectKaikasHandler}
                                >
                                    <img src={iconKaikas} width="25px" /> {Lang.header_modal_conn_kaikas}
                                </ModalButton>

                                <hr className="mt-3" />
                            </>
                        )}
                        {/* 모바일 화면일 때 */}
                        <div className="col-12 p-0 mb-0 text-center">
                            <p className="pt-1 pb-3 text-black">{Lang.header_modal_conn_desciption}</p>

                            <ModalButton
                                id="modalKlip"
                                type="button"
                                className={cx('col-12 fw-bold btn py-3 mb-2', css.klipButton)}
                                onClick={connectKlipHandler}
                            >
                                <img src={iconKlip} width="25px" /> {Lang.header_modal_conn_klip}
                            </ModalButton>
                            <a
                                className="col-12 py-2 fw-lighter"
                                href="https://www.kakaocorp.com/page/service/service/Klip"
                                target="_blank"
                            >
                                {Lang.header_modal_conn_klip_notice} <i className="fas fa-chevron-right" />
                            </a>
                        </div>
                    </div>
                    {/* 자동 로그인 */}
                    {/* <div className="d-flex justify-content-end bd-highlight mb-3">
                        <div className="p-2">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="togAutoConn"
                                    defaultChecked={autoconn}
                                    onChange={(e) => {
                                        console.log(e.target.checked);
                                        setAutoconn(e.target.checked);
                                        dispatch(autologin(e.target.checked));
                                    }}
                                />
                                <label className="form-check-label text-black" htmlFor="togAutoConn">
                                    {Lang.header_modal_auto_conn_wallet}
                                </label>
                            </div>
                        </div>
                    </div> */}
                </div>
            </Modal>

            {/* *********************************************************************************************** */}
            {/* **************************************** Loading Modal **************************************** */}
            {/* *********************************************************************************************** */}

            <Modal className="text-center" id="modalLoading" closeHold={true}>
                <div className="d-flex justify-content-end mt-3 mx-3">
                    <button
                        ref={closeLoadingModalRef}
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div className={cx('modal-body', css.modalBodyContainer)}>
                    <div className="row align-items-center">
                        <div className="col-12">
                            <img width={24} src={iconKaikas} /> {Lang.header_modal_loading_title}
                        </div>
                        <div className="col-12 mt-3">
                            <div className="spinner-border m-3" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="modal-footer">
                    <div className="col-12">{Lang.header_modal_loading_description}</div>
                </div> */}
            </Modal>

            {/* *********************************************************************************************** */}
            {/* ************************************* KLIP Connect Modal ************************************** */}
            {/* *********************************************************************************************** */}

            <Modal className="text-center" id="modalKlip" closeHold={true}>
                <div className={cx('modal-body', css.modalKlipBodyContainer)}>
                    <div className="d-flex justify-content-end">
                        <button
                            ref={closeConnectKlipModalRef}
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-12 fw-bold ">
                            <img className="mx-2" width={45} src={iconKlip} /> {Lang.header_modal_klip_title}
                        </div>
                        <div className="d-flex justify-content-center bd-highlight my-3">
                            {/* QR Code */}

                            {qrcord ? (
                                <div className="p-2 bd-highlight">
                                    <canvas id="canvas" ref={qrCanvasRef} />
                                    <Timer className="mt-1" time={expireKlipTime} />
                                </div>
                            ) : (
                                <div className="spinner-border m-3" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            )}
                        </div>
                        <div className={cx('col-12 fw-lighter', css.klipConnDescription)}>
                            {Lang.header_modal_klip_description}
                        </div>
                    </div>
                </div>
                <div className="modal-footer justify-content-center p-3">
                    <div>
                        <img className="rounded-circle" width={32} src={iconKakao} />
                        <p className={cx('mt-2', css.smallFontSize)}>{Lang.header_modal_klip_footer_desc1}</p>
                    </div>
                    <div className="mx-3">
                        <i className="fas fa-arrow-right" />
                    </div>
                    <div>
                        <img className="rounded-circle" width={32} src={iconRG} />
                        <p className={cx('mt-2', css.smallFontSize)}>{Lang.header_modal_klip_footer_desc2}</p>
                    </div>
                    <div className="mx-3">
                        <i className="fas fa-arrow-right" />
                    </div>
                    <div>
                        <img className="rounded-circle" width={32} src={iconScan} />
                        <p className={cx('mt-2', css.smallFontSize)}>{Lang.header_modal_klip_footer_desc3}</p>
                    </div>

                    {/* {Lang.header_modal_loading_description} */}
                </div>
            </Modal>
        </div>
    );
};

export default Header;
