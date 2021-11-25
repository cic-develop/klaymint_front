import GlobalStatus from '@/redux/reducers/GlobalStatus.reducer';
import Wallet from '@/redux/reducers/Wallet.reducer';
import Collections from '@/redux/reducers/Collections.reducer';
import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';

const rootReducer = combineReducers({
    GlobalStatus,
    Wallet,
    Collections,
    pender: penderReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
