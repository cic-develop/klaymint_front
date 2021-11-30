import React, { useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import { Route, Switch, Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';

import Splide from '@splidejs/splide';

import bg00 from '@/_statics/images/main_banner/slide0.jpg';
import bg_m00 from '@/_statics/images/main_banner/slide0_mobile.jpg';
import bg01 from '@/_statics/images/main_banner/slide1.jpg';
import bg_m01 from '@/_statics/images/main_banner/slide1_mobile.jpg';
import bg02 from '@/_statics/images/main_banner/slide2.jpg';
import bg_m02 from '@/_statics/images/main_banner/slide2_mobile.jpg';
import bg03 from '@/_statics/images/main_banner/slide3.jpg';
import bg_m03 from '@/_statics/images/main_banner/slide3_mobile.jpg';
import bg04 from '@/_statics/images/main_banner/slide4.jpg';
import bg_m04 from '@/_statics/images/main_banner/slide4_mobile.jpg';

const ImageSlider: React.FC<any> = (props): JSX.Element => {
    const { breakpoint } = useSelector((store: RootState) => store.GlobalStatus);

    useEffect(() => {
        const splideElement = document.querySelector('.splide');

        // 이미지 슬라이더 초기화
        const splide = new Splide('.splide', {
            type: 'loop',
            autoplay: true,
            interval: 3000,
            arrows: false,
            drag: true,
            width: '100%',
            heightRatio: splideElement.clientWidth > 576 ? 0.35 : 0.8,
            lazyLoad: 'nearby',
            pagination: 'slider',
        });

        let delay = 0;
        splide.on('resize', () => {
            if (++delay % 10 !== 0) return;
            splide.options.heightRatio = splideElement.clientWidth > 576 ? 0.35 : 0.8;
            splide.refresh();
        });

        // splide.on('pagination:mounted', function (data) {
        //     // You can add your class to the UL element
        //     data.list.classList.add('splide__pagination--custom');

        //     // `items` contains all dot items
        //     data.items.forEach(function (item) {
        //         item.button.textContent = String(item.page + 1);
        //     });
        // });

        splide.mount();
    }, []);

    return (
        <Fade>
            <div className="splide">
                <div className="splide__track">
                    <ul className="splide__list">
                        <li className="splide__slide">
                            {breakpoint === 'xs' ? (
                                <img width="100%" height="100%" src={bg_m04} />
                            ) : (
                                <img width="100%" height="100%" src={bg04} />
                            )}
                        </li>

                        <li className="splide__slide">
                            {breakpoint === 'xs' ? (
                                <img width="100%" height="100%" src={bg_m03} />
                            ) : (
                                <img width="100%" height="100%" src={bg03} />
                            )}
                        </li>

                        <li className="splide__slide">
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSckNvWTn_cOFtMpOQfE_BSrM9C1otZCUDIuOww_DEpSsveBsA/viewform"
                                target="_blank"
                            >
                                {breakpoint === 'xs' ? (
                                    <img width="100%" height="100%" src={bg_m00} />
                                ) : (
                                    <img width="100%" height="100%" src={bg00} />
                                )}
                            </a>
                        </li>

                        <li className="splide__slide">
                            {breakpoint === 'xs' ? (
                                <img width="100%" height="100%" src={bg_m01} />
                            ) : (
                                <img width="100%" height="100%" src={bg01} />
                            )}
                        </li>
                        {/*<li className="splide__slide">*/}
                        {/*    {breakpoint === 'xs' ? (*/}
                        {/*        <img width="100%" height="100%" src={bg_m02} />*/}
                        {/*    ) : (*/}
                        {/*        <img width="100%" height="100%" src={bg02} />*/}
                        {/*    )}*/}
                        {/*</li>*/}
                    </ul>
                </div>
            </div>
            {/* <ul className="splide__pagination splide__pagination--custom">
                <li>
                    <button
                        className="splide__pagination__page"
                        type="button"
                        aria-controls="custom-pagination-slide01"
                        aria-label="슬라이드 1로 이동"
                    >
                        <div className="btn">ssss</div>
                    </button>
                </li>
            </ul> */}
        </Fade>
    );
};

export default ImageSlider;
