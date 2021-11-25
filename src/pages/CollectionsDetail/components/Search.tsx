import React, { useRef, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import Input from './Search.FormInput';
import Select from './Search.FormSelect';

import { required, numOnly, minLength, maxLength, numOnlyTwoDecimal } from '@/helpers/validate.helper';
import _ from 'lodash';

const Search = ({ onSearch = (wheres: any) => console.log('onSearch'), search, classs }) => {
    const submitBtnRef = useRef(null);

    const {
        register,
        handleSubmit,
        setFocus,
        setValue,

        formState: { isDirty, isSubmitting, errors },
    } = useForm({ mode: 'all', criteriaMode: 'firstError', shouldFocusError: true });

    let constClassValues = [
        { value: 'all', description: 'ALL' },
        // { value: 'Normal', description: 'Normal' },
        // { value: 'Uncommon', description: 'Uncommon' },
        // { value: 'Rare', description: 'Rare' },
        // { value: 'Unique', description: 'Unique' },
        // { value: 'Legendary', description: 'Legendary' },
        // { value: 'Myth', description: 'Myth' },
    ];

    const _class = _.cloneDeep(classs);
    delete _class['none'];
    constClassValues = [
        ...constClassValues,
        ..._.map(_class, (el, key) => {
            if (key !== 'none') {
                return { value: key, description: key.replace(/\b[a-z]/, (letter) => letter.toUpperCase()) };
            }
        }),
    ];

    const constGroupValues = [
        { value: 'id', description: 'Recently Listed' },
        { value: 'token_id', description: 'Token ID' },
        { value: 'sales_price', description: 'Sales Price' },
        { value: 'last_price', description: 'Last Price' },
        // { value: 'class', description: 'Class' },
    ];

    const constOrderValues = [
        { value: 'DESC', description: 'DESC' },
        { value: 'ASC', description: 'ASC' },
    ];

    const constGroupOrderValues = [
        { value: 'sales_price:ASC', description: 'Sales Price : Low to High' },
        { value: 'sales_price:DESC', description: 'Sales Price : High to Low' },
        { value: 'id:ASC', description: 'Recently Listed : Low to High' },
        { value: 'id:DESC', description: 'Recently Listed : High to Low' },
        { value: 'token_id:ASC', description: 'Token ID : Low to High' },
        { value: 'token_id:DESC', description: 'Token ID : High to Low' },
        { value: 'last_price:ASC', description: 'Last Price : Low to High' },
        { value: 'last_price:DESC', description: 'Last Price : High to Low' },
        // { value: 'class', description: 'Class' },
    ];

    const constConfigForm = {
        token_id: {
            type: 'text',
            register: register('token_id', {
                validate: {
                    pattern: numOnly,
                },
            }),
            params: {
                name: 'token_id',
                placeholder: 'Search for NFT Token ids',
                defaultValue: search.token_id,
            },
            feed: {
                label: 'Token id by',
                message: errors['token_id']?.message,
            },
        },
        min_price: {
            type: 'number',
            icon: null,
            register: register('min_price', {
                validate: {
                    required: required,
                    pattern: numOnlyTwoDecimal,
                },
            }),
            params: {
                name: 'min_price',
                placeholder: search.min_price,
                defaultValue: search.min_price,
                min: 0.01,
                max: 99999999.99,
                step: 0.01,
            },
            feed: {
                label: 'Minimum Price by',
                message: errors['min_price']?.message,
            },
        },
        max_price: {
            type: 'number',
            icon: null,
            register: register('max_price', {
                validate: {
                    required: required,
                    pattern: numOnlyTwoDecimal,
                },
            }),
            params: {
                name: 'max_price',
                placeholder: search.max_price,
                defaultValue: search.max_price,
                min: 0.01,
                max: 99999999.99,
                step: 0.01,
            },
            feed: {
                label: 'Maximum Price by',
                message: errors['max_price']?.message,
            },
        },
        select_class: {
            register: register('select_class', {
                onChange: (e) => {
                    setValue('select_class', e.target.value);
                    submitBtnRef.current.click();
                },
            }),
            params: {
                name: 'select_class',
                options: constClassValues,
                defaultValue: search.select_class,
            },
            feed: {
                label: 'Class by',
            },
        },
        select_group_order: {
            register: register('select_group_order', {
                onChange: (e) => {
                    setValue('select_group_order', e.target.value);
                    submitBtnRef.current.click();
                },
            }),
            params: {
                name: 'select_group_order',
                options: constGroupOrderValues,
                defaultValue: search.select_group + ':' + search.select_order,
            },
            feed: {
                label: 'Search Order by',
            },
        },
    };

    const onSubmit = (formData: Record<string, any>) => {
        const strValues = String(formData.select_group_order).split(':');
        delete formData.select_group_order;
        formData['select_group'] = strValues[0];
        formData['select_order'] = strValues[1];

        onSearch({ ...search, ...formData });
    };

    //엔터 입력 시 서치 동작
    const enterKeyEventHandler = (e) => {
        if (e.keyCode !== 13) return;
        handleSubmit(onSubmit);
    };

    //컴포넌트 시작 시 입력 폼 포커스

    return (
        <section>
            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={enterKeyEventHandler}>
                <div className="d-flex justify-content-start">
                    {/* ******** class Select box ******** */}
                    <Select className="col-4" {...constConfigForm.select_class} />

                    {/* ******** sort select box ******** */}
                    <Select className="col-8" {...constConfigForm.select_group_order} />
                </div>

                <div className="d-flex justify-content-start">
                    {/* ******** minimum price ******** */}
                    <Input className="col-6" {...constConfigForm.min_price} />

                    {/* ******** maximum price ******** */}
                    <Input className="col-6" {...constConfigForm.max_price} />
                </div>

                <div className="d-flex justify-content-start">
                    {/* ******** Token Id ******** */}
                    <Input className="col-10" {...constConfigForm.token_id} />
                    <div className="col-2 m-1">
                        <button
                            ref={submitBtnRef}
                            type="submit"
                            className="m-0 p-3 text-center"
                            onClick={handleSubmit(onSubmit)}
                        >
                            <i className="fas fa-search" />
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default Search;
