import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';

import { resetWallet } from '@/redux/reducers/Wallet.reducer';
import { RootState } from '@/redux/connectors.redux';

import { useLanguages } from '@/hooks/useLanguages.hook';

import Loader from '@/_components/commons/loaders/global_loader';

const Secure: React.FC<any> = (props): JSX.Element => {
    const { className, children } = props;

    const histroy = useHistory();
    const Lang = useLanguages();
    const dispatch = useDispatch();
    const wallet = useSelector((store: RootState) => store.Wallet);
    const [isConn, setConnStatus] = useState(false);

    useEffect(() => {
        checkWalletHandler()
            .then((res) => {
                if (!res) {
                    histroy.push('/');
                    setConnStatus(false);
                    window?.toast('error', Lang.err_msg_access_denaid);
                } else {
                    setConnStatus(true);
                }
            })
            .catch(() => setConnStatus(false));
    });

    const checkWalletHandler = async () => {
        switch (wallet.type) {
            case 'kaikas': {
                const { klaytn }: any = window;
                const isConnKaikas = await klaytn?._kaikas.isUnlocked();

                if (!isConnKaikas) {
                    dispatch(resetWallet());
                    return false;
                }
                //pass...
                break;
            }
            case 'klip': {
                //pass...
                break;
            }
            default: {
                return false;
            }
        }
        //...pass
        return true;
    };

    return (
        <>
            {isConn ? (
                <div className={className} onClick={checkWalletHandler} aria-disabled={isConn}>
                    {isConn ? children : <div>Locked</div>}
                </div>
            ) : (
                <Loader />
            )}
        </>
    );
};

export default Secure;
