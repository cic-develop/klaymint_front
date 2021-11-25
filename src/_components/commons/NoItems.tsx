import React from 'react';
const NoItems: React.FC<any> = (props): JSX.Element => {
    return (
        <div className="card border border-danger my-5" style={{ backgroundColor: 'rgba(225, 100, 100, 0.5)' }}>
            <div className="card-body text-center text-white">{props.children}</div>
        </div>
    );
};
export default NoItems;
