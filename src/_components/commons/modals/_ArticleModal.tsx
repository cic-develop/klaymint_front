import React, { useState, useRef, useEffect } from 'react';
import css from './_ArticleModal.module.scss';

import { ArticleModalProps } from '@/_components/commons/modals/_ArticleModal.interfaces.declare';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';
import { getResult } from 'klip-sdk';

import { Link } from 'react-router-dom';
import iconKaikas from '@/_statics/images/icon_kaikas.png';

import cx from 'classnames';
import QRCode from 'qrcode';
import { useLanguages } from '@/hooks/useLanguages.hook';
import { setToken } from '@/redux/reducers/Wallet.reducer';
import KlayMint from '@/helpers/linkBlockchainNetwork';
import { setKlipQR } from '@/redux/reducers/GlobalStatus.reducer';
import { getIsClassColor, getSalesHistory } from '@/helpers/klaymint.api';
import LastPriceHistoryModal from '@/pages/CollectionsDetail/components/Article.DetailModal.LastPriceHistoryModal';
import _SalesHisotryModal from '@/_components/commons/modals/_SalesHisotryModal';
import { capitalize, getBackgroundColor } from '@/helpers/_common';
import { Wizard, StepWizard, WizardButton, remoteWizardOpener } from '@/_components/commons/wizard';
import { numberWithCommas } from '@/helpers/common.helper';
import { ModalButton, remoteModalOpener } from '@/_components/commons/modals/index';
import { numOnlyTwoDecimal } from '@/helpers/validate.helper';
import ShowMoreText from 'react-show-more-text';

import Leg1 from '@/_statics/images/border/Legendary_Decorations_1.png';
import Leg2 from '@/_statics/images/border/Legendary_Decorations_2.png';
import Leg3 from '@/_statics/images/border/Legendary_Decorations_3.png';
import Leg4 from '@/_statics/images/border/Legendary_Decorations_4.png';
import Myth1 from '@/_statics/images/border/Myth_Decorations_1.png';
import Myth2 from '@/_statics/images/border/Myth_Decorations_2.png';
import Myth3 from '@/_statics/images/border/Myth_Decorations_3.png';
import Myth4 from '@/_statics/images/border/Myth_Decorations_4.png';
import Uni1 from '@/_statics/images/border/Unique_Decorations_1.png';
import Uni2 from '@/_statics/images/border/Unique_Decorations_2.png';
import Uni3 from '@/_statics/images/border/Unique_Decorations_3.png';
import Uni4 from '@/_statics/images/border/Unique_Decorations_4.png';

const _ArticleModal = ({ collection, props, setModal, style }: ArticleModalProps): JSX.Element => {
    const dispatch = useDispatch();
    const Lang = useLanguages();
    // console.log(renderBorderImage('Unique'));

    const wallet = useSelector((store: RootState) => store.Wallet);
    const { list } = useSelector((store: RootState) => store.Collections);
    const klaymint = new KlayMint(collection?.contract_address, collection?.factory_address, list);
    const { klipQR, breakpoint } = useSelector((store: RootState) => store.GlobalStatus);
    const mobileSizeEx = ['xs', 'md', 'sm'];

    /**
     * QR canvas ref
     **/
    const canvasRef = useRef(null);
    const approvedCanvasRef = useRef(null);

    /**
     * QR canvas 를 2개인 경우 다음 QR로 넘겨지는 page state,
     **/
    const [currentCanvasPage, setCurrentCanvasPage] = useState(1);

    /**
     * sellRequest modal 인 경우 price input state
     **/
    const [price, setPrice] = useState('');

    /**
     * _Article 안에 또 다른 모달을 열어야 하는 경우 state 값들
     **/
    const [childModal, setChildModal] = useState(false);
    const [modalProps, setModalProps] = useState({} as ArticleModalProps);

    /**
     * _Article 안에서 열리는 Wizard tx request modal 중 mintRequest wizard modal 인 경우
     * kaikas notification extension 창 중복 쌓기 금지위한 lock,
     **/
    const [mintLock, setMintLock] = useState(false);

    /**
     * klip 경우 request 에 대한 response 값의 expireTime 10분 = 600초 부터 카운트시작,
     **/
    const [expireKlipTime, setExpireKlipTime] = useState(600);

    /**
     * global state 인 klipQR의 타입에 따라 출력메세지를 return 시켜주는 함수
     **/
    const qrType = (klipQR) => {
        switch (klipQR.type) {
            case 'sell':
                return {
                    suc: Lang.suc_msg_sucs_sell_klip,
                    err: Lang.err_msg_sucs_sell_klip,
                    title: Lang.sell_klip_title,
                };
                break;
            case 'approvedRes':
                return {
                    suc: Lang.suc_msg_sucs_sell_approved_klip,
                    err: Lang.err_msg_sucs_sell_approved_klip,
                    title: Lang.approved_klip_title,
                };
                break;
            case 'sellCancel':
                return {
                    suc: Lang.suc_msg_sucs_sellCancel_klip,
                    err: Lang.err_msg_sucs_sellCancel_klip,
                    title: Lang.sell_cancel_klip_title,
                };
                break;
            case 'buy':
                return {
                    suc: Lang.suc_msg_sucs_buy_klip,
                    err: Lang.err_msg_sucs_buy_klip,
                    title: Lang.buy_klip_title,
                };
                break;
            case 'mint':
                return {
                    suc: Lang.suc_msg_sucs_mint_klip,
                    err: Lang.err_msg_sucs_mint_klip,
                    title: Lang.mint_klip_title,
                };
                break;
            default:
                break;
        }
    };

    /**
     * CLASS 에 따라 적용되야할 css return
     **/
    const setGradient = (value) => {
        switch (value) {
            case 'Normal':
                return css.gradient_nomal;
            case 'Uncommon':
                return css.gradient_uncommon;
            case 'Rare':
                return css.gradient_rare;
            case 'Unique':
                return css.gradient_unique;
            case 'Legendary':
                return css.gradient_legendary;
            case 'Myth':
                return css.gradient_myth;
        }
        return css;
    };

    /**
     * _ArticleModal 안에서 열리는 또 다른 modal load
     **/
    const loadArticleModal = async () => {
        const res = await getSalesHistory(collection.brand_name, props.title.split('#')[1]);
        setModalProps({
            collection,
            props: {
                title: 'Token Sales History',
                jsxContent: <_SalesHisotryModal history={res.data} />,
            },
        });
        setChildModal(true);
    };

    /**
     * global state 의 klipQR이 변경된다면 QR 생성을 위한 useEffect
     * Array.isArray(klipQR) === true
     * ? approvedRes, sellRes 의 두개의 req 에 대한 QR canvas 를 그려줘야 하는 경우
     * : 한개의 QR canvas 를 그려줘야 하는 경우
     **/
    useEffect(() => {
        if (klipQR) {
            if (Array.isArray(klipQR) && approvedCanvasRef.current !== null) {
                /* approvedRes, sellRes 의 두개의 req 에 대한 QR canvas 를 그려줘야 하는 경우
                 approved polling interval 이 성공적인 응답이라면
                 currentCanvasPage state ++, sell polling interval 실행 */
                QRCode.toCanvas(
                    approvedCanvasRef.current,
                    `https://klipwallet.com/?target=/a2a?request_key=${klipQR[0].request_key}`,
                    (error) => {
                        if (error) console.error(error);

                        const polling = setInterval(async () => {
                            try {
                                const data = await getResult(klipQR[0].request_key);

                                if (data.status === 'completed') {
                                    if (data.result) {
                                        setCurrentCanvasPage(2);

                                        clearInterval(polling);

                                        window?.toast('success', qrType(klipQR[0]).suc);

                                        QRCode.toCanvas(
                                            canvasRef.current,
                                            `https://klipwallet.com/?target=/a2a?request_key=${klipQR[1].request_key}`,
                                            function (error) {
                                                if (error) console.error(error);

                                                const polling = setInterval(async () => {
                                                    try {
                                                        const data = await getResult(klipQR[1].request_key);

                                                        if (data.status === 'completed') {
                                                            if (data.result) {
                                                                klaymint.getToken(wallet, list).then((res) => {
                                                                    dispatch(
                                                                        setToken({
                                                                            ...wallet.info.myToken,
                                                                            unlisted: res.unlisted,
                                                                            onSale: res.onSale,
                                                                        }),
                                                                    );
                                                                });

                                                                /* 유효 기간 */
                                                                clearInterval(polling);
                                                                remoteWizardOpener('wizzard');
                                                                setMintLock(false);
                                                                dispatch(setKlipQR(null)); // 모달 닫기
                                                                window?.toast('success', qrType(klipQR[1]).suc);
                                                            }
                                                        }
                                                    } catch (e) {
                                                        console.error(e);
                                                        window?.toast('error', qrType(klipQR[1]).err);
                                                    } finally {
                                                        //something..
                                                    }
                                                }, 1000);
                                            },
                                        );
                                    }
                                }
                            } catch (e) {
                                console.error(e);
                                window?.toast('error', qrType(klipQR[0]).err);
                            } finally {
                                //something..
                            }
                        }, 1000);
                    },
                );
            } else if (canvasRef.current !== null) {
                /* 한개의 QR canvas 를 그려줘야 하는 경우 */
                QRCode.toCanvas(
                    canvasRef.current,
                    `https://klipwallet.com/?target=/a2a?request_key=${klipQR.request_key}`,
                    function (error) {
                        if (error) console.error(error);

                        const polling = setInterval(async () => {
                            try {
                                const data = await getResult(klipQR.request_key);

                                if (data.status === 'completed') {
                                    if (data.result) {
                                        klaymint.getToken(wallet, list).then((res) => {
                                            dispatch(
                                                setToken({
                                                    ...wallet.info.myToken,
                                                    unlisted: res.unlisted,
                                                    onSale: res.onSale,
                                                }),
                                            );
                                        });

                                        /* 유효 기간 */
                                        clearInterval(polling);
                                        remoteWizardOpener('wizzard');
                                        setMintLock(false);
                                        dispatch(setKlipQR(null)); // 모달 닫기
                                        window?.toast('success', qrType(klipQR).suc);
                                    }
                                }
                            } catch (e) {
                                console.error(e);
                                window?.toast('error', qrType(klipQR).err);
                            } finally {
                                //something..
                            }
                        }, 1000);
                    },
                );
            }
        }
    }, [klipQR]);

    /**
     * request 에 대한 response 값의 expireTime countDown useEffect
     **/
    useEffect(() => {
        if (klipQR) {
            if (expireKlipTime <= 0) return;
            setTimeout(() => setExpireKlipTime(expireKlipTime - 1), 1000);
        }
    }, [expireKlipTime]);

    const min = Math.floor(expireKlipTime / 60);
    const sec = expireKlipTime % 60;

    return (
        <>
            <section className={css.ArticleDetailSection} style={style ? style : undefined}>
                <div className={css.mainSection}>
                    {/* ********************************************************************************
                     *  mainImage 를 card 형식으로 출력하는 tsx **********************************************
                     *********************************************************************************/}
                    {props.mainImage ? (
                        <div className={cx(css.modalCardContainer)}>
                            <img className={css.modalCardImage} src={props.mainImage} alt="" />
                            {props.mainAttrs ? (
                                <div className={css.modalCardAttr}>
                                    <h2>{props.title}</h2>
                                    <div className={cx('row', css.attrRow)}>
                                        {props.mainAttrs.map((attr, index) => {
                                            try {
                                                const value = JSON.parse(attr[1]);

                                                return (
                                                    <div className={cx('col-md-6', css.attrCol)} key={index}>
                                                        <span
                                                            className={css.attrKey}
                                                            style={value[1] ? getBackgroundColor(value[1]) : undefined}
                                                        >
                                                            {attr[0]}
                                                        </span>
                                                        <span
                                                            className={css.attrValue}
                                                            style={value[1] ? getBackgroundColor(value[1]) : undefined}
                                                        >
                                                            {attr[0] === 'CLASS' ? value[1] : value[0]}
                                                        </span>
                                                    </div>
                                                );
                                            } catch (e) {
                                                return (
                                                    <div className={cx('col-md-6', css.attrCol)} key={index}>
                                                        <span
                                                            className={css.attrKey}
                                                            style={attr[1] ? getBackgroundColor(attr[1]) : undefined}
                                                        >
                                                            {attr[0]}
                                                        </span>
                                                        <span
                                                            className={css.attrValue}
                                                            style={attr[1] ? getBackgroundColor(attr[1]) : undefined}
                                                        >
                                                            {attr[1]}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    {/* ********************************************************************************
                     *  mainImage 를 card 형식으로 출력하는 tsx **********************************************
                     *********************************************************************************/}

                    {props.mainDescButtons ||
                    props.mainDesc ||
                    props.mainAttrs ||
                    props.mainAttrDesc ||
                    props.footerInput ||
                    props.footerPriceHistory ? (
                        <div className={css.descContainer}>
                            <div>
                                <div className={css.titleSection}>
                                    {props.title ? (
                                        <div className={css.name}>
                                            <h2>{props.title}</h2>
                                            {/*<button type="button">*/}
                                            {/*    <span>*/}
                                            {/*        <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">*/}
                                            {/*            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"></path>*/}
                                            {/*        </svg>*/}
                                            {/*    </span>*/}
                                            {/*</button>*/}
                                            <button
                                                onClick={() =>
                                                    window.open(
                                                        `https://scope.klaytn.com/nft/${collection.contract_address}/${
                                                            props.title?.split('#')[1]
                                                        }`,
                                                    )
                                                }
                                            >
                                                <span>
                                                    <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z"></path>
                                                    </svg>
                                                </span>
                                            </button>
                                        </div>
                                    ) : null}

                                    {props.titleButtons
                                        ? props.titleButtons.map(
                                              (button: string | JSX.Element | Buffer | any, index) => {
                                                  return (
                                                      <button className={css.shareButton} type="button" key={index}>
                                                          {button}
                                                      </button>
                                                  );
                                              },
                                          )
                                        : null}
                                </div>
                                {props.mainDescButtons ? (
                                    <div className={css.mainTopButtons}>
                                        {props.mainDescButtons.map((button, index) => {
                                            return (
                                                <div key={index} className={css.ownedLink}>
                                                    <button type="button">
                                                        <span>{button}</span>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : null}
                                {props.mainDesc ? (
                                    <ShowMoreText
                                        lines={2}
                                        more="Show more"
                                        less="Show less"
                                        className={css.descText}
                                        anchorClass="my-anchor-css-class"
                                        expanded={false}
                                        width={800}
                                        truncatedEndingComponent={'... '}
                                    >
                                        <div className={css.descText}>
                                            <i>
                                                <p>{props.mainDesc}</p>
                                            </i>
                                        </div>
                                    </ShowMoreText>
                                ) : null}
                            </div>

                            <div>
                                {props.mainAttrs ? (
                                    <div className={css.modalCardAttr}>
                                        <div className={cx('row', css.attrRow)}>
                                            {props.mainAttrs
                                                .filter((item) => item[0] === 'CLASS')
                                                .map((attr, index) => {
                                                    const setBorderCss = (value) => {
                                                        switch (value) {
                                                            case 'Unique':
                                                                return css.uniqueBorderCss;
                                                            case 'Legendary':
                                                                return css.LegendaryBorderCss;
                                                            case 'Myth':
                                                                return css.MythBorderCss;
                                                            default:
                                                                return undefined;
                                                        }
                                                    };
                                                    try {
                                                        const value = JSON.parse(attr[1]);

                                                        return (
                                                            <div
                                                                className={cx(
                                                                    'col-md-6',
                                                                    css.attrCol,
                                                                    css.attrClassCol,
                                                                    setBorderCss(value[1]),
                                                                )}
                                                                key={index}
                                                            >
                                                                <span className={cx(css.attrKey, css.attrClassKey)}>
                                                                    {attr[0]}
                                                                </span>
                                                                <span className={cx(css.attrValue, css.attrClassValue)}>
                                                                    {value[1].toUpperCase()}
                                                                </span>
                                                            </div>
                                                        );
                                                    } catch (e) {
                                                        return (
                                                            <div
                                                                className={cx(
                                                                    'col-md-6',
                                                                    css.attrCol,
                                                                    css.attrClassCol,
                                                                    setBorderCss(attr[1]),
                                                                )}
                                                                key={index}
                                                            >
                                                                <span className={cx(css.attrKey, css.attrClassKey)}>
                                                                    {attr[0]}
                                                                </span>
                                                                <span className={cx(css.attrValue, css.attrClassValue)}>
                                                                    {attr[1].toUpperCase()}
                                                                </span>
                                                            </div>
                                                        );
                                                    }
                                                })}
                                            {props.mainAttrs.map((attr, index) => {
                                                try {
                                                    const value = JSON.parse(attr[1]);

                                                    if (attr[0] !== 'CLASS') {
                                                        return (
                                                            <div
                                                                className={cx(
                                                                    'col-md-6',
                                                                    css.attrCol,
                                                                    setGradient(value[1]),
                                                                )}
                                                                key={index}
                                                            >
                                                                <span className={css.attrKey}>{attr[0]}</span>
                                                                <span className={css.attrValue}>{value[0]}</span>
                                                            </div>
                                                        );
                                                    }
                                                } catch (e) {
                                                    if (attr[0] !== 'CLASS') {
                                                        return (
                                                            <div
                                                                className={cx(
                                                                    'col-md-6',
                                                                    css.attrCol,
                                                                    setGradient(attr[1]),
                                                                )}
                                                                key={index}
                                                            >
                                                                <span className={css.attrKey}>{attr[0]}</span>
                                                                <span className={css.attrValue}>{attr[1]}</span>
                                                            </div>
                                                        );
                                                    }
                                                }
                                            })}
                                        </div>
                                    </div>
                                ) : null}
                                {props.footerPrice ? (
                                    <div className={css.priceSection}>
                                        <img alt="KLAY" src={iconKaikas} />
                                        <span>{props.footerPrice}</span>
                                        {props.footerPriceHistory ? (
                                            <button
                                                type="button"
                                                className={css.lastPriceHistoryBtn}
                                                onClick={loadArticleModal}
                                            >
                                                <span>
                                                    Last
                                                    <img alt="KLAY" src={iconKaikas} />
                                                    {props.footerPriceHistory}
                                                </span>
                                                <span>
                                                    <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path>
                                                    </svg>
                                                </span>
                                            </button>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                            {props.mainAttrDesc && mobileSizeEx.indexOf(breakpoint) === -1 ? (
                                <div className={css.attrDesc}>
                                    {Object.keys(props.mainAttrDesc).map((item, index) => {
                                        if (props.mainAttrDesc[item].scs_name !== 'none') {
                                            return (
                                                <div className={css.attrDescContainer} key={index}>
                                                    {capitalize(props.mainAttrDesc[item].scs_name)}
                                                    <div
                                                        className={css.classBox}
                                                        style={{
                                                            backgroundColor: `#${props.mainAttrDesc[item].sc_code0}`,
                                                        }}
                                                    ></div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            ) : null}

                            {props.footerInput ? (
                                <div className={css.inputSection}>
                                    <label>
                                        <span>
                                            <img src={iconKaikas} alt="klay" />
                                            KLAY :{'  '}
                                        </span>
                                        <input
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Write the desired klay"
                                        />
                                    </label>
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    {/* ********************************************************************************
                     *  QR canvas container tsx ********************************************************
                     *********************************************************************************/}

                    {props.mainCanvas && !Array.isArray(klipQR) ? (
                        <div className={cx('d-flex justify-content-center bd-highlight mb-3', css.qrContainer)}>
                            <div className="p-2 bd-highlight">
                                <div className="text-center">{`${qrType(klipQR).title}`}</div>
                                <canvas ref={canvasRef} style={{ margin: '20px' }} />
                                <div className="text-center">{`${Lang.word_expiration_time}  ${min} : ${sec}`}</div>
                            </div>
                        </div>
                    ) : props.mainCanvas && Array.isArray(klipQR) ? (
                        <div className={cx('d-flex justify-content-center bd-highlight mb-3', css.qrContainer)}>
                            {currentCanvasPage === 1 ? (
                                <div className="p-2 bd-highlight">
                                    <div className="text-center">{`${qrType(klipQR[0]).title}`}</div>
                                    <canvas ref={approvedCanvasRef} style={{ margin: '20px' }} />
                                    <div className="text-center">{`${Lang.word_expiration_time}  ${min} : ${sec}`}</div>
                                </div>
                            ) : (
                                <div className="p-2 bd-highlight">
                                    <div className="text-center">{`${qrType(klipQR[1]).title}`}</div>
                                    <canvas ref={canvasRef} style={{ margin: '20px' }} />
                                    <div className="text-center">{`${Lang.word_expiration_time}  ${min} : ${sec}`}</div>
                                </div>
                            )}
                        </div>
                    ) : null}

                    {/* modal 에 다른 컨텐츠 없이 props 값으로 직접 jsx 코드를 넘기는 경우 ex) priceHistory 또는 salesHistory */}
                    {props.jsxContent ? props.jsxContent : null}
                </div>

                {props.footerButtons ? (
                    <div className={css.buttonSection}>
                        {props.footerButtons.map((button, index) => {
                            if (button === 'SELL') {
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={async () => {
                                            // Klay 입력 후 Sell 버튼 클릭 이밴트

                                            {
                                                /* ********************************************************************************
                                                 *  sell bnt event **********************************************
                                                 *********************************************************************************/
                                            }

                                            // null 이면 정상
                                            const checkNum = numOnlyTwoDecimal(+price);
                                            if (checkNum) {
                                                console.log(checkNum);
                                                window?.toast('error', Lang.err_msg_fail_price_not_integers);
                                                return;
                                            }
                                            if (!+price) {
                                                window?.toast('error', Lang.err_msg_fail_price_empty);
                                                return;
                                            }
                                            if (+price > 99999999.99) {
                                                window?.toast('error', Lang.err_msg_fail_price_too_big);
                                                return;
                                            }
                                            if (!wallet.isConn) {
                                                window?.toast('error', Lang.err_msg_fail_connect_wallet);
                                                return;
                                            }

                                            remoteWizardOpener('trade_chk_stepwizard');
                                            //Go to line. 565
                                        }}
                                    >
                                        {button}
                                    </button>
                                );
                            } else {
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={async () => {
                                            // Buy Button ************************************ popo Collection -> detail
                                            // Sell Cancel Button ************************************
                                            remoteWizardOpener('trade_chk_wizard');
                                        }}
                                    >
                                        {button}
                                    </button>
                                );
                            }
                        })}
                    </div>
                ) : null}

                {childModal ? <LastPriceHistoryModal setModal={setChildModal} modalProps={modalProps} /> : null}
            </section>

            {/* ********************************************************************************
             *  TRY BUY, SELL CANCLE, IS_APPROVED **********************************************
             *********************************************************************************/}
            {props.footerButtons ? (
                <Wizard
                    className="border-0"
                    closeHold={true}
                    id="trade_chk_wizard"
                    title={Lang.modal_check_mint_title}
                    lock={mintLock}
                >
                    <div>
                        <div className="row mx-4 mb-2 text-dark">
                            <hr />
                            <div className="d-flex justify-content-between p-0">
                                <p className="text-dark">{props.footerButtons[0]} Item</p>
                                <span className="text-dark">{props.title}</span>
                            </div>
                            <div className="d-flex justify-content-between mt-2 p-0">
                                <p className="text-dark">Price</p>
                                <span className="text-dark">
                                    {props.footerButtons[0] === 'BUY' && (
                                        <>
                                            <img width={18} src={iconKaikas} />{' '}
                                            <b style={{ color: '#dd3333', fontSize: '1.2em' }}>
                                                {numberWithCommas(Number(props.footerPrice), '')}
                                            </b>
                                        </>
                                    )}
                                    {props.footerButtons[0] === 'SELL' && (
                                        <small className="fw-lighter">{Lang.modal_check_little_fee}</small>
                                    )}
                                    {props.footerButtons[0] === 'SELL CANCEL' && (
                                        <small className="fw-lighter">{Lang.modal_check_little_fee}</small>
                                    )}
                                </span>
                            </div>
                            <div className="d-flex justify-content-between p-0 my-3">
                                <small className="fw-lighter">{Lang.modal_check_mint_text_hold}</small>
                                <small className="fw-lighter">{wallet.info.balance} Klay</small>
                            </div>
                        </div>
                        {/* BUY 버튼 */}
                        <div className="position-bottom bg-dark p-0 text-center">
                            {props.footerButtons[0] === 'BUY' &&
                            // 클레이 부족시
                            Number(wallet.info.balance) - Number(props.footerPrice) <= 0 ? (
                                <button
                                    className="btn m-0 p-3"
                                    style={{ color: 'red' }}
                                    onClick={() => remoteWizardOpener('trade_chk_wizard')}
                                >
                                    <i className="fas fa-info-circle" /> {Lang.modal_check_mint_lack_to_klay}
                                </button>
                            ) : (
                                <button
                                    disabled={mintLock}
                                    className="btn m-0 p-3"
                                    onClick={async () => {
                                        try {
                                            setMintLock(true);
                                            props.footerButtons.map(async (button, index) => {
                                                switch (button) {
                                                    case 'BUY':
                                                        //buyRequest
                                                        await props.onClick.event(
                                                            wallet,
                                                            props.onClick.argument[0],
                                                            props.onClick.argument[1],
                                                            Lang,
                                                            props.onClick.argument[2],
                                                            setModal,
                                                            () => {
                                                                remoteWizardOpener('trade_chk_wizard');
                                                                setMintLock(false);
                                                            },
                                                        );
                                                        break;

                                                    case 'SELL CANCEL':
                                                        //sellCancelRequest
                                                        await props.onClick.event(
                                                            wallet,
                                                            props.onClick.argument[0],
                                                            Lang,
                                                            props.onClick.argument[1],
                                                            setModal,
                                                            () => {
                                                                remoteWizardOpener('trade_chk_wizard');
                                                                setMintLock(false);
                                                            },
                                                        );
                                                        break;

                                                    case 'SELL':
                                                        // Step Wizard Lootine
                                                        break;
                                                    default:
                                                        await props.onClick.event();
                                                }
                                            });
                                        } catch (err) {
                                            console.log(err);
                                        }
                                    }}
                                >
                                    {mintLock ? (
                                        <div className="spinner-border text-light" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        props.footerButtons[0]
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </Wizard>
            ) : null}
            {/* ********************************************************************************
             *  Step Wizard SELL ***************************************************************
             *********************************************************************************/}

            <StepWizard
                closeHold={true}
                id="trade_chk_stepwizard"
                onNext={() => console.log('middleware Next')}
                lock={mintLock}
            >
                {/* Step 1 . Approved (승인 상태 조회) 절차 진행 */}
                <div
                    className="row mx-4 mb-2 text-dark"
                    data-step-title="Request a Approved"
                    data-fn-next={async () => {
                        setMintLock(true);
                        let isApproved = await klaymint.isApproved(wallet.info.address, wallet.type);

                        console.log(isApproved);
                        if (isApproved) {
                            setMintLock(false);
                            return true;
                        } else {
                            await klaymint.setApproved(
                                wallet,
                                wallet.type,
                                Lang,
                                props.onClick.argument[1],
                                dispatch,
                                () => {
                                    remoteWizardOpener('trade_chk_stepwizard');
                                },
                            );

                            isApproved = await klaymint.isApproved(wallet.info.address, wallet.type);
                            if (isApproved) {
                                setMintLock(false);
                                return true;
                            }
                        }
                        setMintLock(false);
                        return remoteWizardOpener('trade_chk_stepwizard');
                    }}
                >
                    <hr />
                    <div className="d-flex justify-content-center p-0">
                        <b className="text-dark" style={{ fontSize: '1.2em' }}>
                            {Lang.modal_check_need_data_check_a_approved}
                        </b>
                    </div>

                    <div className="d-flex justify-content-center p-0 my-3">
                        <small className="fw-lighter">{Lang.modal_check_sell_item_need_after_approved}</small>
                    </div>
                </div>

                {/* Step 2 . Request a Transction 절차 진행 */}
                <div
                    className="row mx-4 mb-2 text-dark"
                    data-step-title="Request a Transaction"
                    data-fn-confirm={async () => {
                        // sellRequest = async (
                        //     wallet,
                        //     tokenId,
                        //     price,
                        //     Lang,
                        //     dispatch,
                        //     closeModal,
                        //     closeCallback = (): void => {
                        //         console.log('close');
                        //     },
                        //sell request
                        await props.onClick.event(
                            wallet,
                            props.onClick.argument[0],
                            +price,
                            Lang,
                            props.onClick.argument[1],
                            setModal,
                            () => {
                                remoteWizardOpener('trade_chk_stepwizard');
                            },
                        );
                    }}
                >
                    <hr />
                    <div className="d-flex justify-content-between p-0">
                        <p className="text-dark">{props.footerButtons ? props.footerButtons[0] : null} Item</p>
                        <span className="text-dark">{props.title}</span>
                    </div>
                    <div className="d-flex justify-content-between mt-2 p-0">
                        <p className="text-dark">Sell Order</p>
                        <span className="text-dark align-items-center">
                            <img width={18} src={iconKaikas} />{' '}
                            <b style={{ color: '#33AA33', fontSize: '1.2em' }}>{numberWithCommas(Number(price), '')}</b>
                        </span>
                    </div>
                    <div className="d-flex justify-content-between p-0 my-3">
                        <small className="fw-lighter">{Lang.modal_check_mint_text_hold}</small>
                        <small className="fw-lighter">{wallet.info.balance} Klay</small>
                    </div>
                </div>
            </StepWizard>
        </>
    );
};

const renderBorderImage = (attr) => {
    switch (attr) {
        case 'Unique':
            return (
                <>
                    <img alt="Uni" src={Uni1} className={css.attrClassImgTopLeft} />
                    <img alt="Uni" src={Uni2} className={css.attrClassImgTopRight} />
                    <img alt="Uni" src={Uni3} className={css.attrClassImgBottomLeft} />
                    <img alt="Uni" src={Uni4} className={css.attrClassImgBottomRight} />
                </>
            );
        case 'Legendary':
            return (
                <>
                    <img alt="Uni" src={Leg1} className={css.attrClassImgTopLeft} />
                    <img alt="Uni" src={Leg2} className={css.attrClassImgTopRight} />
                    <img alt="Uni" src={Leg3} className={css.attrClassImgBottomLeft} />
                    <img alt="Uni" src={Leg4} className={css.attrClassImgBottomRight} />
                </>
            );
        case 'Myth':
            return (
                <>
                    <img alt="Uni" src={Myth1} className={css.attrClassImgTopLeft} />
                    <img alt="Uni" src={Myth2} className={css.attrClassImgTopRight} />
                    <img alt="Uni" src={Myth3} className={css.attrClassImgBottomLeft} />
                    <img alt="Uni" src={Myth4} className={css.attrClassImgBottomRight} />
                </>
            );
        default:
            return null;
            break;
    }
};

export default _ArticleModal;
