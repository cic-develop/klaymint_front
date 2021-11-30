import React from 'react';
import cx from 'classnames';
import { useLanguages } from '@/hooks/useLanguages.hook';
import TermOfUse from '@/pages/_layouts/components/TermOfUse';
import { ModalButton, Modal } from '@/_components/commons/modals';
import footerLogo from '@/_statics/images/footer-logo.png';
import css from '../_layout.module.scss';

const Footer: React.FC<any> = (): JSX.Element => {
    const Lang = useLanguages();
    const openPage = (href: string) => window.open(href);

    return (
        <>
            <footer className="bottom-0 m-0 p-0">
                <div className={cx('row align-items-center text-center py-3', css.mainFooter)}>
                    <div className="col-4">
                        <img width={64} src={footerLogo} alt="klaymintFooterLogo" />
                    </div>
                    <div className={cx('col-4 align-items-center text-center', css.concatContainer)}>
                        <div
                            onClick={() => openPage('https://forms.gle/5BtCSpBvLtJ7LLdHA')}
                            className={css.footerInlineDisplay}
                        >
                            <i className="fas fa-file-alt" />
                            <p>Listing Contact</p>
                        </div>
                        <div onClick={() => openPage('mailto:klaytn@klaymint.io')} className={css.footerInlineDisplay}>
                            <i className="fas fa-envelope" />
                            <p>klaytn@klaymint.io</p>
                        </div>
                    </div>
                    <div className={cx('col-4', css.termOfUseContainer)}>
                        <div onClick={() => openPage('mailto:support@klaymint.io')} className="btn btn-sm">
                            {Lang.footer_supports}
                        </div>
                        {'|'}
                        <ModalButton id="termOfUse" className="btn btn-sm text-white">
                            {Lang.footer_term_of_use}
                        </ModalButton>
                        {'|'}
                        <a className="btn text-white" href="http://docs.klaymint.io" target="_blank">
                            <i className="fas fa-file-alt" />
                        </a>
                        {/* <button className="btn text-white">
                            <i className="fas fa-copyright" />
                        </button> */}
                    </div>
                </div>
            </footer>

            {/* **************************************** term of use Modal **************************************** */}
            <Modal id="termOfUse" closeHold={false} dClassName={'modal-dialog-scrollable modal-xl'}>
                <div className="d-flex justify-content-end mt-3 mx-3">
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <TermOfUse />
                </div>
            </Modal>
        </>
    );
};

export default Footer;
