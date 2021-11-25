import React from 'react';
import _ArticleModal from '@/_components/commons/modals/_ArticleModal';
import { ArticleModalProps } from '@/_components/commons/modals/_ArticleModal.interfaces.declare';

interface Props {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    modalProps: ArticleModalProps;
}

const LastPriceHistoryModal = ({ modalProps, setModal }: Props) => {
    return (
        <section>
            <_ArticleModal
                props={modalProps.props}
                setModal={setModal}
                style={{ zIndex: 1000001 }}
                collection={'tempProps_case1'}
            />
            <div className="secondBackgroundShadow" onClick={() => setModal(false)} />
        </section>
    );
};
export default LastPriceHistoryModal;
