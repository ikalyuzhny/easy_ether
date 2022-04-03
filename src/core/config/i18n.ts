import {initReactI18next} from 'react-i18next';
import i18n from 'i18next';
import dayjs from 'dayjs';

import en from '@easyether/localization/en.json';

i18n.use(initReactI18next).init(
  {
    fallbackLng: 'en',
    resources: {
      en: {
        translation: en,
      },
    },
    interpolation: {
      escapeValue: false,
      format: function (value, format, lng) {
        format = format!.replace(/^['"]|['"]$/g, '');
        if (value instanceof Date) {
          dayjs().locale(lng!);
          return dayjs(value).format(format || 'DD.MM.YYYY');
        }

        return value;
      },
    },

    react: {
      useSuspense: true,
    },
  },
  undefined,
);

export default i18n;
