import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';

Vue.use(VueI18n);

// lazy load messages
function loadLocaleMessages(): LocaleMessages {
  const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  // eslint-disable-next-line
  const messages: any = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale: string = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

// function getBrowserLocale(options = {}) {
//   const defaultOptions = { countryCodeOnly: false };
//   const opt = { ...defaultOptions, ...options };
//   const navigatorLocale = navigator.languages !== undefined ? navigator.languages[0] : navigator.language;
//   if (!navigatorLocale)  return undefined
//   const trimmedLocale = opt.countryCodeOnly ? navigatorLocale.trim().split(/-|_/)[0] : navigatorLocale.trim();
//   // supported locales
//   const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
//   const allowedLang = locales.keys().map(x=>(match=>match?match[1]:undefined)(x.match(/([A-Za-z0-9-_]+)\./i)) );
//   console.log(allowedLang, trimmedLocale) 
//   return allowedLang.indexOf(trimmedLocale) != -1 ? trimmedLocale : undefined
// }

const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})

export default i18n;

new Vue({
  created: function () {
    const html = document.getElementsByTagName("html")[0];

    // i18n.dir = isRtl() ? "rtl" : "ltr";

    if (i18n.locale != html.getAttribute("lang")) html.setAttribute("lang", i18n.locale);
    if (html.getAttribute("dir") != "rtl" && this.isRtl()) html.setAttribute("dir", "rtl");
    if (html.getAttribute("dir") != "ltr" && !this.isRtl()) html.setAttribute("dir", "ltr");

    this.$watch(() => i18n.locale, (newLocale: string) => {
      // localStorage.setItem("LANG", newLocale);
      if (i18n.locale != html.getAttribute("lang")) html.setAttribute("lang", newLocale);
      if (html.getAttribute("dir") != "rtl" && this.isRtl()) html.setAttribute("dir", "rtl");
      if (html.getAttribute("dir") != "ltr" && !this.isRtl()) html.setAttribute("dir", "ltr");
    })
  },
  methods: {
    isRtl: function () {
      return ["he", "ar", "yi"].includes(i18n.locale);
    }
  }
})