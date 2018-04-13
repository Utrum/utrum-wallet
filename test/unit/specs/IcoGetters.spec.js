import { shallow, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex';
import { expect } from 'chai';
import App from '@/App.vue';
import modules from '../../../src/renderer/store/modules';

const localVue = createLocalVue()

localVue.use(Vuex)

describe('Ico openings and closings', () => {

  let store, start, end, config, wrapper;
  
  store = new Vuex.Store({ modules });
  wrapper = shallow(App, {
    store,
  });

  describe('Ico is in the future.', () => {
    beforeEach(() => {
      config = {
        icoStartDate: new Date().setHours(new Date().getHours() + 2) / 1000,
        icoEndDate: new Date().setHours(new Date().getHours() + 4) / 1000,
      };
      store.commit('SET_CONFIG', config);
    });

    it('Ico should start in the future', () => {
      expect(store.getters.icoWillBegin).equal(true);
    });

    it('Ico shouldn\'t be running before startDate', () => {
      expect(store.getters.icoIsRunning).equal(false);
    });

    it('App.vue should display ICO Will Begin Banner', () => {
      expect(wrapper.contains('div#icoWillBeginBanner')).equal(true);
    });

    it('App.vue should not display ICO Ended Banner', () => {
      expect(wrapper.contains('div#icoEndedBanner')).equal(false);
    });
  });

  describe('Ico is live !', () => {
    beforeEach(() => {
      config = {
        icoStartDate: new Date().setHours(new Date().getHours() - 2) / 1000,
        icoEndDate: new Date().setHours(new Date().getHours() + 4) / 1000,
      };
      store.commit('SET_CONFIG', config);
    });

    it('Ico should have started after startDate', () => {
      expect(store.getters.icoWillBegin).equal(false);
    });

    it('Ico should be running between startDate and endDate', () => {
      expect(store.getters.icoIsRunning).equal(true);
    });

    it('App.vue should not display ICO Will Begin Banner', () => {
      expect(wrapper.contains('div#icoWillBeginBanner')).equal(false);
    });

    it('App.vue should not display ICO Ended Banner', () => {
      expect(wrapper.contains('div#icoEndedBanner')).equal(false);
    });
  });

  describe('Ico is in the past.', () => {
    beforeEach(() => {
      config = {
        icoStartDate: new Date().setHours(new Date().getHours() - 4) / 1000,
        icoEndDate: new Date().setHours(new Date().getHours() - 1) / 1000,
      };
      store.commit('SET_CONFIG', config);
    });

    it('Ico shouldn\'t be running after endDate', () => {
      expect(store.getters.icoIsRunning).equal(false);
    });

    it('App.vue should not display ICO Will Begin Banner', () => {
      expect(wrapper.contains('div#icoWillBeginBanner')).equal(false);
    });

    it('App.vue should display ICO Ended Banner', () => {
      expect(wrapper.contains('div#icoEndedBanner')).equal(true);
    });
  });
});
