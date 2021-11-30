import React, { useEffect, useState, useCallback } from 'react';
import { Routers } from '@/routers';
import { useDispatch } from 'react-redux';
import { detectedBreakpoint, isMobile } from '@/redux/reducers/GlobalStatus.reducer';
import { getServerInfo } from '@/helpers/klaymint.api';
import { loadCollections } from '@/redux/reducers/Collections.reducer';

import webSocket from '@/helpers/websocket.helper';

import Layout from '@/pages/_layouts';
import GLoader from '@/_components/commons/loaders/global_loader';
import Toast from '@/_components/commons/toasts/Toast_bs5';

import TermOfUse from '@/pages/_layouts/components/TermOfUse';
import { ModalButton, Modal } from '@/_components/commons/modals';

import Maintenance from '@/pages/Maintenance';
import Footer from '@/pages/_layouts/components/Footer';
import axios from 'axios';

const App: React.FC<any> = (): JSX.Element => {
    const dispatch = useDispatch();

    /**
     * Detected Window width breakpoint
     */
    useEffect(() => {
        //setTimeout(() => console.log(webSocket.state()), 1000);
        //webSocket.sendMessage('pppppppdkjhfkdsjhfdskhfksd');

        //Browser Window Size Detect Handler
        let pass = 0;
        const detectBreakpoint = () => {
            if (++pass % 10 === 0) {
                dispatch(detectedBreakpoint());
                dispatch(isMobile());
            }
        };
        window.addEventListener('resize', detectBreakpoint);

        return () => {
            window.removeEventListener('resize', () => {
                detectBreakpoint();
            });
        };
    }, []);

    useEffect(() => {
        // 초기 렌더에서 전역변수에 저장할 contractList info 를 요청한다.
        dispatch(loadCollections());
    }, []);

    // return (
    //     <>
    //         <Maintenance />
    //         <Footer />
    //     </>
    // );
    //

    return (
        <>
            {/*<img src="https://klayrabbit.s3.ap-northeast-2.amazonaws.com/images/2700.png" alt="" />*/}
            <GLoader />
            <Toast />
            <Layout>
                <Routers />
            </Layout>
        </>
    );
};
export default App;
