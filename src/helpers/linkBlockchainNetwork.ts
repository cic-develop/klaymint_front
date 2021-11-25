import Caver from 'caver-js';
import {
    myBAppName,
    buyNFTABI,
    mintNFTABI,
    sellCancelNFTABI,
    sellNFTABI,
    setApprovalForAllABI,
    fee,
    qNumber,
    oldPoPoFactoryAddress,
    mintNFTABI_TEST,
    ccc_factoryABI,
    last_mintNFT_ABI,
} from '@/helpers/_common.linkChain';
import { prepare, request } from 'klip-sdk';
import {
    makeMobileApprovedPolling,
    makeMobilePolling,
    setPromiseAll,
    toKlayFromPeb,
    toPebFromKlay,
} from '@/helpers/_common';
import { setKlipQR } from '@/redux/reducers/GlobalStatus.reducer';
import { getMyTokens_in_kaikas } from '@/helpers/klaytn.api';
import axios from 'axios';
import { getIsApproved, getIsOwner, getMySalesList, getPebFromKlay } from '@/helpers/klaymint.api';
import { setAddress } from '@/redux/reducers/Wallet.reducer';

const IorA = navigator.userAgent.toLowerCase();

/**
 * contractAddress 와 factoryAddress 를 받아서 블록체인과 통신 가능한 인스턴스 객체를 생성할 수 있는 인스턴스
 */
export default class KlayMint {
    private contractAddress: string;
    private factoryAddress: string;
    private exceptionFactoryAddress: string[];
    private list: any[];

    // getToken 메서드를 사용하기 위해서 접근하는 인스턴스 객체는 contractAddress 와 factory
    constructor(contractAddress, factoryAddress, list) {
        this.contractAddress = contractAddress;
        this.factoryAddress = factoryAddress;
        this.exceptionFactoryAddress = [oldPoPoFactoryAddress.toLowerCase()];
        this.list = list;
    }

    checkException = (currentOwner) => {
        if (this.exceptionFactoryAddress.indexOf(currentOwner) !== -1) {
            console.log('true !@@@@');
            this.factoryAddress = currentOwner;
        }
    };

    endFunction = (closeCallback, massage) => {
        window?.toast('error', massage);
        closeCallback();
    };

    mintRequest = async (
        wallet,
        Lang,
        dispatch,
        closeCallback = (): void => {
            console.log('close');
        },
        mtl_idx?,
        mtl_price?,
    ) => {
        if (!wallet.isConn) return this.endFunction(closeCallback, Lang.err_msg_fail_connect_wallet);

        //console.error('code : ' + qNumber);

        if (wallet.type === 'klip') {
            try {
                const peb = await getPebFromKlay(mtl_price);

                console.log('klip - qmint : ', qNumber);
                console.log('klip - peb   : ', peb);

                /**
                 * prepare.executeContract() 실제 tx 를 실행시키는 methods
                 */
                const res = await prepare.executeContract({
                    bappName: myBAppName,
                    from: wallet.info.address,
                    to: this.factoryAddress,
                    // value: peb.data,
                    value: '100000000000000',
                    abi: JSON.stringify(last_mintNFT_ABI),
                    params: JSON.stringify([mtl_idx, +qNumber]),
                    successLink: '#',
                    failLink: '#',
                });

                if (res.err) {
                    console.log(res.err);
                    return this.endFunction(closeCallback, Lang.err_msg_sucs_mint_klip);
                } else if (res.request_key) {
                    /**
                     * tx가 오류없이 전송할 수 있다면 res.request_key 생성,
                     * mobile 이라면 deepLink 로 클립 바로가기,
                     * pc 라면 QR 생성 (globalState 에 type 및 res 전달 -> _ArticleModal 컴포넌트에서 QR state 가 존재한다면 해당 모달 생성)
                     */
                    if (IorA.indexOf('android') !== -1 || IorA.indexOf('iphone') !== -1) {
                        try {
                            await request(res.request_key, () => alert('모바일 환경에서 실행해주세요'));
                            /**
                             * MobilePolling -> deepLink 연결되는 동안 tx가 성공적인 응답을 반환하기 전까지 반복적인 응답결과 조회함수
                             */
                            makeMobilePolling(
                                wallet,
                                res,
                                { err: Lang.err_msg_sucs_mint_klip, suc: Lang.suc_msg_sucs_mint_klip },
                                dispatch,
                                closeCallback,
                                { contract_address: this.contractAddress, factory_address: this.factoryAddress },
                                this.list,
                            );
                        } catch (error) {
                            console.log(error);
                            return this.endFunction(closeCallback, Lang.err_msg_sucs_mint_klip);
                        }
                    } else {
                        res.type = 'mint';
                        dispatch(
                            setKlipQR({
                                ...res,
                                device: 'pc',
                            }),
                        );
                    }
                }
                console.log('receipt');
            } catch (error) {
                console.log(error);
                closeCallback();
            }
        } else {
            const { klaytn }: any = window;
            if (klaytn) {
                await klaytn.enable();
                const caver = new Caver(klaytn);
                // const data = caver.klay.abi.encodeFunctionCall(mintNFTABI, [+qNumber]);
                const data = caver.klay.abi.encodeFunctionCall(last_mintNFT_ABI, [mtl_idx, +qNumber]);
                const peb = toPebFromKlay(caver, mtl_price);

                /**
                 * sendTransaction() 실제 tx 를 실행시키는 methods
                 */
                caver.klay
                    .sendTransaction({
                        type: 'SMART_CONTRACT_EXECUTION',
                        from: wallet.info.address,
                        value: peb,
                        // value: '100000000000000',
                        to: this.factoryAddress,
                        data,
                        gas: 3000000,
                    })
                    .on('transactionHash', (transactionHash) => {
                        console.log('txHash', transactionHash);
                    })
                    .on('receipt', async (receipt) => {
                        /**
                         * tx가 성공적인 응답을 반환한다면
                         * getToken을 통해 wallet balance update
                         */
                        window?.toast('success', Lang.suc_msg_sucs_mint_kaikas);

                        this.getToken(wallet, this.list).then(async (res) => {
                            const balance = await caver.klay.getBalance(wallet.info.address);
                            const klayBalance = toKlayFromPeb(caver, balance);

                            dispatch(
                                setAddress({
                                    address: wallet.info.address,
                                    balance: klayBalance,
                                    myToken: {
                                        ...wallet.info.myToken,
                                        unlisted: res.unlisted,
                                        onSale: res.onSale,
                                    },
                                }),
                            );
                        });
                        closeCallback();
                        console.log('receipt', receipt);
                    })
                    .on('error', (error) => {
                        window?.toast('error', Lang.err_msg_sucs_mint_kaikas);
                        console.log('error', error);
                        closeCallback();
                    });
            }
        }
    };
    sellRequest = async (
        wallet,
        tokenId,
        price,
        Lang,
        dispatch,
        closeModal,
        closeCallback = (): void => {
            console.log('close');
        },
    ) => {
        /**
         * 판매신청을 할 수 없는 경우 return error message 와 함수종료
         */
        if (!price) return this.endFunction(closeCallback, Lang.err_msg_fail_price_empty);

        if (!Number.isInteger(price)) {
            const cnt = (price + '').split('.')[1].length;
            if (cnt > 2) return this.endFunction(closeCallback, Lang.err_msg_fail_price_not_integers);
        }
        if (price > 99999999.99) return this.endFunction(closeCallback, Lang.err_msg_fail_price_too_big);
        if (!wallet.isConn) return this.endFunction(closeCallback, Lang.err_msg_fail_connect_wallet);

        if (wallet.type === 'klip') {
            const isOwner = await this.isOwner(tokenId, 'klip');
            if (isOwner.toLowerCase() !== wallet.info.address.toLowerCase())
                return this.endFunction(closeCallback, Lang.err_msg_fail_not_token_owner);

            /**
             * approved 상태 조회 후 false 라면 setApprove 진행
             * Kaikas 경우 await 으로 걸어두면 setApproved 끝난 후 sellReq 진행되지만
             * 클립의 경우 polling 시스템 문제로 setApproved 함수 안에서 setApproved 가 성공적인 응답이라면 sellReq 를 다시 진행시키며 polling
             * 그래서 if(!approved) .. else {}로 이어짐
             */
            const approved = await this.isApproved(wallet.info.address, 'klip');
            console.log('test!!!!@@@@', approved);

            if (!approved) await this.setApproved(wallet, 'klip', Lang, closeModal, dispatch);
            else {
                /**
                 * approved 상태 조회 후 true 라면 sellReq 위와 같은 방식으로 polling, deepLink 및 QR 생성 진행
                 */
                const toPeb = await getPebFromKlay(price);

                const res = await prepare.executeContract({
                    bappName: myBAppName,
                    from: wallet.info.address,
                    to: this.factoryAddress,
                    value: '0',
                    abi: JSON.stringify(sellNFTABI),
                    params: JSON.stringify([tokenId, toPeb.data]),
                    successLink: '#',
                    failLink: '#',
                });

                if (res.err) {
                    console.log(res.err);
                    return this.endFunction(closeCallback, Lang.err_msg_sucs_sell_klip);
                } else if (res.request_key) {
                    if (IorA.indexOf('android') !== -1 || IorA.indexOf('iphone') !== -1) {
                        try {
                            await request(res.request_key, () => alert('모바일 환경에서 실행해주세요'));
                            makeMobilePolling(
                                wallet,
                                res,
                                { err: Lang.err_msg_sucs_sell_klip, suc: Lang.suc_msg_sucs_sell_klip },
                                dispatch,
                                closeModal,
                                { contract_address: this.contractAddress, factory_address: this.factoryAddress },
                                this.list,
                            );
                        } catch (error) {
                            console.log(error);
                            return this.endFunction(closeCallback, Lang.err_msg_sucs_sell_klip);
                        }
                    } else {
                        res.type = 'sell';
                        res.closeModal = closeModal;

                        dispatch(
                            setKlipQR({
                                ...res,
                                device: 'pc',
                            }),
                        );
                    }
                }
            }
        } else {
            const isOwner = await this.isOwner(tokenId, 'kaikas');
            if (isOwner.toLowerCase() !== wallet.info.address.toLowerCase())
                return this.endFunction(closeCallback, Lang.err_msg_fail_not_token_owner);

            const { klaytn }: any = window;
            if (klaytn) {
                /**
                 * approved 상태 조회 후 false 라면 setApprove 진행
                 */
                const approved = await this.isApproved(wallet.info.address, 'kaikas');
                if (!approved) await this.setApproved(wallet, Lang, closeModal, 'kaikas');

                await klaytn.enable();
                const caver = new Caver(klaytn);

                const toPeb = toPebFromKlay(caver, price);
                const data = caver.klay.abi.encodeFunctionCall(sellNFTABI, [tokenId, toPeb]);

                caver.klay
                    .sendTransaction({
                        type: 'SMART_CONTRACT_EXECUTION',
                        from: wallet.info.address,
                        to: this.factoryAddress,
                        data,
                        gas: 3000000,
                    })
                    .on('transactionHash', (transactionHash) => {
                        console.log('txHash', transactionHash);
                    })
                    .on('receipt', async (receipt) => {
                        try {
                            await this.updateToken(
                                Lang.suc_msg_sucs_sell_kaikas,
                                wallet,
                                caver,
                                dispatch,
                                closeCallback,
                                closeModal,
                            );
                        } catch (error) {
                            console.log(error);
                            console.log('update Token Error');
                        } finally {
                            console.log(receipt);
                        }
                    })
                    .on('error', (error) => {
                        console.log('error', error);
                        return this.endFunction(closeCallback, Lang.err_msg_sucs_sell_kaikas);
                    });
            }
        }
    };
    sellCancelRequest = async (
        wallet,
        tokenId,
        Lang,
        dispatch,
        closeModal,
        closeCallback = (): void => {
            console.log('close');
        },
    ) => {
        if (!wallet.isConn) return this.endFunction(closeCallback, Lang.err_msg_fail_connect_wallet);

        if (wallet.type === 'klip') {
            const isOwner = await this.isOwner(tokenId, 'klip');
            if (isOwner.toLowerCase() !== this.factoryAddress.toLowerCase())
                return this.endFunction(closeCallback, Lang.err_msg_fail_not_token_owner_factory);

            this.checkException(isOwner.toLowerCase());

            /**
             * polling, deepLink 및 QR 생성 진행
             */

            const res = await prepare.executeContract({
                bappName: myBAppName,
                from: wallet.info.address,
                to: this.factoryAddress,
                value: '0',
                abi: JSON.stringify(sellCancelNFTABI),
                params: JSON.stringify([tokenId]),
                successLink: '#',
                failLink: '#',
            });

            if (res.err) {
                console.log(res.err);
                return this.endFunction(closeCallback, Lang.err_msg_sucs_sellCancel_klip);
            } else if (res.request_key) {
                if (IorA.indexOf('android') !== -1 || IorA.indexOf('iphone') !== -1) {
                    try {
                        await request(res.request_key, () => alert('모바일 환경에서 실행해주세요'));
                        makeMobilePolling(
                            wallet,
                            res,
                            { err: Lang.err_msg_sucs_sellCancel_klip, suc: Lang.suc_msg_sucs_sellCancel_klip },
                            dispatch,
                            closeModal,
                            { contract_address: this.contractAddress, factory_address: this.factoryAddress },
                            this.list,
                        );
                    } catch (error) {
                        console.log(error);
                        return this.endFunction(closeCallback, Lang.err_msg_sucs_sellCancel_klip);
                    }
                } else {
                    res.type = 'sellCancel';
                    res.closeModal = closeModal;
                    dispatch(
                        setKlipQR({
                            ...res,
                            device: 'pc',
                        }),
                    ),
                        console.log('receipt');
                }
            }
        } else {
            const isOwner = await this.isOwner(tokenId, 'kaikas');

            if (isOwner.toLowerCase() !== this.factoryAddress.toLowerCase())
                return this.endFunction(closeCallback, Lang.err_msg_fail_not_token_owner_factory);

            this.checkException(isOwner.toLowerCase());

            const { klaytn }: any = window;
            if (klaytn) {
                await klaytn.enable();
                const caver = new Caver(klaytn);

                const data = caver.klay.abi.encodeFunctionCall(sellCancelNFTABI, [tokenId]);

                caver.klay
                    .sendTransaction({
                        type: 'SMART_CONTRACT_EXECUTION',
                        from: wallet.info.address,
                        to: this.factoryAddress,
                        data,
                        gas: 3000000,
                    })
                    .on('transactionHash', (transactionHash) => {
                        console.log('txHash', transactionHash);
                    })
                    .on('receipt', async (receipt) => {
                        try {
                            await this.updateToken(
                                Lang.suc_msg_sucs_sellCancel_kaikas,
                                wallet,
                                caver,
                                dispatch,
                                closeCallback,
                                closeModal,
                            );
                        } catch (error) {
                            console.log(error);
                            console.log('update Token Error');
                        } finally {
                            console.log(receipt);
                        }
                    })
                    .on('error', (error) => {
                        closeCallback();
                        console.log('error', error);
                        window?.toast('error', Lang.err_msg_sucs_sellCancel_kaikas);
                    });
            }
        }
    };
    buyRequest = async (
        wallet,
        tokenId,
        price,
        Lang,
        dispatch,
        closeModal,
        closeCallback = (): void => {
            console.log('close');
        },
    ) => {
        if (!wallet.isConn) return this.endFunction(closeCallback, Lang.err_msg_fail_connect_wallet);

        if (wallet.type === 'klip') {
            const isOwner = await this.isOwner(tokenId, 'klip');
            console.log(isOwner);
            if (isOwner.toLowerCase() !== this.factoryAddress.toLowerCase())
                return this.endFunction(closeCallback, Lang.err_msg_fail_not_token_owner_factory);

            this.checkException(isOwner.toLowerCase());

            const toPeb = await getPebFromKlay(price);

            const res = await prepare.executeContract({
                bappName: myBAppName,
                from: wallet.info.address,
                to: this.factoryAddress,
                value: toPeb.data,
                abi: JSON.stringify(buyNFTABI),
                params: JSON.stringify([tokenId]),
                successLink: '#',
                failLink: '#',
            });

            if (res.err) {
                console.log(res.err);
                return this.endFunction(closeCallback, Lang.err_msg_sucs_buy_klip);
            } else if (res.request_key) {
                const IorA = navigator.userAgent.toLowerCase();

                if (IorA.indexOf('android') !== -1 || IorA.indexOf('iphone') !== -1) {
                    try {
                        await request(res.request_key, () => alert('모바일 환경에서 실행해주세요'));
                        makeMobilePolling(
                            wallet,
                            res,
                            { err: Lang.err_msg_sucs_buy_klip, suc: Lang.suc_msg_sucs_buy_klip },
                            dispatch,
                            closeModal,
                            { contract_address: this.contractAddress, factory_address: this.factoryAddress },
                            this.list,
                        );
                    } catch (error) {
                        console.log(error);
                        return this.endFunction(closeCallback, Lang.err_msg_sucs_buy_klip);
                    }
                } else {
                    res.type = 'buy';
                    res.closeModal = closeModal;
                    dispatch(
                        setKlipQR({
                            ...res,
                            device: 'pc',
                        }),
                    ),
                        console.log('receipt');
                }
            }
        } else {
            const isOwner = await this.isOwner(tokenId, 'kaikas');
            if (isOwner.toLowerCase() !== this.factoryAddress.toLowerCase())
                return this.endFunction(closeCallback, Lang.err_msg_fail_not_token_owner_factory);

            this.checkException(isOwner.toLowerCase());

            const { klaytn }: any = window;
            if (klaytn) {
                await klaytn.enable();
                const caver = new Caver(klaytn);

                const data = caver.klay.abi.encodeFunctionCall(buyNFTABI, [tokenId]);
                const toPeb = toPebFromKlay(caver, +price);

                caver.klay
                    .sendTransaction({
                        type: 'SMART_CONTRACT_EXECUTION',
                        from: wallet.info.address,
                        to: this.factoryAddress,
                        data,
                        gas: 3000000,
                        value: toPeb,
                    })
                    .on('transactionHash', (transactionHash) => {
                        console.log('txHash', transactionHash);
                    })
                    .on('receipt', async (receipt) => {
                        try {
                            await this.updateToken(
                                Lang.suc_msg_sucs_buy_kaikas,
                                wallet,
                                caver,
                                dispatch,
                                closeCallback,
                                closeModal,
                            );
                        } catch (error) {
                            console.log(error);
                            console.log('update Token Error');
                        } finally {
                            console.log(receipt);
                        }
                    })
                    .on('error', (error) => {
                        console.log('error', error);
                        return this.endFunction(closeCallback, Lang.err_msg_sucs_buy_kaikas);
                    });
            }
        }
    };

    //            if (!approved) await this.setApproved(wallet, 'klip', Lang, closeModal, dispatch);
    setApproved = async (wallet, type, Lang, closeModal, dispatch?, closeCallback?) => {
        if (type === 'klip') {
            console.log('여기는 들어오는중입니다..');
            const data = {
                bappName: myBAppName,
                from: wallet.info.address,
                to: this.contractAddress,
                value: '0',
                abi: JSON.stringify(setApprovalForAllABI),
                params: JSON.stringify([this.factoryAddress, true]),
                successLink: '#',
                failLink: '#',
            };

            const approvedRes = await prepare.executeContract(data);

            if (approvedRes.err) {
                console.log(approvedRes.err);
                console.log('approvedRes error');
                return this.endFunction(closeCallback, Lang.err_msg_sucs_sell_approved_klip);
            } else if (approvedRes.request_key) {
                if (IorA.indexOf('android') !== -1 || IorA.indexOf('iphone') !== -1) {
                    try {
                        await request(approvedRes.request_key, () => alert(Lang.alert_please_excuting_mobile));
                        /**
                         * approved tx를 실행시킬 수 있다면 안에서 selling tx 를 실행시켜야 하기때문에 data 를 넘겨줌,
                         * makeMobileApprovedPolling 함수 안에서 sell req, sellReq polling 로직 존재,
                         */
                        makeMobileApprovedPolling(
                            wallet,
                            approvedRes,
                            Lang,
                            dispatch,
                            data,
                            closeModal,
                            {
                                contract_address: this.contractAddress,
                                factory_address: this.factoryAddress,
                            },
                            this.list,
                        );
                    } catch (error) {
                        console.log(error);
                        return this.endFunction(closeCallback, Lang.err_msg_sucs_sell_approved_klip);
                    }
                } else {
                    const sellRes = await prepare.executeContract(data);
                    console.log('여기서 approve 진행중..', this.factoryAddress);

                    if (sellRes.err) {
                        console.log('sell error');
                        console.log(sellRes.err);
                        return this.endFunction(closeCallback, Lang.err_msg_sucs_sell_klip);
                    } else if (sellRes.request_key) {
                        /**
                         * approved tx를 실행시킬 수 있다면 approved, sell 각각 두개의 QR 코드를 생성해야하기때문에,
                         * 배열로 각각의 res 값을 globalState 로 전달,
                         * _ArticleModal 에서 klipQR 이 배열인 경우 이어짐
                         */
                        console.log();
                        approvedRes.type = 'approvedRes';
                        sellRes.type = 'sell';
                        dispatch(
                            setKlipQR([
                                { ...approvedRes, device: 'pc' },
                                { ...sellRes, device: 'pc' },
                            ]),
                        );
                    }
                }
            }
        } else {
            const { klaytn }: any = window;
            if (klaytn) {
                const caver = new Caver(klaytn);

                const data = caver.klay.abi.encodeFunctionCall(setApprovalForAllABI, [this.factoryAddress, true]);

                await caver.klay
                    .sendTransaction({
                        type: 'SMART_CONTRACT_EXECUTION',
                        from: wallet.info.address,
                        to: this.contractAddress,
                        data,
                        gas: 3000000,
                    })
                    .on('transactionHash', (transactionHash) => {
                        console.log('txHash', transactionHash);
                    })
                    .on('receipt', (receipt) => {
                        window?.toast('success', Lang.suc_msg_sucs_sell_approved_kaikas);
                        console.log('receipt', receipt);
                    })
                    .on('error', (error) => {
                        console.log('error', error);
                        return this.endFunction(closeCallback, Lang.err_msg_sucs_sell_approved_kaikas);
                    });
            }
        }
    };

    /**
     * isApproved, isOwner 는 kaikas user 인 경우,
     * Caver 객체생성이 가능하지만 , klip user 인 경우는 provider 가 http 이기 때문에,
     * 배포 후 https -> http 통신이 불가능하여 klaymint API 를 이용한 isApproved, isOwner 결과값을 받아오는 모습
     */
    isApproved = async (address, type) => {
        if (type === 'kaikas') {
            const { klaytn }: any = window;
            if (klaytn) {
                const caver = new Caver(klaytn);

                const kip17 = caver.kct.kip17.create(this.contractAddress);
                const res = await kip17.isApprovedForAll(address, this.factoryAddress);

                return res;
            }
        } else {
            const res = await getIsApproved(address, this.contractAddress, this.factoryAddress);
            console.log(res.data);

            return res.data;
        }
    };

    isOwner = async (tokenId, type) => {
        if (type === 'kaikas') {
            const { klaytn }: any = window;
            if (klaytn) {
                const caver = new Caver(klaytn);

                const kip17 = caver.kct.kip17.create(this.contractAddress);
                const res = await kip17.ownerOf(tokenId);

                return res;
            }
        } else {
            const res = await getIsOwner(tokenId, this.contractAddress);
            console.log(res.data);

            return res.data;
        }
    };

    /**
     * 해당 카이카스 지갑 또는 클립에 존재하는 토큰들을 모두 불러오기
     */
    getToken = async (wallet, list, cursor?) => {
        const address = list.map((item) => {
            return {
                contract_address: item.contract_address,
                factory_address: item.factory_address,
            };
        });

        const arr = [];

        const res = await getMyTokens_in_kaikas(wallet.info.address, address, cursor);
        arr.push(res.data.items);
        if (res.data.cursor !== '') return this.getToken(wallet, list, res.data.cursor);
        else {
            const unlistedTokens = arr.flat();

            const unlistedTokensInfo = [];
            await setPromiseAll(unlistedTokens, async (item) => {
                const { tokenUri } = item.extras;

                /**
                 * 해당 tokenURI 를 ipfs 를 사용한다면 전용게이트웨이로 사용해서 로딩 속도를 증가
                 */
                const case1 = tokenUri.replace('https://ipfs.io/ipfs/', 'https://klaymint.mypinata.cloud/ipfs/');
                const case2 = case1.replace('ipfs://', 'https://klaymint.mypinata.cloud/ipfs/');

                /**
                 * 해당 replace 된 json cid 를 get 요청으로 token 정보를 가져와서 unlistedTokensInfo 배열에 저장
                 */
                const res = await axios.get(case2);
                const imageUri = res.data.image.replace('ipfs://', 'https://klaymint.mypinata.cloud/ipfs/');
                res.data.image = imageUri;
                res.data.contractAddress = item.contractAddress;

                unlistedTokensInfo.push(res.data);
            });

            const onSaleTokens = await getMySalesList(wallet.info.address);

            return {
                unlisted: unlistedTokensInfo,
                onSale: onSaleTokens.data,
            };
        }
    };

    updateToken = async (msg, wallet, caver, dispatch, closeCallback, closeModal) => {
        /**
         * tx가 성공적인 응답을 반환했을 때 실행되는 update Token
         * getToken을 통해 token info update
         */

        this.getToken(wallet, this.list).then(async (res) => {
            const balance = await caver.klay.getBalance(wallet.info.address);
            const klayBalance = toKlayFromPeb(caver, balance);

            dispatch(
                setAddress({
                    address: wallet.info.address,
                    balance: klayBalance,
                    myToken: {
                        ...wallet.info.myToken,
                        unlisted: res.unlisted,
                        onSale: res.onSale,
                    },
                }),
            );
        });
        window?.toast('success', msg);
        closeCallback(); // 모달 안에 모달을 닫기 때문에 closeModal보다 먼저 실행 되어야 함
        closeModal(false);
    };
}
