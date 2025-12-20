import {
  LAYOUTS,
  PAGES_WITHOUT_AUTHORIZATION,
  LOCAL_STORAGE_NAME
} from "@/composables/const";
import application from "@/composables/application";
import {getComponentInstance} from "@/composables/utils";
import type {
  ApplicationState,
  User
} from "@/composables/types";
import {watch} from 'vue';

export default {
  async setup() {
    const applicationVariables = {
      application,
      layout: ref('unauthorized'),
      unwatchUserData: null,
    };

    const ctx = getComponentInstance();

    let store = window.localStorage.getItem(LOCAL_STORAGE_NAME);
    if (store) {
      try {
        store = JSON.parse(store);
      } catch (e) {
        store = null as any
      }
    }

    /*
        MAKE APPLICATION GLOBAL VARIABLES
     */
    Object.assign(application, {
      config: useRuntimeConfig().public,
      state: reactive<ApplicationState>({
        isLoading: true,
        isAuthorized: false,
        user: {} as User,
        users: []
      }),
      store: reactive(store || {}),

      route(link: string) {
        (ctx.$nuxt.$router as any).push(`/${link}`);
      }
    });

    const onApplicationStateChange = () => {
      localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(application.store));
    };

    watch(application.store, onApplicationStateChange, {deep: true});
    !store && onApplicationStateChange();

    return applicationVariables;
  },

  watch: {
    $route: 'onRouteChanged'
  },

  async created(this: any) {
    await this.onRouteChanged();
    this.on('logout', this.logout);
  },

  mounted(this: any) {
    document.addEventListener('keydown', (e) => {
      this.emit('keydown', e);
    });
    console.log('Application has been started');
  },

  methods: {
    async onRouteChanged(this: any) {
      const page = this.$nuxt.$router.currentRoute.value.name.split('_')[0];
      this.layout = Object.entries(LAYOUTS).find(([_, pages])=>pages.includes(page))?.[0] || 'main';
      Object.entries(LAYOUTS);

      if (application.state.isAuthorized) return;

      const fullPath = this.$nuxt.$router.currentRoute.value.fullPath.substring(1);
      const pageRequiresAuthorization = !~PAGES_WITHOUT_AUTHORIZATION.indexOf(page);

      if (pageRequiresAuthorization) {
        try {
          console.log(123,  application.config.host);
        } catch (e: any) {
          console.error(e.message);
          this.logout(fullPath);
          return;
        }
      }
    },

    logout(this: any, fullPath?: string) {
      application.route('login' + (fullPath ? `?path=${fullPath}` : ''));
    }
  }
}
