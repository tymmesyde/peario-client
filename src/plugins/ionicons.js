import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { defineCustomElements } from '@ionic/core/loader';
import { paramCase } from 'change-case';

export default {
    install: () => {
        addIcons(Object.fromEntries(Object.entries(icons).map(([key, value]) => [paramCase(key), value])));
        defineCustomElements(window);
    }
}