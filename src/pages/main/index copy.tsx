import React, { useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';

import KlayMint from '@/helpers/linkBlockchainNetwork';
import { useLanguages } from '@/hooks/useLanguages.hook';

import { Wizard, WizardButton, remoteWizardOpener } from '@/_components/commons/wizard';
import { remoteModalOpener } from '@/_components/commons/modals';
import { Slide, Flip } from 'react-reveal';

import Section from './components/Section';
import Box from './components/Box';
import './main.css';

import bg00 from '@/_statics/images/minigame.jpg';

import Next01 from '@/_statics/images/main_next_series/Next1.png';
import Next02 from '@/_statics/images/main_next_series/Next2.png';
import Next03 from '@/_statics/images/main_next_series/Next3.png';

import mint01 from '@/_statics/images/minting-01.jpg';
import mint02 from '@/_statics/images/minting-02.jpg';
import mint03 from '@/_statics/images/minting-03.jpg';

import klayicon from '@/_statics/images/icon_kaikas.png';
import ImageSlider from '../_layouts/components/ImageSlider';
import { getRoundAmount, getCount } from '@/helpers/klaymint.api';

const index = () => {
    //초기 고정 데이터
    const firstData = {
        name: 'PoPo',
        disabled: true,
        soldout: false,
        isOpen: false,
        currentCount: 0,
        currentTimeStamp: 0,
        goalCount: 3000,
        goalTimeStamp: Date.parse('2021-11-03T13:00:00'),
        interval: Math.floor((Date.parse('2021-11-03T13:00:00') - Date.now()) / 1000),
        value: 100,
        imgSrc: mint03,
    };

    const imageSet = [mint01, mint02, mint03];

    const dispatch = useDispatch();
    const Lang = useLanguages();
    const wallet = useSelector((store: RootState) => store.Wallet);

    const [mintData, updateMintData] = useState<any>(firstData);

    const [mint, setMint] = useState(null);
    const [_time, setTime] = useState(0);

    const [_countDown, setCountDown] = useState<any>('');

    const [count, setCount] = useState(0);

    const { list } = useSelector((store: RootState) => store.Collections);
    const [mintLock, setMintLock] = useState(false);

    const klaymint = new KlayMint('', '', list);

    /**
     * Minnting 민팅 시도 시 발생 이밴트
     */
    // let cnt = 0;
    const onMintHandler = useCallback(
        (mint, qNumber) => {
            if (wallet.type === 'none') {
                remoteModalOpener('conn_modal');
            } else {
                //klaymint.mintRequest(wallet, Lang, dispatch);
                remoteWizardOpener('wizzard');
                setMint(mint);
            }
        },
        [wallet],
    );

    //받은 데이터를 가지고 실시간 처리
    const onUpdate = (data) => {
        const _mintData = { ...data };
        _mintData['button'] = false;

        const sec = String(_mintData.interval % 60).padStart(2, '0');
        const min = String(Math.floor((_mintData.interval / 60) % 60)).padStart(2, '0');
        const hour = String(Math.floor((_mintData.interval / (60 * 60)) % 24)).padStart(2, '0');
        const day = String(Math.floor(_mintData.interval / (60 * 60 * 24))).padStart(2, '0');

        _mintData['timeFormat'] = day + ':' + hour + ':' + min + ':' + sec;

        // if (Math.abs(_mintData.interval) % 4 === 0) {
        //     getCount().then(async (res) => {
        //         if (res.data) {
        //             if (res.data - 5000 <= 3000) {
        //                 setCount(res.data - 5000);
        //             } else {
        //                 setCount(3000);
        //             }
        //         }
        //     });
        // }

        //SoldOut
        if (count >= _mintData.goalCount) {
            _mintData.soldout = true;
            _mintData.isOpen = false;
            _mintData.disabled = true;
            _mintData['button'] = false;
            _mintData['timeFormat'] = '';
        } else {
            if (_mintData.interval < 0) {
                //Open
                _mintData.soldout = false;
                _mintData.isOpen = true;
                _mintData.disabled = false;
                _mintData['button'] = true;
                _mintData['timeFormat'] = '';
            } else {
                //Close
                _mintData.soldout = false;
                _mintData.isOpen = true;
                _mintData.disabled = true;
                _mintData['button'] = false;
            }
        }
        _mintData.interval--; //카운트다운 감소
        return _mintData;
    };

    //Tick 진행
    useEffect(() => {
        setTimeout(() => setTime(_time + 1), 1000);

        updateMintData(onUpdate(mintData));
    }, [_time]);

    //처음 데이터 로딩
    useEffect(() => {
        setTimeout(() => {
            setTime(_time + 1);
        }, 1000);

        //first Data Load
        getRoundAmount().then(async (res) => {
            if (res?.data) {
                updateMintData(res.data);
            }
        });
    }, []);

    return (
        <>
            <ImageSlider />
            <main className="container">
                {/************************* next nft series 시작 *************************/}
                <section className="py-7">
                    <div className="container-flu">
                        <div className="sur flex-center">
                            <div className="bg-holder" id="holder__dan"></div>
                            <div className="dove coll-lg-5 text-center">
                                <h5 className="text-danger">{Lang.main_box_title_coming_soon}</h5>
                                <h2 className="tit">{Lang.main_box_title_next}</h2>
                            </div>
                        </div>
                        <div className="pantoe slip pt-6" id="pantoeExampleDark" data-bs-ride="pantoe">
                            <div className="pantoe-inner">
                                <div className="pantoe-item act" data-bs-interval="10000">
                                    <div className="sur hf-100">
                                        <Slide bottom>
                                            <div className="coll-md-4 mlb-3 mlb-mld-0">
                                                <div className="carde hf-100 card-span pd-3">
                                                    {/* <div className="carde-body"> */}
                                                    <img src={Next01} alt="Next01" />
                                                    {/* </div> */}
                                                </div>
                                            </div>
                                        </Slide>
                                        <Slide bottom delay={100}>
                                            <div className="coll-md-4 mlb-3 mlb-mld-0">
                                                <div className="carde hf-100 card-span pd-3">
                                                    <img src={Next02} alt="Next02" />
                                                </div>
                                            </div>
                                        </Slide>
                                        <Slide bottom delay={200}>
                                            <div className="coll-md-4 mlb-3 mlb-mld-0">
                                                <div className="carde hf-100 card-span pd-3">
                                                    <img src={Next03} alt="Next03" />
                                                </div>
                                            </div>
                                        </Slide>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* our next nft series 끝 */}

                <Section>
                    <Box className="p-3" title={Lang.main_box_title_mint}>
                        <div className="sur flex-center">
                            <div className="bg-holder" id="holder__su"></div>
                            <div className="dove coll-lg-5 text-center mb-5">
                                <h5 className="text-danger">series</h5>
                                <h2 className="tit">SOLD OUT</h2>
                                {/*<h2 className="tit">Minting</h2>*/}
                            </div>
                        </div>
                        <div className="card-header border-0 text-center pb-2 btnm">
                            {/* <button type="button" className="btnmint">
                                    try Mintting
                                </button> */}
                        </div>

                        {/* ************************** Minting... ************************** */}
                        <div className="row row-cols-1 row-cols-lg-3 g-3">
                            {/* **************** minting Items **************** */}
                            <Slide bottom delay={0}>
                                <div className="col">
                                    {/* Sold out ----------------------------------------------------------------- */}
                                    <div className="card shadow-sm">
                                        <div className="closed_overlay position-absolute w-100 h-100 text-white">
                                            <div className="position-absolute top-50 start-50 translate-middle  align-items-center">
                                                <div
                                                    className="text-center rounded-3 px-2"
                                                    style={{ border: '10px solid red' }}
                                                >
                                                    <b
                                                        style={{
                                                            fontSize: '3em',
                                                            color: '#ff3333',
                                                        }}
                                                    >
                                                        SOLD
                                                        <br />
                                                        OUT
                                                    </b>
                                                </div>
                                            </div>
                                        </div>

                                        <Link to={'/collections/PoPo'}>
                                            <img className="closed_img" src={mint01} width={'100%'} />
                                        </Link>
                                        <div className={'carde-body carde-black'}>
                                            <div className="row align-items-center justify-content-between">
                                                <div className="col-7">
                                                    <div className="btn-group btn-ud">
                                                        <Link
                                                            to="/collections/PoPo"
                                                            className="btn btn-coll btn-sm btn-outline-secondary text-center"
                                                            style={{ zIndex: 999 }}
                                                        >
                                                            Collection
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="col-5 text-end">
                                                    <small className="text-muted">2000 / 2000</small>
                                                    <br />
                                                    <b className="text-muted">
                                                        <img width={16} src={klayicon} alt="icon" /> 77
                                                    </b>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Slide>
                            <Slide bottom delay={100}>
                                <div className="col">
                                    {/* Sold out ----------------------------------------------------------------- */}
                                    <div className="card shadow-sm">
                                        <div className="closed_overlay position-absolute w-100 h-100 text-white">
                                            <div className="position-absolute top-50 start-50 translate-middle  align-items-center">
                                                <div
                                                    className="text-center rounded-3 px-2"
                                                    style={{ border: '10px solid red' }}
                                                >
                                                    <b
                                                        style={{
                                                            fontSize: '3em',
                                                            color: '#ff3333',
                                                        }}
                                                    >
                                                        SOLD
                                                        <br />
                                                        OUT
                                                    </b>
                                                </div>
                                            </div>
                                        </div>

                                        <Link to={'/collections/PoPo'}>
                                            <img className="closed_img" src={mint02} width={'100%'} />
                                        </Link>
                                        <div className={'carde-body carde-black'}>
                                            <div className="row align-items-center justify-content-between">
                                                <div className="col-7">
                                                    <div className="btn-group btn-ud">
                                                        <Link
                                                            to="/collections/PoPo"
                                                            className="btn btn-coll btn-sm btn-outline-secondary text-center"
                                                            style={{ zIndex: 999 }}
                                                        >
                                                            Collection
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="col-5 text-end">
                                                    <small className="text-muted">3000 / 3000</small>
                                                    <br />
                                                    <b className="text-muted">
                                                        <img width={16} src={klayicon} alt="icon" /> 88
                                                    </b>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Slide>
                            <Slide bottom delay={200}>
                                <div className="col">
                                    {/* Sold out ----------------------------------------------------------------- */}
                                    <div className="card shadow-sm">
                                        <div className="closed_overlay position-absolute w-100 h-100 text-white">
                                            <div className="position-absolute top-50 start-50 translate-middle  align-items-center">
                                                <div
                                                    className="text-center rounded-3 px-2"
                                                    style={{ border: '10px solid red' }}
                                                >
                                                    <b
                                                        style={{
                                                            fontSize: '3em',
                                                            color: '#ff3333',
                                                        }}
                                                    >
                                                        SOLD
                                                        <br />
                                                        OUT
                                                    </b>
                                                </div>
                                            </div>
                                        </div>

                                        <Link to={'/collections/PoPo'}>
                                            <img className="closed_img" src={mint03} width={'100%'} />
                                        </Link>
                                        <div className={'carde-body carde-black'}>
                                            <div className="row align-items-center justify-content-between">
                                                <div className="col-7">
                                                    <div className="btn-group btn-ud">
                                                        <Link
                                                            to="/collections/PoPo"
                                                            className="btn btn-coll btn-sm btn-outline-secondary text-center"
                                                            style={{ zIndex: 999 }}
                                                        >
                                                            Collection
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="col-5 text-end">
                                                    <small className="text-muted">3000 / 3000</small>
                                                    <br />
                                                    <b className="text-muted">
                                                        <img width={16} src={klayicon} alt="icon" /> 100
                                                    </b>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Slide>
                            {/* <Slide bottom delay={200}>
                                {mintData.disabled ? ( // 비활성화-------------------------
                                    <div className="col">
                                        <div className="card shadow-sm">
                                            {mintData.timeFormat && (
                                                <div className="closed_overlay position-absolute w-100 h-100 text-white">
                                                    <div className="position-absolute top-50 start-50 translate-middle  align-items-center">
                                                        <div
                                                            className="text-center p-2 rounded-3"
                                                            style={{
                                                                fontSize: '3em',
                                                                border: '2px solid white',
                                                            }}
                                                        >
                                                            {mintData.timeFormat}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {mintData.soldout && (
                                                <div className="closed_overlay position-absolute w-100 h-100 text-white">
                                                    <div className="position-absolute top-50 start-50 translate-middle  align-items-center">
                                                        <div
                                                            className="text-center rounded-3 px-2"
                                                            style={{ border: '10px solid red' }}
                                                        >
                                                            <b
                                                                style={{
                                                                    fontSize: '3em',
                                                                    color: '#ff3333',
                                                                }}
                                                            >
                                                                SOLD
                                                                <br />
                                                                OUT
                                                            </b>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <Link to={'/collections/PoPo'}>
                                                <img
                                                    className={mintData.disabled ? 'closed_img' : ''}
                                                    src={mint03}
                                                    width={'100%'}
                                                />
                                            </Link>
                                            <div className={'carde-body carde-black'}>
                                                <div className="row a+lign-items-center justify-content-between">
                                                    <div className="col-7">
                                                        <div className="btn-group btn-ud">
                                                            <Link
                                                                to="/collections/PoPo"
                                                                className="btn btn-coll btn-sm btn-outline-secondary text-center"
                                                            >
                                                                Collection
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="col-5 text-end">
                                                        <small className="text-muted">
                                                            {count} / {3000}
                                                        </small>
                                                        <br />
                                                        <b className="text-muted">
                                                            <img width={16} src={klayicon} alt="icon" /> {100}
                                                        </b>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // -----------------------------------활성화-------------------------
                                    <div className="col">
                                        <div className="card shadow-sm">
                                            <Link to={'/collections/PoPo'}>
                                                <img
                                                    className={mintData.disabled ? 'closed_img' : ''}
                                                    src={mint03}
                                                    width={'100%'}
                                                />
                                            </Link>
                                            <div className={'carde-body carde-black'}>
                                                <div className="row a+lign-items-center justify-content-between">
                                                    <div className="col-7">
                                                        <div className="btn-group btn-ud">
                                                            <Link
                                                                to="/collections/PoPo"
                                                                className="btn btn-coll btn-sm btn-outline-secondary text-center"
                                                            >
                                                                Collection
                                                            </Link>
                                                            {console.log(mintData === firstData)}
                                                            <button
                                                                className="btn btn-mint btn-sm btn-outline-secondary text-center"
                                                                onClick={() => onMintHandler(100, mintData.qNumber)}
                                                            >
                                                                <i className="fas fa-shopping-cart" /> Mint Now
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="col-5 text-end">
                                                        <small className="text-muted">
                                                            {count} / {3000}
                                                        </small>

                                                        <br />
                                                        <b className="text-muted">
                                                            <img width={16} src={klayicon} alt="icon" /> {100}
                                                        </b>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Slide> */}
                        </div>
                    </Box>
                </Section>

                {/* ************* 게임 아이템 ************* */}
                <Slide bottom>
                    <Section>
                        <Box className="p-3" title={Lang.main_box_title_game_items}>
                            <div className="card mt-5">
                                {/* <div className="card-body">Coming Soon....</div> */}
                                <img width="100%" height="100%" src={bg00} style={{ position: 'relative' }} />
                                <p>
                                    KLAY MINT
                                    <br />
                                    MINIGAME
                                </p>
                            </div>
                        </Box>
                    </Section>
                </Slide>
            </main>

            {/* ********************************************************************************
             *  TRY Minting Modal
             *********************************************************************************/}
            <Wizard
                className="border-0"
                closeHold={true}
                id="wizzard"
                title={Lang.modal_check_mint_title}
                lock={mintLock}
            >
                <div>
                    <div className="row mx-4 mb-2 text-dark">
                        <hr />
                        <div className="d-flex justify-content-between p-0">
                            <p className="text-dark">Mint</p>
                            <span className="text-dark">
                                <img width={16} src={klayicon} /> {mint} Klay
                            </span>
                        </div>
                        <div className="d-flex justify-content-between p-0 my-3">
                            <small className="fw-lighter">{Lang.modal_check_mint_text_hold}</small>
                            <small className="fw-lighter">{wallet.info.balance} Klay</small>
                        </div>
                    </div>
                    <div className="position-bottom bg-dark p-0 text-center">
                        {/* {Number(wallet.info.balance) - mint <= 0 ? (
                            <button
                                className="btn m-0 p-3"
                                style={{ color: 'red' }}
                                onClick={() => remoteWizardOpener('wizzard')}
                            >
                                <i className="fas fa-info-circle" /> {Lang.modal_check_mint_lack_to_klay}
                            </button>
                        ) : ( */}
                        <button
                            disabled={mintLock}
                            className="btn m-0 p-3"
                            onClick={async () => {
                                try {
                                    setMintLock(true);
                                    await klaymint.mintRequest(wallet, Lang, dispatch, () => {
                                        remoteWizardOpener('wizzard');
                                        setMintLock(false);
                                    });
                                } catch (err) {
                                    setMintLock(false);
                                    console.error(err);
                                }
                            }}
                        >
                            {mintLock ? (
                                <div className="spinner-border text-light" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                Lang.modal_check_mint_mint_now
                            )}
                        </button>
                        {/* )} */}
                    </div>
                </div>
            </Wizard>
        </>
    );
};

export default index;
