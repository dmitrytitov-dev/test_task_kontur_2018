import Vue from 'vue';
import IntroPage from '@/components/IntroPage';

describe('IntroPage.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(IntroPage);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('h1').textContent)
      .toEqual('Memory game');
  });
});
