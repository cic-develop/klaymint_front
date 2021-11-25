import React, { useEffect, useState } from 'react';
import css from '@/pages/CollectionsDetail/components/Article.module.scss';
import cx from 'classnames';
import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';
import { ArticleModalProps } from '@/_components/commons/modals/_ArticleModal.interfaces.declare';

import useList from '@/hooks/useList.hook';
import { useLanguages } from '@/hooks/useLanguages.hook';

import MyPageModal from '@/pages/myPage/components/Modal';
import NoItems from '@/_components/commons/NoItems';
import KlayMint from '@/helpers/linkBlockchainNetwork';

const Unlisted = ({ loading }) => {
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

    const modalOnClickHandler = async (item) => {
        const currentContract = list.filter(
            (obj) => obj.contract_address.toLowerCase() === item.contractAddress.toLowerCase(),
        );

        const currentClasss = classs[currentContract[0]?.id];

        // 나중에 같은 컨트랙트에서 두개의 팩토리가 나오는 경우에는 로직을 수정해야하는 부분
        // 인덱스가 0이 아니라 별도의 방법을 통해 두개의 팩토리중 해당 팩토리를 찾아야함
        const klaymint = new KlayMint(currentContract[0]?.contract_address, currentContract[0]?.factory_address, list);

        const isWallet = wallet.info.address !== '';
        const attrArr = item.attributes?.filter((item) => item.trait_type !== 'id').map((item) => Object.values(item));

        // 실제 is_class 를 0으로 두는 테스트
        // currentContract[0].is_class = 0;

        setModalProps({
            collection: currentContract[0],
            props: {
                title: `${item.name}`,
                mainImage: `${item.image}`,
                mainDesc: item.description,
                mainAttrs: attrArr,
                mainAttrDesc: currentClasss,
                footerInput: true,
                footerButtons: isWallet ? ['SELL'] : ['CONNECT WALLET'],
                onClick: {
                    event: isWallet
                        ? klaymint.sellRequest
                        : () => window?.toast('error', Lang.err_msg_fail_connect_wallet),
                    argument: [item.name?.indexOf('#') === -1 ? item.name : item.name?.split('#')[1], dispatch],
                },
            },
        });
        setModal(true);
    };

    // const modalOnClickHandler = (item) => {
    //
    //     console.log(item);
    //
    //     const isWallet = wallet.info.address !== '';
    //     const attrArr = item.attributes.filter((item) => item.trait_type !== 'id').map((item) => Object.values(item));
    //
    //     setModal(true);
    //     setModalProps({
    //         props: {
    //             title: `${item.name}`,
    //             mainImage: `${item.image}`,
    //             mainDesc: item.description,
    //             mainAttrs: attrArr,
    //             mainAttrDesc: true,
    //             footerInput: true,
    //             footerButtons: isWallet ? ['SELL'] : ['CONNECT WALLET'],
    //             onClick: {
    //                 event: isWallet
    //                     ? klaymint.sellRequest
    //                     : () => window?.toast('error', Lang.err_msg_fail_connect_wallet),
    //                 argument: [item.name?.indexOf('#') === -1 ? item.name : item.name?.split('#')[1], dispatch],
    //             },
    //         },
    //     });
    // };

    useEffect(
        () =>
            scrollEventListener(
                document,
                () => {
                    console.log('on [unlistied] Refresh');
                },
                () => {
                    if (loading) return;
                    console.log('on [unlistied] load append');
                    //onRefresh(wallet.info.myToken.unlisted);
                    /** test code */
                    //__TEST__fakeAsyncFunciton();
                    //asyncFinxtion();
                },
            ),
        [],
    );

    useEffect(() => {
        onRefresh(wallet.info.myToken.unlisted);
    }, [wallet?.info?.myToken?.unlisted]);

    useEffect(() => {
        modal ? (document.body.style.overflowY = 'hidden') : (document.body.style.overflowY = 'unset');
    }, [modal]);

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
                                    <h5>{item.data.name}</h5>
                                    <button type="button">
                                        <span>SELL</span>
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
export default Unlisted;
