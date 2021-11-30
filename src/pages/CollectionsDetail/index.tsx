import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import _ from 'lodash';
import { getContracts, postContractInfo, getClassByFloorPrice } from '@/helpers/klaymint.api';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/connectors.redux';

import { useLanguages } from '@/hooks/useLanguages.hook';

import cx from 'classnames';
import css from '@/pages/CollectionsDetail/detailGlobal.module.scss';
import ProfileImage from '@/pages/CollectionsDetail/components/ProfileImage';
import ButtonsInfo from '@/pages/CollectionsDetail/components/Buttons';
import Search from '@/pages/CollectionsDetail/components/Search';
import Article from '@/pages/CollectionsDetail/components/Article';
import Loader from '@/_components/commons/loaders/loader';

const CollectionsDetail = (props) => {
    const history = useHistory();
    const [collection, setCollection] = useState(null);
    const Lang = useLanguages();

    //주소창으로부터 컨트랙트이름과 브랜드이름 추출
    const _contractName = history.location.pathname.split('/')[2];
    const _brandName = history.location.pathname.split('/')[3];
    const contractName = props.match.params.contractName ? props.match.params.contractName : _contractName;
    const brandName = props.match.params.brandName ? props.match.params.brandName : _brandName;

    const { list, classs, sns } = useSelector((store: RootState) => store.Collections);

    const [search, setSearch] = useState({
        max_price: '99999999.99',
        min_price: '0.01',
        select_class: 'all',
        select_group: 'sales_price',
        select_order: 'ASC',
        token_id: '',
        contract_id: 0,
    });

    useEffect(() => {
        if (list.length <= 0) return;

        const _collection = _.find(list, (el, i) => el.brand_name === brandName && el.contract_name === contractName);
        _collection['class'] = classs[_collection.id];
        _collection['sns'] = sns[_collection.id];

        setSearch({ ...search, contract_id: _collection.id });

        //바닥가 가져오기
        getClassByFloorPrice(_collection.id)
            .then((res) => {
                if (!res?.data) {
                    window.toast('error', Lang.err_msg_fail_request);
                    return;
                }
                //바닥가를 Object 형태로 변환
                const classByFloorPrice = _.keyBy(res.data, (el) => String(el.class).toLowerCase());

                _.forEach(classByFloorPrice, (el, key) => {
                    _collection.class[key]['floor_price'] = el.floor_price;
                });

                setCollection(_collection);
            })
            .catch((error) => {
                window.toast('error', Lang.err_msg_fail_request);
                setCollection(_collection);
            });
    }, [list]);

    // useEffect(() => {
    //     console.log(contractName, brandName);
    // }, []);

    // useEffect(() => {
    //     postContractInfo({ contractName, brandName })
    //         .then((res) => {
    //             setContractInfo(res.data);
    //         })
    //         .catch((error) => console.log(error));
    // }, [contractName, brandName]);

    return (
        <main>
            {!collection ? (
                <div className="pt-5">
                    <Loader className="text-light" />
                </div>
            ) : (
                <>
                    <div className={cx('row col-12 pt-5', css.imageSectionDiv)}>
                        <ProfileImage
                            src={window.envBackImageHost + collection.brand_img_src}
                            name={collection.contract_view_name}
                            collection={collection}
                        />
                    </div>
                    <div className={cx('row', css.buttonSectionDiv)}>
                        <div className="col-md-6 col-sm-12">
                            <ButtonsInfo contractInfo={collection} />
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <Search onSearch={setSearch} search={search} classs={classs[collection.id]} />
                        </div>
                    </div>
                    <hr />

                    <Article search={search} collection={collection} />
                </>
            )}
        </main>
    );
};

export default CollectionsDetail;
