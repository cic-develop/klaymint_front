import React, { useEffect } from 'react';
import _ArticleModal from '@/_components/commons/modals/_ArticleModal';
import { ArticleModalProps } from '@/_components/commons/modals/_ArticleModal.interfaces.declare';
import { CollectionsDetailContractInfoProps } from '@/reducers/GlobalStatus.reducer';
import _notExistClassArticleModal from '@/_components/commons/modals/_notExistClassArticleModal';

interface Props {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    modalProps: ArticleModalProps;
    collection: any;
}

const DetailModal = ({ modalProps, setModal, collection }: Props) => {
    return (
        <section>
            {collection.is_class ? (
                <_ArticleModal props={modalProps.props} setModal={setModal} collection={collection} />
            ) : (
                <_notExistClassArticleModal props={modalProps.props} setModal={setModal} collection={collection} />
            )}
            <div className="backgroundShadow" onClick={() => setModal(false)} />
        </section>
    );
};
export default DetailModal;
