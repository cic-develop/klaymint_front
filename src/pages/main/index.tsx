import React, { useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';

import KlayMint from '@/helpers/linkBlockchainNetwork';
import { useLanguages } from '@/hooks/useLanguages.hook';

import { getRoundAmount, getCount } from '@/helpers/klaymint.api';
import './main.css';

import bg00 from '@/_statics/images/minigame.jpg';

import Next12 from '@/_statics/images/main_next_series/Next1_2.png';
import Next13 from '@/_statics/images/main_next_series/Next1_3.png';
import Next14 from '@/_statics/images/main_next_series/Next1_4.png';

import klayicon from '@/_statics/images/icon_kaikas.png';

import { Wizard, remoteWizardOpener } from '@/_components/commons/wizard';
import { remoteModalOpener } from '@/_components/commons/modals';

import { Slide, Flip } from 'react-reveal';
import ImageSlider from '../_layouts/components/ImageSlider';
import Section from './components/Section';
import Box from './components/Box';
import MintArea from './components/MintArea';

const index = () => {
    //초기 고정 데이터

    const [mintingDatas, setMintingData] = useState({ mint: [], soldout: [] });
    const [mintCounts, setMintCounts] = useState({});
    const [choiceMint, setChoiceMint] = useState(null);

    const [mintLock, setMintLock] = useState(false);

    const dispatch = useDispatch();
    const Lang = useLanguages();
    const wallet = useSelector((store: RootState) => store.Wallet);
    const { list } = useSelector((store: RootState) => store.Collections);

    /**
     * Minnting 민팅 시도 시 발생 이밴트
     */
    const onMintModalOpenHandler = useCallback(() => {
        if (wallet.type === 'none') {
            remoteModalOpener('conn_modal');
        } else {
            remoteWizardOpener('wizzard');
        }
    }, [wallet]);

    //처음 데이터 로딩
    useEffect(() => {
        //first Data Load
        let timer = null;

        getRoundAmount().then((res) => {
            if (res?.data) {
                const _arrMint = [];
                const _arrSoldout = [];
                _.forEach(res.data, (el, i) => {
                    el.mtl_soldout_section ? _arrSoldout.push(el) : _arrMint.push(el);
                });

                setMintingData({ mint: _arrMint, soldout: _arrSoldout });

                const mtl_idxs = _.map(_arrMint, (el) => el.mtl_idx);
                timer = setInterval(() => {
                    getCount(mtl_idxs).then((res2) => {
                        if (res2?.data) {
                            setMintCounts(res2.data);
                        }
                    });
                }, 5000);
            }
        });

        return () => {
            if (timer === null) return;
            clearInterval(timer);
        };
    }, []);

    return (
        <>
            <ImageSlider />
            <main className="container">
                {/* ************************** Minting... ************************** */}
                <Slide bottom>
                    <Section>
                        <Box className="p-3" title={Lang.main_box_title_mint}>
                            <div className="sur flex-center">
                                <div className="dove coll-lg-5 text-center mb-5">
                                    <h5 className="text-danger">series</h5>
                                    <h2 className="tit">MINTING</h2>
                                    {/*<h2 className="tit">Minting</h2>*/}
                                </div>
                            </div>
                            {/* <div className="card-header border-0 text-center pb-2 btnm">
                            <button type="button" className="btnmint">
                                More
                            </button>
                        </div> */}
                            <MintArea
                                id="mint"
                                data={mintingDatas.mint}
                                count={mintCounts}
                                onMintCallback={(chilrenData) => {
                                    onMintModalOpenHandler();
                                    setChoiceMint(chilrenData);
                                }}
                            />
                        </Box>
                    </Section>
                </Slide>

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
                                                    <img src={Next12} alt="Next01" />
                                                    {/* </div> */}
                                                </div>
                                            </div>
                                        </Slide>
                                        <Slide bottom delay={100}>
                                            <div className="coll-md-4 mlb-3 mlb-mld-0">
                                                <div className="carde hf-100 card-span pd-3">
                                                    <img src={Next13} alt="Next02" />
                                                </div>
                                            </div>
                                        </Slide>
                                        <Slide bottom delay={200}>
                                            <div className="coll-md-4 mlb-3 mlb-mld-0">
                                                <div className="carde hf-100 card-span pd-3">
                                                    <img src={Next14} alt="Next03" />
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

                {/* ************************** SOLD OUT... ************************** */}
                <Slide bottom>
                    <Section>
                        <Box className="p-3" title={Lang.main_box_title_mint}>
                            <div className="sur flex-center">
                                <div className="dove coll-lg-5 text-center mb-5">
                                    <h5 className="text-danger">series</h5>
                                    <h2 className="tit">SOLD OUT</h2>
                                    {/*<h2 className="tit">Minting</h2>*/}
                                </div>
                            </div>
                            {/* <div className="card-header border-0 text-center pb-2 btnm">
                            <button type="button" className="btnmint">
                                More
                            </button>
                        </div> */}
                            <MintArea id="soldout" data={mintingDatas.soldout} />
                        </Box>
                    </Section>
                </Slide>

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
                                <img width={16} src={klayicon} /> {choiceMint?.mtl_price} Klay
                            </span>
                        </div>
                        <div className="d-flex justify-content-between p-0 my-3">
                            <small className="fw-lighter">{Lang.modal_check_mint_text_hold}</small>
                            <small className="fw-lighter">{wallet.info.balance} Klay</small>
                        </div>
                    </div>
                    <div className="position-bottom bg-dark p-0 text-center">
                        {/* {Number(wallet.info.balance) - choiceMint?.mtl_price <= 0 ? (
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
                                    console.log(choiceMint);
                                    //9007199254740991
                                    //100000000000000

                                    const klaymint = new KlayMint(
                                        choiceMint.contract_address,
                                        choiceMint.factory_address,
                                        list,
                                    );

                                    await setMintLock(true);
                                    await klaymint.mintRequest(
                                        wallet,
                                        Lang,
                                        dispatch,
                                        () => {
                                            remoteWizardOpener('wizzard');
                                            setMintLock(false);
                                        },
                                        choiceMint.mtl_idx,
                                        choiceMint.mtl_price,
                                    );
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
