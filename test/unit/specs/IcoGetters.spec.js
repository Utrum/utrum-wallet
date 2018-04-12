import Vue from 'vue';
import Vuex from 'vuex';
import { expect } from 'chai';
import modules from '../../../src/renderer/store/modules';

Vue.use(Vuex);

const today = new Date();

describe('Ico openings and closings', () => {

  let store, start, end, config;

  describe('Ico is in the future.', () => {
    beforeEach(() => {
      store = new Vuex.Store({ modules });
      start = new Date();  end = new Date();
      config = {
        icoStartDate: start.setHours(today.getHours() + 2),
        icoEndDate: end.setHours(today.getHours() + 4),
      };
      store.commit('SET_CONFIG', config);
      console.log(store.state.Conf.config.icoStartDate, store.state.Conf.config.icoEndDate);
    });

    // afterEach(() => {
    //   store = start = end = config = null;
    // });

    it('Ico should start in the future', () => {
      expect(store.getters.icoWillBegin).equal(true);
    });

    it('Ico shouldn\'t be running before startDate', () => {
      expect(store.getters.icoIsRunning).equal(false);
    });
  });

  describe('Ico is live !', () => {
    beforeEach(() => {
      store = new Vuex.Store({ modules });
      start = new Date(); end = new Date();
      config = {
        icoStartDate: start.setHours(today.getHours() - 2),
        icoEndDate: end.setHours(today.getHours() + 4),
      };
      store.commit('SET_CONFIG', config);
      console.log(store.state.Conf.config.icoStartDate, store.state.Conf.config.icoEndDate);
    });

    // afterEach(() => {
    //   store = start = end = config = null;
    // });

    it('Ico should have started after startDate', () => {
      expect(store.getters.icoWillBegin).equal(false);
    });

    it('Ico should be running between startDate and endDate', () => {
      expect(store.getters.icoIsRunning).equal(true);
    });
  });

  describe('Ico is in the past.', () => {
    beforeEach(() => {
      store = new Vuex.Store({ modules });
      start = new Date(); end = new Date();
      config = {
        icoStartDate: start.setHours(today.getHours() - 4),
        icoEndDate: end.setHours(today.getHours() - 1),
      };
      store.commit('SET_CONFIG', config);
      console.log(store.state.Conf.config.icoStartDate, store.state.Conf.config.icoEndDate);
    });

    // afterEach(() => {
    //   store = start = end = config = null;
    // });

    it('Ico shouldn\'t be running after endDate', () => {
      expect(store.getters.icoIsRunning).equal(false);
    });
  });
});
