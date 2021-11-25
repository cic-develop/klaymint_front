import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import css from './Buttons.module.scss';
import iconKaikas from '@/_statics/images/icon_kaikas.png';
import { ArticleModalProps } from '@/_components/commons/modals/_ArticleModal.interfaces.declare';
import { getOneDaySalesHistory, getView, getViewListJson, getTradeChart } from '@/helpers/klaymint.api';
import cx from 'classnames';
import _SalesHisotryModal from '@/_components/commons/modals/_SalesHisotryModal';
import { numberWithCommas } from '@/helpers/common.helper';
import PriceHistory from '@/_components/commons/modals/_PriceHistoryModal';
import { getBackgroundColor } from '@/helpers/_common';
import _ArticleModal from '@/_components/commons/modals/_ArticleModal';
import { CollectionsDetailContractInfoProps } from '@/reducers/GlobalStatus.reducer';

// interface Props {
//     contractInfo: CollectionsDetailContractInfoProps;
// }

const ButtonsInfo = ({ contractInfo, classs }) => {
    const [modal, setModal] = useState(false as string | boolean);
    const [modalProps, setModalProps] = useState({} as ArticleModalProps);

    const loadArticleModal = async (content: string, brandName: string, contract_id: number) => {
        console.log(content, brandName, contract_id);
        switch (content) {
            case 'PriceHistory': {
                const res = await getTradeChart(contract_id);
                if (!res.data) {
                    console.error('faild to load data');
                    return;
                }
                setModalProps({
                    props: {
                        jsxContent: <PriceHistory priceHistory={res.data} />,
                    },
                });
                setModal(true);
                break;
            }
            case 'SalesHistory': {
                const res = await getOneDaySalesHistory(brandName, 1);

                setModalProps({
                    props: {
                        jsxContent: <_SalesHisotryModal history={res.data} />,
                    },
                });
                setModal(true);
                break;
            }
            case 'ShowAttributes': {
                setModalProps({
                    props: {
                        jsxContent: <ShowAttributes brandName={contractInfo.brand_name} />,
                    },
                });
                setModal(true);
                break;
            }

            default: {
                setModal(false);
                break;
            }
        }
    };

    useEffect(() => {
        modal ? (document.body.style.overflowY = 'hidden') : (document.body.style.overflowY = 'unset');
    }, [modal]);

    return (
        <>
            <section className={css.InfoSection}>
                <div className={css.infoContainer}>
                    <div className={css.buttonSection}>
                        <div className={cx('row', css.floorPriceInfo)}>
                            {contractInfo.is_class ? (
                                _.map(_.keys(classs).reverse(), (key, i) => {
                                    const _value = classs[key];

                                    return (
                                        <button key={i} type="button" className={cx('col-md-4', css.floorPriceButton)}>
                                            <div>
                                                <span style={getBackgroundColor(key)}>{key}</span>
                                                <span>
                                                    {_value ? (
                                                        <>
                                                            <img
                                                                alt="KLAY"
                                                                src={iconKaikas}
                                                                width="18px"
                                                                height="18px"
                                                            />{' '}
                                                            {numberWithCommas(_value, '')}
                                                        </>
                                                    ) : (
                                                        'Not Traded'
                                                    )}
                                                </span>
                                            </div>
                                            <p>Floor price</p>
                                        </button>
                                    );
                                })
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className={cx(
                                            'col-md-6',
                                            css.floorPriceButton,
                                            contractInfo.is_class ? undefined : css.notClassFloorPriceButton,
                                        )}
                                    >
                                        <div>
                                            <span>{numberWithCommas(333, '')}</span>
                                        </div>
                                        <p>Owner</p>
                                    </button>
                                    <button
                                        type="button"
                                        className={cx(
                                            'col-md-6',
                                            css.floorPriceButton,
                                            contractInfo.is_class ? undefined : css.notClassFloorPriceButton,
                                        )}
                                    >
                                        <div>
                                            <span>
                                                <img alt="KLAY" src={iconKaikas} width="18px" height="18px" />{' '}
                                                {numberWithCommas(333, '')}
                                            </span>
                                        </div>
                                        <p>Floor price</p>
                                    </button>
                                </>
                            )}
                        </div>
                        <div className={cx('row', css.networkInfo, css.priceInfo)}>
                            <button
                                type="button"
                                className={cx(
                                    'col-md-3',
                                    css.networkButton,
                                    contractInfo.is_class ? undefined : css.notClassNetworkButton,
                                )}
                            >
                                <div>
                                    <span>{contractInfo && numberWithCommas(contractInfo.sttc_crnt_nft, '')}</span>
                                    <p>Items</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                className={cx(
                                    'col-md-3',
                                    css.networkButton,
                                    contractInfo.is_class ? undefined : css.notClassNetworkButton,
                                )}
                            >
                                <div>
                                    <span>
                                        <img alt="KLAY" src={iconKaikas} />
                                        {contractInfo && numberWithCommas(contractInfo.tvolume, '')}
                                    </span>
                                    <p>Vol. traded</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                className={cx(
                                    'col-md-3',
                                    css.priceButton,
                                    contractInfo.is_class ? undefined : css.notClassPriceButton,
                                )}
                                onClick={() =>
                                    loadArticleModal('SalesHistory', contractInfo.brand_name, contractInfo.id)
                                }
                            >
                                <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" className={css.salesSvg}>
                                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                                LATEST SALES
                            </button>
                            <button
                                type="button"
                                className={cx(
                                    'col-md-3',
                                    css.priceButton,
                                    contractInfo.is_class ? undefined : css.notClassPriceButton,
                                )}
                                onClick={() =>
                                    loadArticleModal('PriceHistory', contractInfo.brand_name, contractInfo.id)
                                }
                            >
                                <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" className={css.salesSvg}>
                                    <path d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z" />
                                </svg>
                                PRICE HISTORY
                            </button>
                        </div>
                        {!contractInfo.is_complete && (
                            <div className={css.attrInfo}>
                                <button
                                    type="button"
                                    className={css.attrButton}
                                    onClick={() =>
                                        loadArticleModal('ShowAttributes', contractInfo.brand_name, contractInfo.id)
                                    }
                                >
                                    SHOW ATTRIBUTES
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            {modal ? <DetailModal setModal={setModal} modalProps={modalProps} /> : null}
        </>
    );
};

const DetailModal = ({ modalProps, setModal }) => {
    return (
        <section>
            <_ArticleModal props={modalProps.props} setModal={setModal} collection={'tempProps_case1'} />
            <div className="backgroundShadow" onClick={() => setModal(false)} />
        </section>
    );
};

const ShowAttributes = ({ brandName }) => {
    const [viewImage, setViewImage] = useState({
        ['3.Body']: 'Basic.png',
    } as any);
    const [pngList, setPngList] = useState({} as any);
    const [resImage, setResImage] = useState(null);

    const getImg = async (data: { parts: string[]; dna: string[] }) => {
        if (data.parts.length !== 0) {
            const res = await getView({
                brand: 'PoPo',
                parts: data.parts,
                dna: data.dna,
            });

            const base64ImageString = Buffer.from(res.data, 'binary').toString('base64');
            const srcValue = `data:image/png;base64,${base64ImageString}`;

            return srcValue;
        }
    };

    useEffect(() => {
        getViewListJson(brandName).then((res) => {
            const dir = Object.keys(res.data).map((item) => {
                const withoutJson = item.replace('.json', '');
                return withoutJson;
            });
            const files = Object.values(res.data).map((item) => {
                return Object.keys(item).map((fileName, index) => {
                    return [fileName, Object.values(item)[index][0]];
                });
            });
            const result = {};

            dir.forEach((dirName, index) => {
                result[dirName] = files[index];
            });

            setPngList(result);
        });
    }, []);

    useEffect(() => {
        const sortable = [];
        for (const [key, value] of Object.entries(viewImage)) sortable.push([key, value]);
        sortable.sort();

        const dna = [];
        const parts = [];
        sortable.forEach((value) => {
            if (value[1] !== '0') {
                dna.push(value[0]);
                parts.push(value[1].split(',')[0]);
            }
        });

        getImg({ parts, dna }).then((res) => {
            setResImage(res);
        });
    }, [viewImage]);

    return (
        <section className={css.CollectionsAttributesMain}>
            <div className={css.characterSection}>
                {resImage ? <img className={css.canvasPNG} src={resImage} alt="canvasPNG" /> : null}
            </div>
            <div className={css.selectAttrSection}>
                {Object.keys(pngList).map((key, idx) => {
                    const withoutNumber = key.replace(/^[0-9]+./, '');

                    return (
                        <select
                            key={idx}
                            name={key}
                            onChange={(e) => setViewImage({ ...viewImage, [e.target.name]: e.target.value })}
                        >
                            <option value="0">{`select ${withoutNumber}`}</option>
                            {pngList[key].map((item, index) => {
                                return (
                                    <option key={index} value={item}>
                                        {item[0].replace('.png', '')} ( {item[1]}% )
                                    </option>
                                );
                            })}
                        </select>
                    );
                })}
            </div>
        </section>
    );
};

export default ButtonsInfo;
