import React, { useEffect, useState, useCallback } from 'react';
import { Routers } from '@/routers';
import { useDispatch } from 'react-redux';
import { detectedBreakpoint, isMobile } from '@/redux/reducers/GlobalStatus.reducer';
import { getServerInfo } from '@/helpers/klaymint.api';
import { loadCollections } from '@/redux/reducers/Collections.reducer';

import Layout from '@/pages/_layouts';
import GLoader from '@/_components/commons/loaders/global_loader';
import Toast from '@/_components/commons/toasts/Toast_bs5';

import Maintenance from '@/pages/Maintenance';
import Footer from '@/pages/_layouts/components/Footer';

const App: React.FC<any> = (): JSX.Element => {
    const dispatch = useDispatch();
    const [srv, setSrv] = useState(null);

    const checkInfo = useCallback(() => {
        if (!srv) return;
        console.log('sss');
        getServerInfo()
            .then((res) => {
                if (!res?.data) {
                    return;
                }
                console.log(srv.cfg_refresh_check_time, res.data[0].cfg_refresh_check_time);
                if (srv.cfg_refresh_check_time !== res.data[0].cfg_refresh_check_time) {
                    console.log('새로고침!!!!!!');
                }
            })
            .catch((err) => {});
    }, [srv]);

    /**
     * Detected Window width breakpoint
     */
    useEffect(() => {
        let pass = 0;
        const detectBreakpoint = () => {
            if (++pass % 10 === 0) {
                dispatch(detectedBreakpoint());
                dispatch(isMobile());
            }
        };
        window.addEventListener('resize', () => detectBreakpoint());

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

    // useEffect(() => {
    //     // 초기 렌더에서 전역변수에 저장할 contractList info 를 요청한다.
    //     getServerInfo()
    //         .then((res) => {
    //             if (!res?.data) {
    //                 return;
    //             }
    //             setSrv(res.data[0]);
    //             console.log(res.data[0].cfg_refresh_check_time);
    //         })
    //         .catch((err) => {});

    //     setInterval(checkInfo, 1000);
    // }, []);

    // return (
    //     <>
    //         <Maintenance />
    //         <Footer />
    //     </>
    // );

    return (
        <>
            <GLoader />
            <Toast />
            <Layout>
                <Routers />
            </Layout>
        </>
    );
};
export default App;
