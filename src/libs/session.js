import { createMMKV } from 'react-native-mmkv';
import * as Device from 'expo-device';
import uuid from 'react-native-uuid';

// Inicializa o storage com tratamento de erro
// Usa uma função para garantir que o storage seja inicializado apenas quando necessário
let storage = null;

const getStorage = () => {
    if (storage) {
        return storage;
    }
    
    try {
        // Cria uma instância do MMKV com ID
        storage = createMMKV({
            id: 'appdaloja-storage'
        });
        return storage;
    } catch (error) {
        console.error('Error initializing MMKV storage:', error);
        // Fallback: tenta criar sem ID
        try {
            storage = createMMKV();
            return storage;
        } catch (fallbackError) {
            console.error('Error initializing MMKV storage (fallback):', fallbackError);
            // Não lança erro, apenas retorna null e as funções vão tratar
            return null;
        }
    }
};

export const Constants = {
    ACCOUNT_ID: '{{ACCOUNT_ID}}',
    ONESIGNAL_APP_ID: '{{ONESIGNAL_APP_ID}}',

    SECRET_KEY: '8d05000647b79e5984339beff29549669b2c18af4fe2a8a9ed51e9559afc952c6227ecc1da91b4eb4017e6ac89579e8e35e32609c99b25a5dd904d359663ef9c',
    uniqueId: 'com.mrapps.appdaloja:uniqueId',
    global: 'com.mrapps.appdaloja:global',
    profile: 'com.mrapps.appdaloja:profile',
    tempProfile: 'com.mrapps.appdaloja:tempProfile',
    store: 'com.mrapps.appdaloja:store',
    ads: 'com.mrapps.appdaloja:ads',
    adsUpdatedAt: 'com.mrapps.appdaloja:adsUpdatedAt',
    config: 'com.mrapps.appdaloja:config'
}

export const Session = {
    // UNIQUE ID
    setUniqueId: async () => {
        try {
            const storageInstance = getStorage();
            if (!storageInstance) {
                console.error('MMKV storage not initialized');
                return;
            }
            const exists = Session.getUniqueId();
            if (exists == null || exists == '') {
                let uniqueId = Device.osInternalBuildId || Device.modelId || uuid.v4();
                if (!uniqueId || uniqueId == null) {
                    uniqueId = uuid.v4();
                }

                storageInstance.set(Constants.uniqueId, JSON.stringify(uniqueId))
            }
        } catch (error) {
            console.error('Error setting unique ID:', error);
        }
    },

    getUniqueId: () => {
        try {
            const storageInstance = getStorage();
            if (!storageInstance) {
                console.error('MMKV storage not initialized');
                return '';
            }
            const _id = storageInstance.getString(Constants.uniqueId);
            return (_id ? JSON.parse(_id) : '');
        } catch (error) {
            console.error('Error getting unique ID:', error);
            return '';
        }
    },

    // GLOBAL
    setGlobal: (global) => {
        try {
            const storageInstance = getStorage();
            if (!storageInstance) {
                console.error('MMKV storage not initialized');
                return;
            }
            const serialized = JSON.stringify(global);
            if (serialized) {
                storageInstance.set(Constants.global, serialized);
            }
        } catch (error) {
            console.error('Error setting global in storage:', error);
        }
    },

    getGlobal: () => {
        try {
            const storageInstance = getStorage();
            if (!storageInstance) {
                console.error('MMKV storage not initialized');
                return null;
            }
            const global = storageInstance.getString(Constants.global);
            return (global ? JSON.parse(global) : null);
        } catch (error) {
            console.error('Error getting global from storage:', error);
            return null;
        }
    },

    // STORE
    setStore: (store) => {
        try {
            const storageInstance = getStorage();
            if (!storageInstance) {
                console.error('MMKV storage not initialized');
                return;
            }
            const serialized = JSON.stringify(store);
            if (serialized) {
                storageInstance.set(Constants.store, serialized);
            }
        } catch (error) {
            console.error('Error setting store in storage:', error);
        }
    },

    getStore: () => {
        try {
            const storageInstance = getStorage();
            if (!storageInstance) {
                console.error('MMKV storage not initialized');
                return null;
            }
            let store = storageInstance.getString(Constants.store);

            if (store) { 
                store = JSON.parse(store ?? null); 
            }
            return (store ?? null);
        } catch (err) {
            console.error('Error getting store from storage:', err);
            return null;
        }
    },

    // ADS
    setAds: (ads, _id) => {
        try {
            const storageInstance = getStorage();
            if (!storageInstance) {
                console.error('MMKV storage not initialized');
                return;
            }
            const serialized = JSON.stringify(ads);
            if (serialized) {
                storageInstance.set(`${Constants.ads}-${_id}`, serialized);
            }
        } catch (error) {
            console.error('Error setting ads in storage:', error);
        }
    },

    getAds: (_id) => {
        try {
            const storageInstance = getStorage();
            if (!storageInstance) {
                console.error('MMKV storage not initialized');
                return null;
            }
            _id = _id ?? Session.getStore()?._id;
            let ads = storageInstance.getString(`${Constants.ads}-${_id}`);

            return (ads ? JSON.parse(ads) : null);
        } catch (err) {
            console.error('Error getting ads from storage:', err);
            return null;
        }
    },

    //ADS UPDATED AT
    setAdsUpdatedAt: (adsUpdatedAt, _id) => {
        try {
            const storageInstance = getStorage();
            if (!storageInstance) {
                console.error('MMKV storage not initialized');
                return;
            }
            const serialized = JSON.stringify(adsUpdatedAt);
            if (serialized) {
                storageInstance.set(`${Constants.adsUpdatedAt}-${_id}`, serialized);
            }
        } catch (error) {
            console.error('Error setting adsUpdatedAt in storage:', error);
        }
    },

    getAdsUpdatedAt: (_id) => {
        try {
            const storageInstance = getStorage();
            if (!storageInstance) {
                console.error('MMKV storage not initialized');
                return null;
            }
            let adsUpdatedAt = storageInstance.getString(`${Constants.adsUpdatedAt}-${_id}`);

            if (adsUpdatedAt) {
                adsUpdatedAt = JSON.parse(adsUpdatedAt);
                adsUpdatedAt = new Date(adsUpdatedAt);
            }
            return (adsUpdatedAt ?? null);
        } catch (err) {
            console.error('Error getting adsUpdatedAt from storage:', err);
            return null;
        }
    },

    // CONFIG
    setConfig: (config) => {
        try {
            const storageInstance = getStorage();
            if (!storageInstance) {
                console.error('MMKV storage not initialized');
                return;
            }
            const serialized = JSON.stringify(config);
            if (serialized) {
                storageInstance.set(Constants.config, serialized);
            }
        } catch (error) {
            console.error('Error setting config in storage:', error);
        }
    },

    getConfig: () => {
        try {
            const storageInstance = getStorage();
            if (!storageInstance) {
                console.error('MMKV storage not initialized');
                return null;
            }
            let config = storageInstance.getString(Constants.config);
            if (config) { 
                config = JSON.parse(config); 
            }
            return (config ?? null);
        } catch (error) {
            console.error('Error getting config from storage:', error);
            return null;
        }
    }
}

export default Session;
