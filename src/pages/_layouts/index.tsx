import Reacet, { useEffect } from 'react';
import { Slide } from 'react-reveal';

import Header from '@/pages/_layouts/components/Header';
import Footer from '@/pages/_layouts/components/Footer';
import RightArea from '@/pages/_layouts/components/RightArea';
import ImageSlider from '@/pages/_layouts/components/ImageSlider';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';
import KlipQRCodeModal from '@/pages/_layouts/components/KlipQRCodeModal';

const Layout: React.FC<any> = (props: any): JSX.Element => {
    const { children } = props;
    const { klipQR } = useSelector((store: RootState) => store.GlobalStatus);

    return (
        <>
            <div className="container-fluid min-vh-100 m-0 p-0">
                <Header />
                {/* 페이지 해더 */}
                {/* 좌측 메인 메뉴 */}

                {/* 메인 컨텐츠 영역 */}
                {children}

                {klipQR ? <KlipQRCodeModal /> : null}

                {/* Fixed Div -- z Index 때문에 콘텐츠보다 아래에 랜더링 */}
            </div>
            <Slide bottom>
                <Footer />
            </Slide>
            <RightArea />
        </>
    );
};

export default Layout;
