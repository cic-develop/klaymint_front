import React, { useState } from 'react';
import css from '@/_components/commons/modals/_ArticleModal.module.scss';
import cx from 'classnames';
import iconKaikas from '@/_statics/images/icon_kaikas.png';
import { numOnlyTwoDecimal } from '@/helpers/validate.helper';
import { remoteWizardOpener, StepWizard, Wizard } from '@/_components/commons/wizard';
import LastPriceHistoryModal from '@/pages/CollectionsDetail/components/Article.DetailModal.LastPriceHistoryModal';
import { numberWithCommas } from '@/helpers/common.helper';
import {
    ArticleModalProps,
    NotExistClassArticleModalProps,
} from '@/_components/commons/modals/_ArticleModal.interfaces.declare';
import KlayMint from '@/helpers/linkBlockchainNetwork';
import { useDispatch, useSelector } from 'react-redux';
import { useLanguages } from '@/hooks/useLanguages.hook';
import { RootState } from '@/redux/connectors.redux';
import { getSalesHistory } from '@/helpers/klaymint.api';
import _SalesHisotryModal from '@/_components/commons/modals/_SalesHisotryModal';
import ShowMoreText from 'react-show-more-text';
import ProgressBar from 'react-bootstrap/ProgressBar';

const _notExistClassArticleModal = ({
    collection,
    props,
    setModal,
    style,
}: NotExistClassArticleModalProps): JSX.Element => {
    const { list } = useSelector((store: RootState) => store.Collections);
    const klaymint = new KlayMint(collection.contract_address, collection.factory_address, list);

    const dispatch = useDispatch();
    const Lang = useLanguages();

    const wallet = useSelector((store: RootState) => store.Wallet);

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
     * _ArticleModal 안에서 열리는 또 다른 modal load
     **/
    const loadArticleModal = async () => {
        const res = await getSalesHistory('PoPo', props.title.split('#')[1]);
        setModalProps({
            collection,
            props: {
                title: 'Token Sales History',
                jsxContent: <_SalesHisotryModal history={res.data} />,
            },
        });
        setChildModal(true);
    };

    return (
        <>
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
                                                // const value = JSON.parse(attr[1]);

                                                return (
                                                    <div className={cx('col-md-6', css.attrCol)} key={index}>
                                                        <span className={css.attrKey}>{attr[0]}</span>
                                                        <span className={css.attrValue}>{attr[1]}</span>
                                                    </div>
                                                );
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
                                                            `https://scope.klaytn.com/nft/${
                                                                collection.contract_address
                                                            }/${props.title?.split('#')[1]}`,
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
                                            <i>
                                                <p>{props.mainDesc}</p>
                                            </i>
                                        </ShowMoreText>
                                    ) : null}
                                </div>

                                <div>
                                    {props.mainAttrs ? (
                                        <div className={css.modalCardAttr}>
                                            <div className={cx('row', css.attrRow)}>
                                                {props.mainAttrs.map((attr, index) => {
                                                    return (
                                                        <div className={cx('col-md-6', css.attrCol)} key={index}>
                                                            {attr[0] !== 'Level' ? (
                                                                <span className={css.attrKey}>{attr[0]}</span>
                                                            ) : (
                                                                <span className={cx(css.attrKey, css.progressBarKey)}>
                                                                    {`${attr[0]}`}
                                                                    <p>{`${attr[1]} / ${attr[2]}`}</p>
                                                                </span>
                                                            )}

                                                            {attr[0] !== 'Level' ? (
                                                                <span className={css.attrValue}>{attr[1]}</span>
                                                            ) : (
                                                                <span
                                                                    className={cx(css.attrValue, css.progressBarValue)}
                                                                >
                                                                    <ProgressBar
                                                                        animated
                                                                        now={attr[1]}
                                                                        max={attr[2]}
                                                                        className={css.barContainer}
                                                                    />
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
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
                                <b style={{ color: '#33AA33', fontSize: '1.2em' }}>
                                    {numberWithCommas(Number(price), '')}
                                </b>
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
        </>
    );
};

export default _notExistClassArticleModal;
