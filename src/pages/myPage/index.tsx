import React, { useEffect, useState } from 'react';

import { setToken } from '@/redux/reducers/Wallet.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';
import { useLanguages } from '@/hooks/useLanguages.hook';

import cx from 'classnames';
import css from './myPageGlobal.module.scss';

import OnSale from '@/pages/myPage/components/OnSale';
import Unlisted from '@/pages/myPage/components/Unlisted';
import KlayMint from '@/helpers/linkBlockchainNetwork';
import GameItemsCopy from '@/pages/myPage/components/GameItems.copy';
import GameItems from '@/pages/myPage/components/GameItems';

const MyPage = () => {
    const { list } = useSelector((store: RootState) => store.Collections);
    const dispatch = useDispatch();
    const klaymint = new KlayMint('', '', list);

    const wallet = useSelector((store: RootState) => store.Wallet);
    const Lang = useLanguages();

    const [currentContent, setCurrentContent] = useState('UNLISTED');

    const [loading, setLoading] = useState<boolean>(false);
    const [modal, setModal] = useState({
        onSale: false,
        unlisted: false,
    });

    const loadTokensHandler = async () => {
        console.log('myPage Update');

        if (wallet?.type !== 'none') {
            const { klaytn }: any = window;
            setLoading(true);

            if (klaytn || wallet?.type === 'klip') {
                klaymint
                    .getToken(wallet, list)
                    .then((res) => {
                        dispatch(
                            setToken({
                                ...wallet.info.myToken,
                                unlisted: res.unlisted,
                                onSale: res.onSale,
                            }),
                        );
                        setLoading(false);
                    })
                    .catch((err) => {
                        dispatch(
                            setToken({
                                ...wallet.info.myToken,
                                unlisted: [],
                                onSale: [],
                            }),
                        );
                        window.toast('error', Lang.err_msg_fail_request);
                        console.error('load token error :: ', err);
                        setLoading(false);
                    });
            }
        }
    };

    const setCurrentContentHandler = (content: string) => {
        setCurrentContent(content);
        //loadTokensHandler();
    };

    useEffect(() => {
        loadTokensHandler();
    }, [wallet.isConn, wallet?.type, wallet.info.address]);

    useEffect(() => {
        if (wallet?.type !== 'none') {
            klaymint
                .getToken(wallet, list)
                .then((res) => {
                    dispatch(
                        setToken({
                            ...wallet.info.myToken,
                            unlisted: res.unlisted,
                            onSale: res.onSale,
                        }),
                    );
                })
                .catch((err) => {
                    dispatch(
                        setToken({
                            ...wallet.info.myToken,
                            unlisted: [],
                            onSale: [],
                        }),
                    );
                    window.toast('error', Lang.err_msg_fail_request);
                    console.error('load token error :: ', err);
                    setLoading(false);
                });
        }
    }, [currentContent]);

    return (
        <>
            <main className={cx('mt-5 pt-5', css.myPageSection)}>
                <div className={cx('row')}>
                    <div className="col-md-4">
                        <h2
                            className={currentContent === 'UNLISTED' ? css.onNeonText : css.offNeonText}
                            onClick={() => setCurrentContentHandler('UNLISTED')}
                        >
                            UNLISTED
                        </h2>
                    </div>
                    <div className="col-md-4">
                        <h2
                            className={currentContent === 'ON SALE' ? css.onNeonText : css.offNeonText}
                            onClick={() => setCurrentContentHandler('ON SALE')}
                        >
                            ON SALE
                        </h2>
                    </div>
                    <div className="col-md-4">
                        <h2
                            className={currentContent === 'Mini GAME' ? css.onNeonText : css.offNeonText}
                            onClick={() => setCurrentContentHandler('Mini GAME')}
                        >
                            MINI GAME
                        </h2>
                    </div>
                </div>
            </main>
            {currentContent === 'UNLISTED' && <Unlisted loading={loading} />}
            {currentContent === 'ON SALE' && <OnSale loading={loading} />}
            {currentContent === 'Mini GAME' && <GameItemsCopy loading={loading} />}

            {modal.onSale || modal.unlisted ? (
                <div className="backgroundShadow" onClick={() => setModal({ onSale: false, unlisted: false })} />
            ) : null}
        </>
    );
};

export default MyPage;
