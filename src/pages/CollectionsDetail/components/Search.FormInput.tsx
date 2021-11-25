import React from 'react';
import cx from 'classnames';
import css from './Search.module.scss';

const SearchFormInput = (props) => {
    const { className, type, register, params, feed, icon = 'fas fa-search' } = props;

    return (
        <div className={cx('text-start', css.input_group_bg, className)}>
            {feed?.label && (
                <label className="form-label text-sm-start mx-2">
                    <small>{feed.label}</small>
                </label>
            )}
            <div className="input-group input-group-sm">
                {icon && (
                    <span className="input-group-text text-white">
                        <i className={icon} />
                    </span>
                )}
                <input type={type} {...register} {...params} id={params.name} className="form-control text-white" />
            </div>
            {feed?.message && (
                <div className="mx-2">
                    <small>{feed.message}</small>
                </div>
            )}
        </div>
    );
};

export default SearchFormInput;
