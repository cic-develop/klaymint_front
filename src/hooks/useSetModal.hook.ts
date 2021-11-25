import React from 'react';

const useSetModalHook = (bol: boolean, setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (bol) document.body.style.overflowY = 'unset';
    else document.body.style.overflowY = 'hidden';

    setState(bol);
};

export default useSetModalHook;
