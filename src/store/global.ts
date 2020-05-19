import { observable, action } from 'mobx';
import Taro from '@tarojs/taro';

class globalStore {
  @observable navHeight: number = 0;

  @action
  getNavHeight = () => {
    const menuInfo = Taro.getMenuButtonBoundingClientRect();
    const sysInfo = Taro.getSystemInfoSync();
    const { height, top, } = menuInfo;
    const { statusBarHeight } = sysInfo;
    this.navHeight = statusBarHeight + height + (top - statusBarHeight) * 2;
  }
}
export default new globalStore();