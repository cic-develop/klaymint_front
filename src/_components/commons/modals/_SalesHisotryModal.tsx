import TimeAgo from 'javascript-time-ago';
import React from 'react';
import css from './_SalesHistoryModal.module.scss';
import iconKaikas from '@/_statics/images/icon_kaikas.png';
import en from 'javascript-time-ago/locale/en.json';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';

interface Props {
    history: any[];
}
TimeAgo.addDefaultLocale(en);

const _SalesHisotryModal = ({ history }: Props) => {
    const { breakpoint } = useSelector((store: RootState) => store.GlobalStatus);
    const mobileSizeEx = ['xs', 'md', 'sm'];

    return (
        <div className={css.salesHistoryContainer}>
            <div className={css.table}>
                <div className={css.thead}>
                    <div className={css.theadTr}>
                        <span>ITEM</span>
                        <span>PRICE</span>
                        <span>FROM</span>
                        <span>TO</span>
                    </div>
                </div>
                <div className={css.tbody}>
                    {history.map((item) => {
                        const timeAgo = new TimeAgo('en-US');
                        const time = new Date(item.createdAt).getTime();
                        const res = Date.now() - time;
                        const timestamp = timeAgo.format(Date.now() - res);
                        return (
                            <div className={css.tbodyTr} key={item.id}>
                                <div className={css.tableItemTd}>
                                    <img src={item.image_url} alt="" />
                                    <h4>#{item.token_id}</h4>
                                </div>
                                <div className={css.tablePriceTd}>
                                    <h4>
                                        <img src={iconKaikas} alt="" />
                                        {item.trade_price}
                                    </h4>
                                </div>
                                <div className={css.tableFromTd}>
                                    {item.from_address.slice(0, 3)}...{item.from_address.slice(-3)}
                                </div>
                                <div className={css.tableToTd}>
                                    {item.to_address.slice(0, 3)}...{item.to_address.slice(-3)}
                                    <span className={css.trTimeStamp}>
                                        <h4>{timestamp}</h4>
                                    </span>
                                    <button
                                        className={css.trViewToken}
                                        onClick={() => window.open(`https://scope.klaytn.com/tx/${item.tsig}`)}
                                    >
                                        <svg
                                            className="MuiSvgIcon-root-363"
                                            focusable="false"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 2c0-3.31-2.69-6-6-6s-6 2.69-6 6c0 2.22 1.21 4.15 3 5.19l1-1.74c-1.19-.7-2-1.97-2-3.45 0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.48-.81 2.75-2 3.45l1 1.74c1.79-1.04 3-2.97 3-5.19zM12 3C6.48 3 2 7.48 2 13c0 3.7 2.01 6.92 4.99 8.65l1-1.73C5.61 18.53 4 15.96 4 13c0-4.42 3.58-8 8-8s8 3.58 8 8c0 2.96-1.61 5.53-4 6.92l1 1.73c2.99-1.73 5-4.95 5-8.65 0-5.52-4.48-10-10-10z"></path>
                                        </svg>
                                        VIEW TOKEN TRANSACTIONS
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default _SalesHisotryModal;
