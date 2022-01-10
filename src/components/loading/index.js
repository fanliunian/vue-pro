import { Loading } from 'element-ui';
import Store from '@/store/modules/admin';
let loading;
const startLoading = () => {
    loading = Loading.service({
        lock: true,
        text: '',
        background: 'rgba(0, 0, 0, 0.3)'
    });
};

const endLoading = () => {
    loading.close();
};

export const loadingStart = () => {
    if (Store.state.loadControl) {
        startLoading();
    }else{
        endLoading();
    }
};