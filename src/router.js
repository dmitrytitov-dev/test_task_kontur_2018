import Vue from 'vue';
import Router from 'vue-router';
import MainPage from '@/components/MainPage';
import GamePage from '@/components/GamePage';
import ResultPage from '@/components/ResultPage';
import Temp from '@/components/Temp';

Vue.use(Router);

export default new Router({
  routes: [
    {path: '/', component: MainPage},
    {path: '/game', component: GamePage},
    {path: '/result', component: ResultPage},

    {path: '/t', component: Temp}
  ]
});
