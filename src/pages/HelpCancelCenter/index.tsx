import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import css from '@/pages/CollectionsDetail/components/Article.module.scss';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import NoItems from '@/_components/commons/NoItems';
import iconKaikas from '@/_statics/images/icon_kaikas.png';
import { numberWithCommas } from '@/helpers/common.helper';
import MyPageModal from '@/pages/myPage/components/Modal';
import { getAllToken_in_factory, getAllToken_in_for_move_factory } from '@/helpers/klaytn.api';
import { enNode, factoryAddress, sellCancelNFTABI } from '@/helpers/_common.linkChain';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';
import { useLanguages } from '@/hooks/useLanguages.hook';
import { ArticleModalProps } from '@/_components/commons/modals/_ArticleModal.interfaces.declare';
import useList from '@/hooks/useList.hook';
import KlayMint from '@/helpers/linkBlockchainNetwork';
import { setPromiseAll, toKlayFromPeb } from '@/helpers/_common';
import { setAddress } from '@/redux/reducers/Wallet.reducer';
import Caver from 'caver-js';
import axios from 'axios';

const HelpCancelCanter = () => {
    const dispatch = useDispatch();
    const { list: colList } = useSelector((store: RootState) => store.Collections);
    const { contractListInfo } = useSelector((store: RootState) => store.GlobalStatus);

    const Lang = useLanguages();

    const wallet = useSelector((store: RootState) => store.Wallet);

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

    const lostTokenModalOnClickHandler = (item) => {
        const currentContract = colList.filter(
            (obj) => obj.contract_address.toLowerCase() === item.contractAddress.toLowerCase(),
        );
        const tokenId = item.name.split('#')[1];

        // 나중에 같은 컨트랙트에서 두개의 팩토리가 나오는 경우에는 로직을 수정해야하는 부분
        // 인덱스가 0이 아니라 별도의 방법을 통해 두개의 팩토리중 해당 팩토리를 찾아야함
        const klaymint = new KlayMint(currentContract[0].contract_address, currentContract[0].factory_address, colList);

        const isWallet = wallet.info.address !== '';
        const btnStr = isWallet ? 'SELL CANCEL' : 'CONNECT WALLET';
        const event = isWallet
            ? klaymint.sellCancelRequest
            : () => window?.toast('error', Lang.err_msg_fail_connect_wallet);
        const argument = [tokenId, dispatch];

        setModalProps({
            collection: currentContract[0],
            props: {
                title: `${item.name}`,
                mainImage: `${item.image}`,
                footerButtons: [btnStr],
                onClick: {
                    event,
                    argument,
                },
            },
        });
        setModal(true);
    };

    const [loading, setLoading] = useState(false);
    const [list, setList]: any = useState([] as any);
    const getToken_in_factory_by_address = async () => {
        const contractAddress = colList.map((item) => item.contract_address);
        const factoryAddress = colList.map((item) => {
            return {
                factory_address: item.factory_address,
            };
        });
        factoryAddress.push({ factory_address: '0x98649369e4ca48eA41351BBC75A562BC9EeA7662' });

        const arr = [];

        const getAllToken_in_factory_loop = async (factoryAddress, contractAddress, cursor?) => {
            const res = await getAllToken_in_factory(factoryAddress, contractAddress, cursor);
            arr.push(res.data.items);
            if (res.data.cursor !== '')
                return getAllToken_in_factory_loop(factoryAddress, contractAddress, res.data.cursor);
            else {
                const mySalesTokenList = arr
                    .flat()
                    .filter(
                        (item) => item.lastTransfer?.transferFrom.toUpperCase() === wallet.info.address.toUpperCase(),
                    );

                const arr2 = [];
                await setPromiseAll(mySalesTokenList, async (item) => {
                    try {
                        const token = await axios.get(item.extras.tokenUri);
                        token.data.contractAddress = item.contractAddress;
                        arr2.push(token.data);
                    } catch (e) {
                        const case2 = item.extras.tokenUri.replace('ipfs://', 'https://klaymint.mypinata.cloud/ipfs/');
                        const token = await axios.get(case2);
                        token.data.image = token.data.image.replace('ipfs://', 'https://klaymint.mypinata.cloud/ipfs/');
                        token.data.contractAddress = item.contractAddress;
                        arr2.push(token.data);
                    }
                });

                return arr2;
            }
        };

        for await (const item of factoryAddress) {
            const arr2A = await getAllToken_in_factory_loop(item.factory_address, contractAddress);
            const temp = [...list];
            const newArr = temp.concat(arr2A);
            setList(newArr);
        }
    };

    useEffect(() => {
        setLoading(true);
        onRefresh(wallet.info.myToken.onSale);
        getToken_in_factory_by_address().then(() => setLoading(false));
    }, []);

    useEffect(() => {
        const klaymint = new KlayMint('', '', colList);

        klaymint.getToken(wallet, colList).then(async (res) => {
            const caver = new Caver(enNode);
            const balance = await caver.klay.getBalance(wallet.info.address);
            const klayBalance = toKlayFromPeb(caver, balance);

            await dispatch(
                setAddress({
                    address: wallet.info.address,
                    balance: klayBalance,
                    myToken: {
                        ...wallet.info.myToken,
                        unlisted: res.unlisted,
                        onSale: res.onSale,
                    },
                }),
            );
        });
    }, [wallet?.isConn]);

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
        <main className="pt-5">
            <section className={cx('row', css.ArticleSection, css.myPageArticleList)}>
                {list.length <= 0 ? (
                    <NoItems>{Lang.list_no_sales}</NoItems>
                ) : (
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2>{Lang.help_cancel_center}</h2>
                    </div>
                )}
                {list.length > 0
                    ? list.map((item) => {
                          return (
                              <div
                                  key={item.name}
                                  className={cx('col-md-2', css.articleContainer)}
                                  onClick={() => lostTokenModalOnClickHandler(item)}
                              >
                                  <div className={css.card}>
                                      <div className={css.imgContainer}>
                                          <img src={item.image} alt="nft" />
                                      </div>
                                      <div className={css.txtContainer}>
                                          <h5>#{item.name}</h5>
                                      </div>
                                  </div>
                              </div>
                          );
                      })
                    : null}
            </section>
            {modal ? <MyPageModal setModal={setModal} modalProps={modalProps} /> : null}
        </main>
    );
};

export default HelpCancelCanter;
