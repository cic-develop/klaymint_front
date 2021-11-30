import Reacet, { useState, useEffect } from 'react';
import _ from 'lodash';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';

import Splide from '@splidejs/splide';

import MintWidget from './MintWidget';

const MintArea: React.FC<any> = (props): JSX.Element => {
    const [splide, setSplide] = useState(null);
    const { breakpoint } = useSelector((store: RootState) => store.GlobalStatus);
    const {
        id,
        data = [],
        count = {},
        onMintCallback = (data) => {
            console.log('onWidgetCallabck', data);
        },
    } = props;

    useEffect(() => {
        const splideElement = document.querySelector('.splide' + id);

        // 이미지 슬라이더 초기화
        const _splide = new Splide('.splide' + id, {
            type: 'slide',
            //autoWidth: true,
            start: 0,
            perPage: 3,
            perMove: 0,
            autoplay: false,
            // focus: 'center',
            // trimSpace: 'move',
            //interval: 3000,
            drag: true,
            lazyLoad: 'nearby',
            pagination: true,
            breakpoints: {
                4196: {
                    perPage: 3,
                },
                1000: {
                    perPage: 2,
                },
                800: {
                    perPage: 1,
                },
            },
        });

        let delay = 0;
        _splide.on('resize', () => {
            if (++delay % 5 !== 0) return;
            //_splide.options.perPage = splideElement.clientWidth > 576 ? 3 : 1;
            _splide.refresh();
        });

        _splide.mount();
        setSplide(_splide);
    }, []);

    useEffect(() => {
        if (!splide) return;

        const maxPerPage = _.size(data);

        splide._options.perPage = maxPerPage > 0 && maxPerPage <= 3 ? maxPerPage : 3;
        splide._options.breakpoints = {
            4196: {
                perPage: maxPerPage > 0 && maxPerPage <= 3 ? maxPerPage : 1,
            },
            1000: {
                perPage: maxPerPage - 1 > 0 && maxPerPage - 1 <= 3 ? maxPerPage - 1 : 1,
            },
            800: {
                perPage: maxPerPage - 2 > 0 && maxPerPage - 2 <= 3 ? maxPerPage - 2 : 1,
            },
        };
        splide.refresh();
    }, [data]);

    return (
        <div className={'splide' + id}>
            <div className="splide__track">
                <ul className="splide__list">
                    {_.map(data, (el, i) => {
                        if (splide) splide.refresh();
                        if (_.size(count)) el.mtl_mint_count = count[el.mtl_idx].mtl_mint_count;

                        return (
                            <li key={i} className="splide__slide">
                                <div className="m-2">
                                    <MintWidget {...el} onClick={(data) => onMintCallback(data)} />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default MintArea;
