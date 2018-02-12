import Vue from 'vue';
import IntroPage from '@/components/IntroPage';
import './custom-matchers';

describe('IntroPage.vue', () => {
  it('should render correct contents', () => {
    const moveToGamePageMocked = jest.fn();
    const propsData = {moveToGamePage: moveToGamePageMocked};
    const Constructor = Vue.extend(IntroPage);
    const vm = new Constructor({propsData}).$mount();

    expect(vm.$el.querySelector('h1').textContent).toEqual('Memory game');

    const button = vm.$el.querySelector('button');
    expect(button.textContent)
      .toEqualIgnoreSpaceCollapsing('Начать игру');
    expect(button.dataset.tid).toBe('NewGame-startGame');

    expect(moveToGamePageMocked.mock.calls.length).toBe(0);
    button.click();
    expect(moveToGamePageMocked.mock.calls.length).toBe(1);
  });
});
