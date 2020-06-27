<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">{{$t('nav.home')}}</router-link> |
      <router-link to="/about">{{$t('nav.about')}}</router-link> |
      <template v-for="(lang, index) in $i18n.availableLocales.filter(x => x != $i18n.locale)">
        <router-link :to="{path: $route.path, params: {locale: lang}}" :key="index+'_'+lang" :title="$t('language.'+lang)">{{$t('language.'+lang, lang)}}</router-link>
        <template v-if="$i18n.availableLocales.filter(x => x != $i18n.locale).length != 1 && index != $i18n.availableLocales.filter(x => x != $i18n.locale).length -1"> | </template>
      </template>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
