import {
	createSSRApp
} from "vue";
import '@tdesign/uniapp/theme.less';
import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}
