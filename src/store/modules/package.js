import axios from 'axios';
import router from '../../router';

export default {
    state: {
        searchId: Date.now(), // id поиска, чтобы обновлять компонент SearchResult
        packages: [],
        pageSize: 10, // Количество пакетов выводимых за раз
        totalPages: null, // Количество страниц
        requestSize: 50, // Максимальное запршиваемых количество пакетов
    },

    getters: {
        packages(state) {
            const activePage = +router.currentRoute.value.query.page;
            return state.packages.slice((activePage - 1) * state.pageSize, activePage * state.pageSize);
        },

        totalPages(state) {
            return state.totalPages;
        },

        searchId(state) {
            return state.searchId;
        }
    },

    mutations: {
        setPackages(state, packages) {
            state.packages = packages.map((item, index) => ({
                ...item.package,
                id: index + 1
            }));
        },

        setTotalPages(state, totalResults) {
            state.totalPages = Math.ceil(Math.min(state.requestSize, totalResults) / state.pageSize);
        },

        setSearchId(state, id) {
            state.searchId = id;
        }
    },

    actions: {
        async searchPackages({ state, commit, dispatch }, { searchText }) {
            commit('loader/setLoading', true, { root: true });
            commit('setSearchId', Date.now());

            try {
                const response = await axios.get(process.env.VUE_APP_BASEURL, {
                    params: {
                        q: searchText,
                        size: state.requestSize
                    }
                });

                const packages = response.data.results;

                if (!packages.length) {
                    commit('toast/setToast', { toast: 'search/not-found', toastType: 'error' }, { root: true });
                }

                commit('setTotalPages', response.data.total);
                commit('setPackages', packages);
            }
            catch (e) {
                console.log(e)
            }
            finally {
                commit('loader/setLoading', false, { root: true })
            }
        },
    },
    namespaced: true
}
