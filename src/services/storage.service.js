const StorageService = {

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
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