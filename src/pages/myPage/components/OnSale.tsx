import React, { useCallback, useEffect, useState } from 'react';
import css from '@/pages/CollectionsDetail/components/Article.module.scss';
import cx from 'classnames';
import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';
import { ArticleModalProps } from '@/_components/commons/modals/_ArticleModal.interfaces.declare';
import { numberWithCommas } from '@/helpers/common.helper';
import { Link } from 'react-router-dom';

import useList from '@/hooks/useList.hook';
import { useLanguages } from '@/hooks/useLanguages.hook';

import MyPageModal from '@/pages/myPage/components/Modal';
import NoItems from '@/_components/commons/NoItems';

import iconKaikas from '@/_statics/images/icon_kaikas.png';
import KlayMint from '@/helpers/linkBlockchainNetwork';
import { getIsOwner } from '@/helpers/klaymint.api';
import Caver from 'caver-js';

const OnSale = ({ loading }) => {
    const dispatch = useDispatch();
    const wallet = useSelector((store: RootState) => store.Wallet);
    const { list, classs } = useSelector((store: RootState) => store.Collections);
    const Lang = useLanguages();

    const [modal, setModal] = useState(false);
    const [modalProps, setModalProps] = useState({} as ArticleModalProps);

    const {
        state,
        onRefresh,
        onAppend,

        pages,
        movePage,

        scrollEventListener,
    } = useList({});

    const ownerOf = async (tokenId, type, contractAddress) => {
        if (type === 'kaikas') {
            const { klaytn }: any = window;
            if (klaytn) {
                const caver = new Caver(klaytn);

                const kip17 = caver.kct.kip17.create(contractAddress);
                const res = await kip17.ownerOf(tokenId);

                return res;
            }
        } else {
            const res = await getIsOwner(tokenId, contractAddress);

            return res.data;
        }
    };

    const modalOnClickHandler = useCallback(
        async (item) => {
            if (list) {
                const currentContract = list.filter((obj) => obj.id === item.contract_list_id);

                // ??????????????? unlisted ??? ????????? ????????? ????????????, DB ?????? ???????????? ??????????????? contract_list_id ??? ???????????? ?????????????????????,
                // ????????? ?????????????????? ???????????? ???????????? ????????? ?????? ?????? ?????????,
                if (currentContract[0].contract_address) {
                    if (currentContract[0].id === 1) {
                        const currentOwner = await ownerOf(
                            item.token_id,
                            wallet.type,
                            currentContract[0].contract_address,
                        );
                        currentContract[0].factory_address = currentOwner;
                    }

                    const klaymint = new KlayMint(
                        currentContract[0]?.contract_address,
                        currentContract[0]?.factory_address,
                        list,
                    );

                    const isWallet = wallet.info.address !== '';
                    const btnStr = isWallet ? 'SELL CANCEL' : 'CONNECT WALLET';
                    const event = isWallet
                        ? klaymint.sellCancelRequest
                        : () => window?.toast('error', Lang.err_msg_fail_connect_wallet);
                    const argument = [item.token_id, dispatch];
                    // const attrArr = item.attributes.filter((item) => item.trait_type !== 'id').map((item) => Object.values(item));

                    setModalProps({
                        collection: currentContract[0],
                        props: {
                            title: `${currentContract[0]?.brand_name} #${item.token_id}`,
                            mainImage: `${item.image_url}`,
                            // mainAttrs: attrArr,
                            footerPrice: item.sales_price,
                            footerButtons: [btnStr],
                            onClick: {
                                event,
                                argument,
                            },
                        },
                    });
                    setModal(true);
                }
            }
        },
        [list],
    );

    useEffect(
        () =>
            scrollEventListener(
                document,
                () => {
                    console.log('on [onSale] Refresh');
                },
                () => {
                    if (loading) return;
                    console.log('on [onSale] load append');
                    //onRefresh(wallet.info.myToken.onSale);
                    /** test code */
                    //__TEST__fakeAsyncFunciton();
                    //asyncFinxtion();
                },
            ),
        [],
    );

    useEffect(() => {
        onRefresh(wallet.info.myToken.onSale);
    }, [wallet?.info?.myToken?.onSale]);

    // useEffect(() => {
    //     modal ? (document.body.style.overflowY = 'hidden') : (document.body.style.overflowY = 'unset');
    // }, [modal]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className={cx('row', css.ArticleSection, css.myPageArticleList)}>
                <div>
                    <Link to="/HelpCancelCanter">
                        <h4>{Lang.help_cancel_center_check}</h4>
                    </Link>
                </div>
                {_.size(state.view_list) <= 0 && <NoItems>{Lang.list_no_sales}</NoItems>}
                {_.map(state.view_list, (item) => {
                    return (
                        <div
                            key={item.id}
                            className={cx('col-md-2', css.articleContainer)}
                            onClick={() => modalOnClickHandler(item.data)}
                        >
                            <div className={css.card}>
                                <div className={css.imgContainer}>
                                    <img src={item.data.image_url} alt="nft" />
                                </div>
                                <div className={css.txtContainer}>
                                    <h5>#{item.data.token_id}</h5>
                                    {/* <h5>Aurory</h5> */}
                                    <button className="col-12 text-break" type="button">
                                        <div className={css.buttonImgSection}>
                                            <img alt="KLAY" src={iconKaikas} />
                                        </div>
                                        <span className="overflow-visible">
                                            {numberWithCommas(item.data.sales_price, '')}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>
            {modal ? <MyPageModal setModal={setModal} modalProps={modalProps} /> : null}
        </>
    );
};
export default OnSale;
