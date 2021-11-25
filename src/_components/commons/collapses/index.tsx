import React from 'react';

declare interface CollapseParams {
    id: string;
    children?: JSX.Element | string | null;
}

const CollapseButton: React.FC<any> = (props: CollapseParams): JSX.Element => {
    const { children, id } = props;

    return (
        <div
            className="collapsed"
            data-bs-toggle="collapse"
            data-bs-target={`#${id}`}
            aria-expanded="false"
            aria-controls={id}
        >
            {children}
        </div>
    );
};

const CollapseArea: React.FC<any> = (props: CollapseParams): JSX.Element => {
    const { children, id } = props;

    return (
        <div className="collapse-horizontal collapse" id={id}>
            {children}
        </div>
    );
};

export { CollapseButton, CollapseArea };
