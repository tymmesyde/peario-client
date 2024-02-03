import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { defineCustomElements } from '@ionic/core/loader';
import { kebabCase } from 'change-case';

export default {
    install: () => {
        addIcons(Object.fromEntries(Object.entries(icons).map(([key, value]) => [kebabCase(key), value])));
        defineCustomElements(window);
    }
}