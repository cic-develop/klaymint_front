import React from 'react';
import cx from 'classnames';
import _ from 'lodash';
import css from './Search.module.scss';

const FormSelect = (props) => {
    const { className, type, register, params, feed } = props;

    return (
        <div className={cx('text-start', css.input_group_bg, className)}>
            {feed?.label && (
                <label className="form-label text-sm-start mx-2">
                    <small>{feed.label}</small>
                </label>
            )}
            <div className="input-group input-group-sm">
                <select
                    {...register}
                    {...params}
                    id={params.name}
                    className={cx('form-control text-white', css.formSelect)}
                >
                    {_.map(params?.options, (el, key) => (
                        <option className="bg-gray" key={key} value={el.value}>
                            {el.description}
                        </option>
                    ))}
                </select>
                <span className="input-group-text text-white">
                    <i className="fas fa-chevron-down" />
                </span>
            </div>
            {feed?.message && (
                <div className="mx-2">
                    <small>{feed.message}</small>
                </div>
            )}
        </div>
    );
};

export default FormSelect;
