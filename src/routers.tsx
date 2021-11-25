import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Secure from '@/_components/commons/Secure';

import Main from '@/pages/main';
import MyPage from '@/pages/myPage';
import CollectionsDetail from '@/pages/CollectionsDetail';
import HelpCenter from '@/pages/HelpCenter';
import NotFound from '@/pages/NotFound';
import Collections from '@/pages/Collections';
import HelpCancelCanter from '@/pages/HelpCancelCenter';

const Routers: React.FC<any> = (): JSX.Element => {
    return (
        <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/myPage" component={MyPage} />
            <Route exact path="/collections" component={Collections} />
            <Route exact path="/collections/:contractName/:brandName" component={CollectionsDetail} />
            <Route exact path="/helpCenter" component={HelpCenter} />
            <Route exact path="/HelpCancelCanter" component={HelpCancelCanter} />
            <Route path={'*'} component={NotFound} />
        </Switch>
    );
};

export { Routers };
