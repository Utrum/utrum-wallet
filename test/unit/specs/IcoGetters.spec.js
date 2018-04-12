import Vue from 'vue';
import Vuex from 'vuex';
import { expect } from 'chai';
import modules from '../../../src/renderer/store/modules';

Vue.use(Vuex);

describe('Ico openings and closings', () => {

  let store, start, end, config;

  describe('Ico is in the future.', () => {
    beforeEach(() => {
      store = new Vuex.Store({ modules });
      config = {
        icoStartDate: new Date().setHours(new Date().getHours() + 2) / 1000,
        icoEndDate: new Date().setHours(new Date().getHours() + 4) / 1000,
      };
      store.commit('SET_CONFIG', config);
      console.log(new Date().getTime(), store.state.Conf.config.icoStartDate, store.state.Conf.config.icoEndDate);
    });

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
  });

  describe('Ico is in the past.', () => {
    beforeEach(() => {
      store = new Vuex.Store({ modules });
      config = {
        icoStartDate: new Date().setHours(new Date().getHours() - 4) / 1000,
        icoEndDate: new Date().setHours(new Date().getHours() - 1) / 1000,
      };
      store.commit('SET_CONFIG', config);
    });

    it('Ico shouldn\'t be running after endDate', () => {
      expect(store.getters.icoIsRunning).equal(false);
    });
  });
});
