import React, { useState } from 'react';
import css from './GameItems.module.scss';
import GameItemsNavi from '@/pages/myPage/components/GameItems.Navi';
import GameItemsMainContents from '@/pages/myPage/components/GameItems.MainContents';
import GameItemsInventory from '@/pages/myPage/components/GameItems.Inventory';

const GameItems = () => {
    const [propsCard, setPropsCard] = useState({
        mainCard: '',
        subCard: '',
    });

    return (
        <section className={css.GameItemsSection}>
            <div className={css.NavigationContainer}>
                <GameItemsNavi />
            </div>
            <div className={css.MainContentsContainer}>
                <GameItemsMainContents propsCard={propsCard} setPropsCard={setPropsCard} />
            </div>
            <div className={css.InventoryContainer}>
                <GameItemsInventory propsCard={propsCard} setPropsCard={setPropsCard} />
            </div>
        </section>
    );
};
export default GameItems;
