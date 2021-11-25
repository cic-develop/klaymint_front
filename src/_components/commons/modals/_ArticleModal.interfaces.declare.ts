import React, { Dispatch, SetStateAction } from 'react';
import { CollectionsDetailContractInfoProps } from '@/redux/reducers/GlobalStatus.reducer';

/**
 * props : _ArticleModal 을 그릴 때 전달 받는 jsx 또는 content data
 * setModal : close modal 을 위한 setState
 * style 모달 안에 모달이 열리는 경우 props 값으로 전달할 zIndex 등의 style
 **/
export interface ArticleModalProps {
    collection?: any;
    props: {
        title?: string;
        titleButtons?: string[] | JSX.Element[] | Buffer[] | any[];
        mainImage?: string;
        mainCanvas?: boolean;
        mainDescButtons?: string[] | JSX.Element[] | Buffer[] | any[];
        mainDesc?: string;
        mainAttrs?: string[];
        mainAttrDesc?: any;
        jsxContent?: JSX.Element | any;
        footerPrice?: string | number;
        footerPriceHistory?: string | null;
        footerInput?: boolean;
        footerButtons?: string[];
        onClick?: any;
    };
    setModal?: React.Dispatch<React.SetStateAction<boolean>>;
    style?: any;
}

export interface NotExistClassArticleModalProps {
    collection?: any;
    props: {
        title?: string;
        titleButtons?: string[] | JSX.Element[] | Buffer[] | any[];
        mainImage?: string;
        mainDescButtons?: string[] | JSX.Element[] | Buffer[] | any[];
        mainDesc?: string;
        mainAttrs?:
            | {
                  max_value?: any;
                  trait_type: any;
                  value: any;
              }[]
            | any;
        footerPrice?: string | number;
        footerPriceHistory?: string | null;
        footerInput?: boolean;
        footerButtons?: string[];
        onClick?: any;
    };
    setModal?: React.Dispatch<React.SetStateAction<boolean>>;
    style?: any;
}
