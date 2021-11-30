import React, { useEffect, useState, useRef, useCallback } from 'react';
import css from './Article.module.scss';
import cx from 'classnames';
import _ from 'lodash';
import axios from 'axios';
import { Slide } from 'react-reveal';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';
import { ArticleModalProps } from '@/_components/commons/modals/_ArticleModal.interfaces.declare';
import { numberWithCommas, numberToEng } from '@/helpers/common.helper';

import useList from '@/hooks/useList.hook';
import { useLanguages } from '@/hooks/useLanguages.hook';

import DetailModal from '@/pages/CollectionsDetail/components/Article.DetailModal';
import NoItems from '@/_components/commons/NoItems';

import iconKaikas from '@/_statics/images/icon_kaikas.png';
import KlayMint from '@/helpers/linkBlockchainNetwork';
import { remoteModalOpener } from '@/_components/commons/modals';
import { getLimitSalesList, postExceptionCorsHandler } from '@/helpers/klaymint.api';
import { CollectionsDetailSearchProps } from '@/pages/CollectionsDetail/CollectionsDetail.interfaces.declare';

interface Props {
    search: CollectionsDetailSearchProps;
    collection: any;
}

const Article: React.FC<any> = ({ search, collection }: Props): JSX.Element => {
    const { classs, list } = useSelector((store: RootState) => store.Collections);

    const klaymint = new KlayMint(collection.contract_address, collection.factory_address, list);

    const moreRef = useRef(null);
    const Lang = useLanguages();
    const [loading, setLoading] = useState<boolean>(false);
    const [listEnd, setListEnd] = useState<boolean>(false);

    const [modal, setModal] = useState(false);
    const [modalProps, setModalProps] = useState({} as ArticleModalProps);

    const {
        state,
        onRefresh,
        onAppend,

        pages,
        movePage,
        onCallback,
        scrollEventListener,
    } = useList({});

    const wallet = useSelector((store: RootState) => store.Wallet);
    const dispatch = useDispatch();

    const onMintHandler = useCallback(() => {
        if (wallet.type === 'none') {
            remoteModalOpener('conn_modal');
        }
    }, [wallet]);

    const loadArticleModal = async (item) => {
        const isWallet = wallet.info.address !== '';
        const isOwner = wallet.info.address.toLowerCase() === item.data.owner_address.toLowerCase();

        let response;

        item.data.attributes = item.data.attributes.replace(
            'https://ipfs.io/ipfs/',
            'https://klaymint.mypinata.cloud/ipfs/',
        );
        item.data.attributes = item.data.attributes.replace('ipfs://', 'https://klaymint.mypinata.cloud/ipfs/');

        try {
            response = await axios.get(item.data.attributes);
        } catch (error) {
            response = await postExceptionCorsHandler(item.data.attributes);
        }

        const attrArr = response.data.attributes
            .filter((item) => item.trait_type !== 'id')
            .map((item) => Object.values(item));
        const currentClasss = classs[collection?.id];

        setModalProps({
            collection: collection,
            props: {
                title: `${collection.brand_name} #${item.data.token_id}`,
                mainImage: item.data.image_url,
                mainDescButtons: [
                    `OWNED BY ${item.data.owner_address.slice(0, 3)}...${item.data.owner_address.slice(-3)}`,
                ],
                mainDesc: response.data.description,
                mainAttrs: attrArr,
                mainAttrDesc: currentClasss,
                footerPrice: item.data.sales_price,
                // footerPriceHistory: item.data.last_price,
                footerPriceHistory: item.data.last_price !== '0.00' ? item.data.last_price : null,
                footerButtons: !isWallet ? ['CONNECT WALLET'] : !isOwner ? ['BUY'] : ['SELL CANCEL'],
                onClick: {
                    event: !isWallet ? onMintHandler : !isOwner ? klaymint.buyRequest : klaymint.sellCancelRequest,
                    argument: !isOwner
                        ? [item.data.token_id, item.data.sales_price, dispatch]
                        : [item.data.token_id, dispatch],
                },
            },
        });
        setModal(true);
    };

    const requestMoreList = async (state, search = {}, reset = false, loading, listEnd) => {
        if (loading || listEnd) return; //로딩중이거나 리스트 마지막이면 요청 안함
        //if (!collection.id) return; //첫 렌더의 props 값에 contractListId 가 없으면 요청안함

        await setLoading(true);
        const { cnt_print, list_end_iterator } = state.pagination;

        try {
            const res = await getLimitSalesList({
                lastEl: reset ? null : list_end_iterator ? list_end_iterator.data : null,
                cnt_print: cnt_print,
                search: search,
                contractListId: collection.id,
            });
            if (res.data.length < cnt_print) {
                if (listEnd) return;

                onAppend(res.data);
                setListEnd(true);
            } else {
                console.log('request getLimitSalesList333', res.data);
                onAppend(res.data);
            }
        } catch (error) {
            console.log(error);
            window?.toast('error', Lang.err_msg_fail_request);
        } finally {
            setLoading(false);
        }
    };
    /************************************************************
     * 스크롤 이밴트 핸들링 1회 등록
     ***********************************************************/
    useEffect(
        () =>
            scrollEventListener(
                document,
                () => {
                    console.log('on [collections] Refresh');
                },
                () => {
                    console.log('on [collections] load append more list');
                    moreRef?.current?.click();
                },
            ),
        [],
    );

    /************************************************************
     * 검색어 변경에 의한 데이터 재요청
     ************************************************************/
    useEffect(() => {
        const research = async () => {
            await onRefresh({});
            await setListEnd(false);
            await setLoading(false);
            //리스트가 초기화 되면 데이터 요청
            requestMoreList(state, search, true, false, false);
        };
        research();
    }, [search]);

    useEffect(() => {
        modal ? (document.body.style.overflowY = 'hidden') : (document.body.style.overflowY = 'unset');
    }, [modal]);

    return (
        <>
            <section className={cx('row', css.ArticleSection)}>
                {_.size(state.view_list) <= 0 && <NoItems>{Lang.list_no_sales}</NoItems>}
                {_.map(state.view_list, (item, index) => {
                    return (
                        <Slide key={item.id} duration={500} bottom cascade>
                            <div
                                className={cx('col-md-2', css.articleContainer)}
                                onClick={() => loadArticleModal(item)}
                            >
                                <div className={css.card}>
                                    <div className={css.imgContainer}>
                                        <img src={item.data.image_url} alt="nft" />
                                    </div>
                                    <div className={css.txtContainer}>
                                        <h5>
                                            {collection.brand_view_name} #{item.data.token_id}
                                        </h5>
                                        <h5>{item.data.class}</h5>
                                        <button className="col-12 text-break" type="button">
                                            <div className={css.buttonImgSection}>
                                                <img alt="KLAY" src={iconKaikas} />
                                            </div>
                                            <span className="overflow-visible">
                                                {numberWithCommas(item.data.sales_price, '')}
                                            </span>
                                        </button>
                                    </div>
                                    {item.data.last_price !== '0.00' && item.data.last_price !== null ? (
                                        <span className={css.lastPriceSpan}>
                                            {/* last <img alt="KLAY" src={iconKaikas} /> {numberToEng(item.data.last_price)} */}
                                            last <img alt="KLAY" src={iconKaikas} /> {item.data.last_price}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </Slide>
                    );
                })}
                {/* 로딩 & 더보기 버튼 */}
                <div
                    ref={moreRef}
                    className="d-flex justify-content-center"
                    onClick={() => {
                        requestMoreList(state, search, false, loading, listEnd);
                    }}
                >
                    <div className={cx('card border-0 col-10', css.moreBtn)}>
                        <div className="card-body text-center text-white">
                            {loading ? (
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : listEnd ? (
                                Lang.list_end_response_lock
                            ) : (
                                Lang.list_more_item
                            )}
                        </div>
                    </div>
                </div>
            </section>
            {/* Item 클릭시 Modal 열기 */}
            {modal ? <DetailModal setModal={setModal} modalProps={modalProps} collection={collection} /> : null}
        </>
    );
};

export default Article;
