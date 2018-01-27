import Vue from 'vue';
import IntroPage from '@/components/ResultPage';
import './custom-matchers';

describe('ResultPage.vue', () => {
  it('should render correct contents', () => {
    const moveToGamePageMocked = jest.fn();
    const score = 777;
    const propsData = {
      moveToGamePage: moveToGamePageMocked,
      score
    };
    const Constructor = Vue.extend(IntroPage);
    const vm = new Constructor({propsData}).$mount();

    expect(vm.$el.querySelector('h1').textContent)
      .toEqualIgnoreSpaceCollapsing(`Поздравляем! Ваш итоговый счёт: ${score}`);

    const button = vm.$el.querySelector('button');
    expect(button.textContent)
      .toEqualIgnoreSpaceCollapsing('Ещё раз');

    expect(moveToGamePageMocked.mock.calls.length).toBe(0);
    button.click();
    expect(moveToGamePageMocked.mock.calls.length).toBe(1);
  });
});
