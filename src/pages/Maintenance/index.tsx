import React, { useEffect } from 'react';
import { useLanguages } from '@/hooks/useLanguages.hook';

import Main_Logo from '@/_statics/images/mint-logo.png';

const Maintenance: React.FC<any> = (props: any): JSX.Element => {
    const Lang = useLanguages();

    return (
        <div className="container-fluid min-vh-100 m-0 p-0">
            <div className="position-absolute top-50 start-50 translate-middle w-100">
                <div className="row col-12">
                    <div className="text-lighter text-center">
                        <img className="" src={Main_Logo} />
                    </div>
                    <div className="text-light text-center fs-3 mt-5">
                        <br />
                        We are currently collecting energy for Klaymint feature updates.
                        <br />
                        The site will be available after about an hour.
                        <br />
                        Thank you!
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Maintenance;
