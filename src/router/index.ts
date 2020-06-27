import Vue from 'vue'
import VueRouter, { RouteConfig, Route, RawLocation } from 'vue-router'
import Home from '@/views/Home.vue';
import i18n from '@/plugin/i18n';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  { path: '*', redirect: '/' }
].map(route => {
  if (route.path.startsWith('/') && route.path != '/') route.path = '/(' + i18n.availableLocales.filter(x => x != i18n.fallbackLocale).map(x => x + '/').join("|") + '|\\s*)' + route.path.substr(1, route.path.length - 1)
  if (route.path == '/') route.path = '/(' + i18n.availableLocales.filter(x => x != i18n.fallbackLocale).join("|") + '|\\s*)';
  return route
})

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// language prefix
router.beforeEach(function (to: Route, from: Route, next: Function) {
  const check = to.path.match(new RegExp('^/(' + i18n.availableLocales.filter(x => x != i18n.fallbackLocale).join("|") + ')(.*)'));
  if (check) {
    if (i18n.locale != check[1] && i18n.availableLocales.indexOf(check[1]) != -1) i18n.locale = check[1];
  } else {
    if (i18n.locale !== i18n.fallbackLocale as string) i18n.locale = i18n.fallbackLocale as string;
  }
  next();
});


const resolveUrl = VueRouter.prototype.resolve;
VueRouter.prototype.resolve = function (to: RawLocation, current?: Route | undefined, append?: boolean | undefined) {

  const data = resolveUrl.apply(this, [to, current, append]);
  data.resolved = { ...data.resolved }
  data.route = { ...data.route };
  data.normalizedTo = { ...data.normalizedTo };

  if ((i18n.availableLocales.filter(x => x != i18n.fallbackLocale)).indexOf(i18n.locale) != -1) {
    data.href = '/' + i18n.locale + (data.href == "/" ? '' : data.href);
  }

  if (typeof to !== 'string') {

    const changeLang: string | boolean = to.params && to.params.locale ? to.params.locale : false;
    if (changeLang) {


      if (i18n.locale == i18n.fallbackLocale) {
        data.href = '/' + changeLang + ((data.href == '/') ? '' : data.href);
      } else {

        const path = data.href.replace('/' + i18n.locale + '/' + i18n.locale, '');
        if (changeLang == i18n.fallbackLocale) {
          data.href = path == '' ? '/' : path;
          console.log(data.href);
        } else {
          data.href = '/' + changeLang + (path ? '/' : path);
        }
      }

    }
  }
  data.location.path = data.href; // reactive link, otherwise wont navigate
  data.route.path = data.href;
  data.resolved.path = data.href;
  data.normalizedTo.path = data.href;

  return data
}

export default router
