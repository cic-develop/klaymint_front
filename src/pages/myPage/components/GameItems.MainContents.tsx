import React, { useState } from 'react';
import css from './GameItems.module.scss';
import cx from 'classnames';
import { getBackgroundColor } from '@/helpers/_common';

interface Props {
    propsCard: {
        mainCard: any;
        subCard: any;
    };
    setPropsCard: React.Dispatch<React.SetStateAction<{ mainCard: any; subCard: any }>>;
}

const GameItemsMainContents = ({ propsCard, setPropsCard }: Props) => {
    const setMainCardHandler = () => {
        if (propsCard.mainCard !== '') {
            setPropsCard({
                mainCard: '',
                subCard: '',
            });
        }
    };

    const setSubCardHandler = () => {
        if (propsCard.subCard !== '') {
            setPropsCard({ ...propsCard, subCard: '' });
        }
    };

    return (
        <div className={css.mainContentComponent}>
            <div className={css.mainCardContainer} onClick={setMainCardHandler}>
                {propsCard.mainCard !== '' ? (
                    <div className={cx(css.modalCardContainer)}>
                        <img className={css.modalCardImage} src={propsCard.mainCard?.data?.image} alt="" />
                        <div className={css.modalCardAttr}>
                            <h2>{propsCard.mainCard?.data?.name}</h2>
                            <div className={cx('row', css.attrRow)}>
                                {propsCard.mainCard?.data?.attributes
                                    .filter((item) => item.trait_type !== 'id')
                                    .map((item) => Object.values(item))
                                    .map((attr, index) => {
                                        const value = JSON.parse(attr[1]);
                                        return (
                                            <div className={cx('col-md-6', css.attrCol)} key={index}>
                                                <span
                                                    className={css.attrKey}
                                                    style={value[1] ? getBackgroundColor(value[1]) : undefined}
                                                >
                                                    {attr[0]}
                                                </span>
                                                <span
                                                    className={css.attrValue}
                                                    style={value[1] ? getBackgroundColor(value[1]) : undefined}
                                                >
                                                    {attr[0] === 'CLASS' ? value[1] : value[0]}
                                                </span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
            <div className={css.subCardContainer} onClick={setSubCardHandler}>
                {propsCard.subCard !== '' ? (
                    <div className={cx(css.modalCardContainer)}>
                        <img className={css.modalCardImage} src={propsCard.subCard?.data?.image} alt="" />
                        <div className={css.modalCardAttr}>
                            <h2>{propsCard.subCard?.data?.name}</h2>
                            <div className={cx('row', css.attrRow)}>
                                {propsCard.subCard?.data?.attributes
                                    .filter((item) => item.trait_type !== 'id')
                                    .map((item) => Object.values(item))
                                    .map((attr, index) => {
                                        const value = JSON.parse(attr[1]);
                                        return (
                                            <div className={cx('col-md-6', css.attrCol)} key={index}>
                                                <span
                                                    className={css.attrValue}
                                                    style={value[1] ? getBackgroundColor(value[1]) : undefined}
                                                >
                                                    {attr[0] === 'CLASS' ? value[1] : value[0]}
                                                </span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default GameItemsMainContents;
