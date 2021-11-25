import React from 'react';
import _ArticleModal from '@/_components/commons/modals/_ArticleModal';
import { useDispatch } from 'react-redux';
import { setKlipQR } from '@/redux/reducers/GlobalStatus.reducer';

const KlipQRCodeModal = () => {
    const dispatch = useDispatch();

    const modalProps = {
        props: {
            mainCanvas: true,
        },
    };

    const closeModal = () => {
        dispatch(setKlipQR(null));
    };
    return (
        <section>
            <_ArticleModal props={modalProps.props} style={{ maxWidth: '420px', zIndex: 99999999 }} />
            <div className="secondBackgroundShadow" onClick={closeModal} />
        </section>
    );
};

export default KlipQRCodeModal;
