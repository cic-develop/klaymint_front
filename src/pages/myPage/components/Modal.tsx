import React from 'react';
import _ArticleModal from '@/_components/commons/modals/_ArticleModal';
import { ArticleModalProps } from '@/_components/commons/modals/_ArticleModal.interfaces.declare';
import _notExistClassArticleModal from '@/_components/commons/modals/_notExistClassArticleModal';

interface Props {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    modalProps: ArticleModalProps;
}

const MyPageModal = ({ modalProps, setModal }: Props) => {
    const closeModal = () => setModal(false);

    return (
        <section>
            {modalProps.collection.is_class ? (
                <_ArticleModal props={modalProps.props} setModal={setModal} collection={modalProps.collection} />
            ) : (
                <_notExistClassArticleModal
                    props={modalProps.props}
                    setModal={setModal}
                    collection={modalProps.collection}
                />
            )}
            <div className="backgroundShadow" onClick={closeModal} />
        </section>
    );
};
export default MyPageModal;
