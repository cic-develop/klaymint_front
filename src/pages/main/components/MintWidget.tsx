import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import _ from 'lodash';

import klayicon from '@/_statics/images/icon_kaikas.png';
import imgSoldOut from '@/_statics/images/soldout.png';
import imgEndOfSale from '@/_statics/images/endofsale.png';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';
import { useLanguages } from '@/hooks/useLanguages.hook';

/**
 * Sold Out Commponent
 * 내부에서만 사용
 */
const CloseIcon: React.FC<any> = (props): JSX.Element => {
    const {
        icon,
        contract_name,
        brand_name,
        ctl_idx,
        mtl_auto,
        mtl_createdAt,
        mtl_endAt,
        mtl_idx,
        mtl_imgsrc,
        mtl_is_private,
        mtl_mint_count,
        mtl_max_count,
        mtl_price,
        mtl_startAt,
        mtl_updatedAt,
    } = props;

    const linkTo = `/collections/${contract_name}/${brand_name}`;

    return (
        <div className="card shadow-sm">
            <Link className="closed_overlay position-absolute w-100 h-100" to={linkTo}>
                <img
                    className="position-absolute top-50 start-50 translate-middle"
                    src={icon}
                    alt="Center Icon"
                    width="80%"
                />
            </Link>
            <Link to={linkTo}>
                <img className="closed_img" src={window.envBackImageHost + mtl_imgsrc} width={'100%'} />
            </Link>
            <div className={'carde-body carde-black'}>
                <div className="row align-items-center justify-content-between">
                    <div className="col-7">
                        <div className="btn-group">
                            <Link
                                to={linkTo}
                                className="btn btn-coll btn-sm btn-outline-secondary text-center"
                                style={{ zIndex: 11 }}
                            >
                                Collection
                            </Link>
                        </div>
                    </div>
                    <div className="col-5 row text-muted text-end">
                        <small className="col-12">
                            {mtl_mint_count} / {mtl_max_count}
                        </small>
                        <b className="col-12">
                            <div className="d-flex align-items-center justify-content-end">
                                <img className="mx-1 mb-1" width={16} src={klayicon} alt="icon" /> {mtl_price}
                            </div>
                        </b>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Close: React.FC<any> = (props): JSX.Element => {
    const [strTime, setStrTime] = useState('00:00:00:00');
    const {
        //countdown,
        contract_name,
        brand_name,
        ctl_idx,
        mtl_auto,
        mtl_createdAt,
        mtl_endAt,
        mtl_idx,
        mtl_imgsrc,
        mtl_is_private,
        mtl_mint_count,
        mtl_max_count,
        mtl_price,
        mtl_startAt,
        mtl_updatedAt,
        tick,
    } = props;

    useEffect(() => {
        if (props.tick === null && props.tick === undefined) return;
        if (props.tick < 0) return;
        //console.log(props.mtl_idx, props.tick);

        const sec = String(props.tick % 60).padStart(2, '0');
        const min = String(Math.floor((props.tick / 60) % 60)).padStart(2, '0');
        const hour = String(Math.floor((props.tick / (60 * 60)) % 24)).padStart(2, '0');
        const day = String(Math.floor(props.tick / (60 * 60 * 24))).padStart(2, '0');

        setStrTime(day + ':' + hour + ':' + min + ':' + sec);
    }, [props.tick, setStrTime]);

    const linkTo = `/collections/${contract_name}/${brand_name}`;

    return (
        <div className="card shadow-sm">
            <Link className="closed_overlay position-absolute w-100 h-100" to={linkTo}>
                <div className="position-absolute top-50 start-50 translate-middle">
                    {tick >= 0 && (
                        <div
                            className="text-center p-2 rounded-3 text-white"
                            style={{
                                fontSize: '3em',
                                border: '2px solid white',
                            }}
                        >
                            {strTime}
                        </div>
                    )}
                </div>
            </Link>
            <Link to={linkTo}>
                <img className="closed_img" src={window.envBackImageHost + mtl_imgsrc} width={'100%'} />
            </Link>
            <div className={'carde-body carde-black'}>
                <div className="row align-items-center justify-content-between">
                    <div className="col-xl-7 col-lg-12">
                        <div className="btn-group">
                            <Link
                                to={linkTo}
                                className="btn btn-coll btn-sm btn-outline-secondary text-center"
                                style={{ zIndex: 11 }}
                            >
                                Collection
                            </Link>
                        </div>
                    </div>
                    <div className="col-5 row text-muted text-end">
                        <small className="col-12">
                            {mtl_mint_count} / {mtl_max_count}
                        </small>

                        <b className="col-12">
                            <div className="d-flex align-items-center justify-content-end">
                                <img className="mx-1 mb-1" width={16} src={klayicon} alt="icon" /> {mtl_price}
                            </div>
                        </b>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Open: React.FC<any> = (props): JSX.Element => {
    const {
        onClick,
        contract_name,
        brand_name,
        ctl_idx,
        mtl_auto,
        mtl_createdAt,
        mtl_endAt,
        mtl_idx,
        mtl_imgsrc,
        mtl_is_private,
        mtl_mint_count,
        mtl_max_count,
        mtl_price,
        mtl_startAt,
        mtl_updatedAt,
        contract_address,
        factory_address,
    } = props;

    const linkTo = `/collections/${contract_name}/${brand_name}`;

    return (
        <div className="card shadow-sm">
            <Link to={linkTo}>
                <img src={window.envBackImageHost + mtl_imgsrc} width={'100%'} />
            </Link>
            <div className={'card-body'}>
                <div className="row align-items-center justify-content-between">
                    <div className="col-xl-7 col-lg-7 col-sm-12">
                        <div className="btn-group">
                            <Link to={linkTo} className="btn btn-coll btn-sm btn-outline-secondary text-center">
                                Collection
                            </Link>
                            <button className="btn btn-mint btn-sm btn-outline-secondary text-center" onClick={onClick}>
                                <i className="fas fa-shopping-cart" /> Mint Now
                            </button>
                        </div>
                    </div>
                    <div className="col-xl-5 col-lg-5 col-sm-12 row text-muted text-end">
                        <small className="d-flex align-items-center justify-content-end">
                            {mtl_mint_count} / {mtl_max_count}
                        </small>
                        <b className="d-flex align-items-center justify-content-end">
                            <img className="mx-1 mb-1" width={16} src={klayicon} alt="icon" /> {mtl_price}
                        </b>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MintWidget: React.FC<any> = (props): JSX.Element => {
    //console.log(props);

    const [time, setTime] = useState(props.countdown);
    const [soldout, setSoldout] = useState(props.mtl_mint_count >= props.mtl_max_count);
    const [sellout, setSellout] = useState(false);

    const wallet = useSelector((store: RootState) => store.Wallet);
    const { list } = useSelector((store: RootState) => store.Collections);

    const Lang = useLanguages();
    const dispatch = useDispatch();

    const { mtl_auto, mtl_mint_count, mtl_max_count, onClick = () => {} } = props;

    useEffect(() => {
        setTimeout(() => setTime(time - 1), 1000);
        setSoldout(mtl_mint_count >= mtl_max_count);

        //console.log(props.mtl_idx, props.endcountdown);

        if (props.endcountdown !== null) {
            if (!soldout && time < 0) {
                if (props.endcountdown - Math.abs(time) < 0) {
                    setSellout(true);
                }
            }
        }
    }, [time, soldout]);

    //Component renders
    if (soldout) return <CloseIcon {...props} icon={imgSoldOut} />;
    if (sellout) return <CloseIcon {...props} icon={imgEndOfSale} />;

    if (mtl_auto && time < 0) {
        return <Open {...props} onClick={() => onClick(props)} />;
    } else {
        return <Close {...props} tick={time} />;
    }
};

export default MintWidget;
