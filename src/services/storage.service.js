import { Subject } from 'rxjs';

const watch$ = new Subject();

const StorageService = {

    watch: watch$,

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        watch$.next();
    },

    get(key) {
        const item = localStorage.getItem(key);
        try {
            return JSON.parse(item);
        } catch(e) {
            return null;
        }
    }

};

export default StorageService;