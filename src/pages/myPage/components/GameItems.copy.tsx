import React, { useEffect, useState } from 'react';
import css from './GameItems.module.scss';
import cx from 'classnames';
import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';
import { ArticleModalProps } from '@/_components/commons/modals/_ArticleModal.interfaces.declare';

import useList from '@/hooks/useList.hook';
import { useLanguages } from '@/hooks/useLanguages.hook';

import NoItems from '@/_components/commons/NoItems';

import KlayMint from '@/helpers/linkBlockchainNetwork';

import { getSalesList } from '@/helpers/klaymint.api';
import iconKaikas from '@/_statics/images/icon_kaikas.png';

const GameItemsCopy = ({ loading }) => {
    const wallet = useSelector((store: RootState) => store.Wallet);
    const { list } = useSelector((store: RootState) => store.Collections);
    const klaymint = new KlayMint('', '', list);

    const Lang = useLanguages();

    const [tokenList, setTokenList] = useState([]);

    const [modal, setModal] = useState(false);
    const [modalProps, setModalProps] = useState({} as ArticleModalProps);

    const dispatch = useDispatch();

    const {
        state,
        onRefresh,
        onAppend,

        pages,
        movePage,

        scrollEventListener,
    } = useList({});

    const modalOnClickHandler = (item) => {
        const isOwner = item.ownerAddress.toLowerCase() === wallet.info.address.toLowerCase();
        const btnStr = isOwner ? 'SELL CANCEL' : 'BUY';
        const event = isOwner ? klaymint.sellCancelRequest : klaymint.buyRequest;
        const argument = isOwner ? [item.tokenId, dispatch] : [item.tokenId, item.salesPrice, dispatch];

        setModal(true);
        setModalProps({
            props: {
                title: `PoPo #${item.tokenId}`,
                mainImage: `${item.image}`,
                footerButtons: [btnStr],
                onClick: {
                    event,
                    argument,
                },
            },
        });
    };

    useEffect(() => {
        getSalesList().then((res) => setTokenList(res.data.items));
    }, []);

    useEffect(
        () =>
            scrollEventListener(
                document,
                () => {
                    console.log('on [gameItem] Refresh');
                },
                () => {
                    if (loading) return;
                    console.log('on [gameItem] load append');
                    //onRefresh(wallet.info.myToken.gameItem);
                    /** test code */
                    //__TEST__fakeAsyncFunciton();
                    //asyncFinxtion();
                },
            ),
        [],
    );

    useEffect(() => {
        onRefresh(wallet.info.myToken.gameItem);
    }, [wallet?.info?.myToken?.gameItem]);

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
                {_.keys(state.view_list).length <= 0 && <NoItems>{Lang.list_no_my_items}</NoItems>}
                {_.map(state.view_list, (item) => {
                    return (
                        <div
                            key={item.id}
                            className={cx('col-md-2', css.articleContainer)}
                            onClick={() => modalOnClickHandler(item.data)}
                        >
                            <div className={css.card}>
                                <div className={css.imgContainer}>
                                    <img src={item.data.image} alt="nft" />
                                </div>
                                <div className={css.txtContainer}>
                                    <h5>PoPo #{item.data.tokenId}</h5>
                                    <button type="button">
                                        <div className={css.buttonImgSection}>
                                            <img alt="KLAY" src={iconKaikas} />
                                        </div>
                                        <span>{item.data.salesPrice}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>
        </>
    );
};
export default GameItemsCopy;
