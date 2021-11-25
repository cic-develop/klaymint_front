import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import css from './GameItems.module.scss';
import _ from 'lodash';
import NoItems from '@/_components/commons/NoItems';
import iconKaikas from '@/_statics/images/icon_kaikas.png';
import useList from '@/hooks/useList.hook';
import { useLanguages } from '@/hooks/useLanguages.hook';
import { getSalesList } from '@/helpers/klaymint.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';

interface Props {
    propsCard: {
        mainCard: any;
        subCard: any;
    };
    setPropsCard: React.Dispatch<React.SetStateAction<{ mainCard: any; subCard: any }>>;
}

const GameItemsInventory = ({ propsCard, setPropsCard }: Props) => {
    const wallet = useSelector((store: RootState) => store.Wallet);
    const Lang = useLanguages();

    const [tokenList, setTokenList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inventoryRow, setInventoryRow] = useState([7, 4]);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        totalPage: 1,
    });
    // 나중에 setPageInfo 로 페이지네이션 잡을때 draw card in inventory useEffect 에서 currentPage 에 맞게 state.view_list slice 해서 인벤토리 출력

    const {
        state,
        onRefresh,
        onAppend,

        pages,
        movePage,

        scrollEventListener,
    } = useList({});

    /**
     * dom 조작을 위해 id 값 부여 -> 해당 article 에 nft 카드 올리기
     */

    const drawInventoryLine = useCallback(() => {
        const element = [];
        let idx = 1;

        for (let i = 0; i < inventoryRow[0]; i++) {
            for (let l = 0; l < inventoryRow[1]; l++) {
                element.push(
                    <div
                        id={`article${idx++}`}
                        className={cx(`col-md-${12 / inventoryRow[1]}`, css.cardArticle)}
                    ></div>,
                );
            }
        }

        return element;
    }, [inventoryRow]);

    useEffect(() => {
        /**
         * draw card in inventory useEffect
         */

        _.forEach(state.view_list, (item) => {
            let value;
            const attr = item.data.attributes;
            if (attr && +item.data.name.split('#')[1] >= 15000) {
                if (attr[attr.length - 1].trait_type === 'CLASS') value = JSON.parse(attr[attr.length - 1].value)[1];
            }

            const insertCardHandler = () => {
                if (propsCard.mainCard === '') setPropsCard({ ...propsCard, mainCard: item });
                else setPropsCard({ ...propsCard, subCard: item });
            };

            if (inventoryRow[0] * inventoryRow[1] > +item.id) {
                document.getElementById(`article${item.id + 1}`).innerHTML = `
                    <div className='nftCard' style='background-color: #1a1e21; height : 100%'>
                        <div>
                            <img src=${item.data.image} alt="nft" />
                        </div>
                        <div>
                            <span>${item.data.name.split(' ')[1]}</span>
                            <span>${value ? value : null}</span>
                        </div>
                    </div>
                    `;

                document.getElementById(`article${item.id + 1}`).addEventListener('click', insertCardHandler);
            }
        });
    }, [inventoryRow, state.view_list, propsCard.mainCard]);

    useEffect(() => {
        getSalesList().then((res) => setTokenList(res.data.items));
    }, []);

    useEffect(
        () =>
            scrollEventListener(
                document,
                () => {
                    console.log('on [gameItem] Refresh');
                },
                () => {
                    if (loading) return;
                    console.log('on [gameItem] load append');
                    //onRefresh(wallet.info.myToken.gameItem);
                    /** test code */
                    //__TEST__fakeAsyncFunciton();
                    //asyncFinxtion();
                },
            ),
        [],
    );

    useEffect(() => {
        onRefresh(wallet.info.myToken.unlisted);
    }, [wallet?.info?.myToken?.unlisted]);

    return (
        <div className={css.inventoryComponent}>
            <div className={css.userInfoContainer}>
                <div className={css.addressInfo}>{wallet?.info?.address}</div>
                <div className={css.klayBalanceInfo}>{wallet?.info?.balance} KLAY</div>
                <div className={css.perBalanceInfo}>{wallet?.info?.balance} PER</div>
            </div>
            <div className={cx('row', css.cardListContainer)}>{drawInventoryLine()}</div>
            <div className={css.sortContainer}>
                <div className={css.paginationDiv}>
                    <button>{'<'}</button>
                    <span>
                        {pageInfo.currentPage} / {pageInfo.totalPage}
                    </span>
                    <button>{'>'}</button>
                </div>
                <div className={css.sortAndSearchDiv}>
                    <select>
                        <option>클래스높은순</option>
                        <option>클래스낮은순</option>
                        <option>강화포인트낮은순</option>
                        <option>강화포인트높은순</option>
                    </select>
                    <i className="fas fa-search" />
                </div>
            </div>
        </div>
    );
};

export default GameItemsInventory;
