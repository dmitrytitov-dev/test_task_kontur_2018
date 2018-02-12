import Vue from 'vue';
import GamePageMenu from '@/components/GamePage/GamePageMenu';
import './custom-matchers';

describe('GamePageMenu.vue', () => {
  it('should render correct contents', () => {
    const onButtonNewGameClickMocked = jest.fn();
    const score = 777;
    const propsData = {
      onButtonNewGameClick: onButtonNewGameClickMocked,
      score
    };
    const Constructor = Vue.extend(GamePageMenu);
    const vm = new Constructor({propsData}).$mount();

    expect(vm.$el.querySelector('.menu__scores-title').textContent).toEqual('Очки:');
    const scoresValue = vm.$el.querySelector('.menu__scores-value');
    expect(scoresValue.textContent).toEqual(score.toString());
    expect(scoresValue.dataset.tid).toBe('Menu-scores');

    const button = vm.$el.querySelector('button');
    expect(button.textContent)
      .toEqualIgnoreSpaceCollapsing('Начать заново');
    expect(button.dataset.tid).toBe('Menu-newGame');

    expect(onButtonNewGameClickMocked.mock.calls.length).toBe(0);
    button.click();
    expect(onButtonNewGameClickMocked.mock.calls.length).toBe(1);
  });
});
