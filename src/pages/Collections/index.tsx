import React, { useEffect, useState } from 'react';
import css from './Collections.module.scss';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import { sortCollections } from '@/redux/reducers/Collections.reducer';

import { getOneDaySalesHistory, getTradeChart } from '@/helpers/klaymint.api';
import iconKaikas from '@/_statics/images/icon_kaikas.png';
import PriceHistory from '@/_components/commons/modals/_PriceHistoryModal';
import _SalesHisotryModal from '@/_components/commons/modals/_SalesHisotryModal';

import { ArticleModalProps } from '@/_components/commons/modals/_ArticleModal.interfaces.declare';
import { numberWithCommas, floatWithCommas } from '@/helpers/common.helper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';

import { useLanguages } from '@/hooks/useLanguages.hook';

import _ArticleModal from '@/_components/commons/modals/_ArticleModal';
import Loader from '@/_components/commons/loaders/loader';

import Default_Thumb from '@/_statics/images/footer-logo.png';
import _ from 'lodash';
import { setContractListInfo } from '@/redux/reducers/GlobalStatus.reducer';

const Dashboard = () => {
    const dispatch = useDispatch();
    const [collections, setCollections] = useState([]);
    const Lang = useLanguages();

    // const [collectionPrice, setCollectionPrice] = useState(
    //     {} as {
    //         daily: any;
    //         rate: {
    //             average_price_24h: {
    //                 rate: number | string;
    //                 price: number | string;
    //             };
    //             volume_24h: {
    //                 rate: number | string;
    //                 price: number | string;
    //             };
    //             volume_7D: {
    //                 rate: number | string;
    //                 price: number | string;
    //             };
    //         };
    //         total: {
    //             highPrice: string | number;
    //             items: number;
    //             lowPrice: string | number;
    //             owners: number;
    //             priceInfoByClass: any;
    //             soldCount: string | number;
    //             volume: string | number;
    //         };
    //     },
    // );
    // const [dollarInfo, setDollarInfo] = useState({
    //     totalVolume: '',
    //     sevenVolume: '',
    //     klayPrice: '',
    // });

    const [modal, setModal] = useState(false as string | boolean);
    const [modalProps, setModalProps] = useState({} as ArticleModalProps);

    const { mobile } = useSelector((store: RootState) => store.GlobalStatus);
    const { total, list, sort } = useSelector((store: RootState) => store.Collections);

    const loadArticleModal = async (content: string, brandName: string, contract_id: number) => {
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
                console.log(res.data.length);

                setModalProps({
                    props: {
                        jsxContent: <_SalesHisotryModal history={res.data} />,
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

    const sortHandler = (key, order) => {
        //같은 항목을 클릭 시 정렬 변경
        if (sort.key === key) {
            dispatch(sortCollections({ sort: { key: key, order: order } }));
        } else {
            //다른 항목을 클릭시 정렬 변경 안함
            dispatch(sortCollections({ sort: { key: key, order: true } }));
        }
    };

    useEffect(() => {
        modal ? (document.body.style.overflowY = 'hidden') : (document.body.style.overflowY = 'unset');
    }, [modal]);

    return (
        <>
            <div className="mt-5 pt-5"></div>
            <main className={cx('pt-4', css.DashBoardSection)}>
                <div className={css.tableTitleContainer}>
                    <h2>Statistics for all collections</h2>
                </div>
                {/* ********************** TOP Statistics for all collections INFO ********************** */}

                <div className={css.tableSubTitleContainer}>
                    {!total ? (
                        <Loader className="text-light" />
                    ) : (
                        <>
                            <button type="button">
                                <div className={css.info}>
                                    <span className={css.numberInfoSpan}>
                                        <p>Total Volume</p>
                                        <p>
                                            <img className={css.kaikasIcon} width={18} height={18} src={iconKaikas} />
                                            {floatWithCommas(Number(total.all.volume))}
                                            {' / $ '}
                                            {floatWithCommas(Number(total.all.doller))}
                                        </p>
                                    </span>
                                </div>
                                <span></span>
                            </button>
                            <button type="button">
                                <div className={css.info}>
                                    <span className={css.numberInfoSpan}>
                                        <p>7 Days Volume</p>
                                        <p>
                                            <img className={css.kaikasIcon} width={18} height={18} src={iconKaikas} />
                                            {floatWithCommas(Number(total.day7.volume))}
                                            {' / $ '}
                                            {floatWithCommas(Number(total.day7.doller))}
                                        </p>
                                    </span>
                                    <span className={css.percentageInfoSpan}>
                                        <p className={total.day7.rate < 0 ? css.downPercentage : css.upPercentage}>
                                            {total.day7.rate}%
                                        </p>
                                    </span>
                                </div>
                            </button>
                            <button type="button">
                                <div className={css.info}>
                                    <span className={css.numberInfoSpan}>
                                        <p>KLAY Price</p>
                                        <p>
                                            {'$ '}
                                            {floatWithCommas(Number(total.klay.doller))}
                                        </p>
                                    </span>
                                </div>
                                <span></span>
                            </button>
                        </>
                    )}
                </div>
                <table className={cx('table table-striped', css.tableMainContainer)}>
                    {/* Table Head *********************************** */}
                    <thead className={css.tableThead}>
                        <tr className={css.tableTheadTr}>
                            <th className={css.tableTheadIdxNumber} scope="col">
                                <button className="btn" type="button" onClick={() => sortHandler('id', !sort.order)}>
                                    #
                                </button>
                            </th>

                            <th className={css.tableTheadBrandName} scope="col">
                                <button
                                    className="btn"
                                    type="button"
                                    onClick={() => sortHandler('contract_name', !sort.order)}
                                >
                                    {!mobile ? 'Collection name' : 'name'}
                                </button>
                            </th>

                            {!mobile && (
                                <th className={css.tableTheadAveragePrice} scope="col">
                                    <button
                                        className="btn"
                                        type="button"
                                        onClick={() => sortHandler('tvolume', !sort.order)}
                                    >
                                        {!mobile ? 'Total Volume' : 'Total'}{' '}
                                        {sort.key === 'tvolume' && !sort.order && <i className="fas fa-caret-up" />}
                                        {sort.key === 'tvolume' && sort.order && <i className="fas fa-caret-down" />}
                                    </button>
                                </th>
                            )}
                            <th className={css.tableTheadAveragePrice} scope="col">
                                <button
                                    className="btn"
                                    type="button"
                                    onClick={() => sortHandler('average_price', !sort.order)}
                                >
                                    {!mobile ? 'Avg price % (24h)' : 'Avg % (24h)'}{' '}
                                    {sort.key === 'average_price' && !sort.order && <i className="fas fa-caret-up" />}
                                    {sort.key === 'average_price' && sort.order && <i className="fas fa-caret-down" />}
                                </button>
                            </th>
                            <th className={css.tableTheadVolumePercentage} scope="col">
                                <button
                                    className="btn"
                                    type="button"
                                    onClick={() => sortHandler('volume', !sort.order)}
                                >
                                    {!mobile ? 'Volume % (24h)' : 'Vol % (24h)'}{' '}
                                    {sort.key === 'volume' && !sort.order && <i className="fas fa-caret-up" />}
                                    {sort.key === 'volume' && sort.order && <i className="fas fa-caret-down" />}
                                </button>
                            </th>
                            {/*<th className={css.tableTheadMarketCap} aria-sort="descending" scope="col">*/}
                            {/*    <span role="button" aria-disabled="false">*/}
                            {/*        Market cap*/}
                            {/*    </span>*/}
                            {/*</th>*/}
                            <th className={css.tableTheadVolume} scope="col">
                                <button
                                    className="btn"
                                    type="button"
                                    onClick={() => sortHandler('d7_volume', !sort.order)}
                                >
                                    {!mobile ? 'Volume % (7D)' : 'Vol % (7D)'}{' '}
                                    {sort.key === 'd7_volume' && !sort.order && <i className="fas fa-caret-up" />}
                                    {sort.key === 'd7_volume' && sort.order && <i className="fas fa-caret-down" />}
                                </button>
                            </th>
                            {!mobile && (
                                <th className={css.tableTheadVolume} scope="col">
                                    <button
                                        className="btn"
                                        type="button"
                                        onClick={() => sortHandler('sttc_owner_count', !sort.order)}
                                    >
                                        {!mobile ? 'Owners' : 'Own'}{' '}
                                        {sort.key === 'sttc_owner_count' && !sort.order && (
                                            <i className="fas fa-caret-up" />
                                        )}
                                        {sort.key === 'sttc_owner_count' && sort.order && (
                                            <i className="fas fa-caret-down" />
                                        )}
                                    </button>
                                </th>
                            )}
                            {!mobile && (
                                <th className={css.tableTheadChart} scope="col">
                                    Sales/Chart
                                </th>
                            )}
                        </tr>
                    </thead>
                    {/* ********************** collections LIST ********************** */}
                    <tbody className={css.tableTbody}>
                        {_.size(list) <= 0 && (
                            <tr role="checkbox" aria-checked="false">
                                <td colSpan={8} className={cx(css.tableTbodyIdxNumber, 'text-light')}>
                                    {Lang.list_no_collections}
                                </td>
                            </tr>
                        )}
                        {_.map(list, (el, i) => (
                            <tr key={i} role="checkbox" aria-checked="false">
                                <td className={css.tableTbodyIdxNumber}>
                                    <span>{i + 1}</span>
                                </td>
                                <td role="cell" scope="row">
                                    <div className={css.tableTbodyBrandName}>
                                        <Link
                                            draggable="false"
                                            to={{
                                                pathname: '/collections/' + el.contract_name + '/' + el.brand_name,
                                                state: el,
                                            }}
                                        >
                                            <div>
                                                <img
                                                    src={
                                                        el.brand_img_src
                                                            ? window.envBackImageHost + el.brand_img_src
                                                            : Default_Thumb
                                                    }
                                                />
                                            </div>
                                        </Link>
                                        {!mobile ? (
                                            <Link
                                                draggable="false"
                                                to={{
                                                    pathname: '/collections/' + el.contract_name + '/' + el.brand_name,
                                                    state: el,
                                                }}
                                            >
                                                <div className={css.name}>
                                                    <span>{el.contract_name}</span>
                                                    <p>{numberWithCommas(el.sttc_total_mint, '')}</p>
                                                </div>
                                            </Link>
                                        ) : null}
                                    </div>
                                </td>

                                {!mobile && (
                                    <td className={css.tableTbodyAveragePrice}>
                                        <div>
                                            <p className={css.volumeFlexP}>
                                                <img
                                                    className={css.kaikasIcon}
                                                    width={18}
                                                    height={18}
                                                    src={iconKaikas}
                                                />
                                                <span>{floatWithCommas(parseFloat(el.tvolume))}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p
                                                className={
                                                    el.average_price_rate < 0 ? css.downPercentage : css.upPercentage
                                                }
                                            >
                                                {el.tvolume_rate}%
                                            </p>
                                        </div>
                                    </td>
                                )}
                                <td className={css.tableTbodyAveragePrice}>
                                    <div>
                                        <p className={css.volumeFlexP}>
                                            <img className={css.kaikasIcon} width={18} height={18} src={iconKaikas} />
                                            <span>{floatWithCommas(parseFloat(el.average_price))}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p
                                            className={
                                                el.average_price_rate < 0 ? css.downPercentage : css.upPercentage
                                            }
                                        >
                                            {el.average_price_rate}%
                                        </p>
                                    </div>
                                </td>
                                <td className={css.tableTbodyVolumePercentage}>
                                    <div>
                                        <p className={css.volumeFlexP}>
                                            <img className={css.kaikasIcon} width={18} height={18} src={iconKaikas} />
                                            <span>{floatWithCommas(parseFloat(el.volume))}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <div>
                                            <p className={el.volume_rate < 0 ? css.downPercentage : css.upPercentage}>
                                                {el.volume_rate}%
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                {/*<td className={css.tableTbodyMarketCap}>*/}
                                {/*    <div >*/}
                                {/*        <p className="MuiTypography-root MuiTypography-body1">$112,244,400</p>*/}
                                {/*    </div>*/}
                                {/*</td>*/}
                                <td className={css.tableTbodyVolume}>
                                    <div>
                                        <p className={css.volumeFlexP}>
                                            <img className={css.kaikasIcon} width={18} height={18} src={iconKaikas} />
                                            <span>{floatWithCommas(parseFloat(el.d7_volume))}</span>
                                        </p>
                                        <p className={el.d7_volume_rate < 0 ? css.downPercentage : css.upPercentage}>
                                            {el.d7_volume_rate}%
                                        </p>
                                    </div>
                                </td>
                                {!mobile && (
                                    <td className={css.tableTbodyVolume}>
                                        <div>
                                            <p className={css.volumeFlexP}>
                                                <span>{floatWithCommas(parseFloat(el.sttc_owner_count))}</span>
                                            </p>
                                            <p className={el.tvolume_rate < 0 ? css.downPercentage : css.upPercentage}>
                                                {' '}
                                            </p>
                                        </div>
                                    </td>
                                )}
                                {!mobile && (
                                    <td className={css.tableTbodyChart}>
                                        <button
                                            type="button"
                                            onClick={() => loadArticleModal('SalesHistory', el.brand_name, el.id)}
                                        >
                                            <span>
                                                <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path>
                                                </svg>
                                            </span>
                                        </button>{' '}
                                        <button
                                            type="button"
                                            onClick={() => loadArticleModal('PriceHistory', el.brand_name, el.id)}
                                        >
                                            <span>
                                                <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"></path>
                                                </svg>
                                            </span>
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
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

export default Dashboard;
