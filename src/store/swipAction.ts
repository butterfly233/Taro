import { observable, action, computed } from "mobx";
import { testData } from "@/assets/common/data";
import Taro from "@tarojs/taro";

class SwipActionStore {
  @observable list: any[] = [];
  @computed get isEmpty() {
    return !this.list.length || this.list.every((item) => item.display === 'none');
  };

  @action
  getList = () => {
    this.list = testData.map((item) => Object.assign(item, { isOpened: false, display: 'block' }));
  }

  @action
  deleteList = (id: any) => {
    const index: number = this.list.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.list[index].isOpened = false;
      this.list[index].display = 'none';
      return;
    }
    Taro.showToast({ title: "操作失败", icon: 'none', duration: 200 })
  }

  @action
  selectItem = (id: any) => {
    const index: number = this.list.findIndex((item) => item.id === id);
    if (index !== -1)
      this.list = this.list.map((item, key) => {
        if (key === index) {
          item.isOpened = true;
        }
        else item.isOpened = false;
        return item;
      })
  }

  @action
  cancelSelect = (id: any) => {
    const index: number = this.list.findIndex((item) => item.id === id);
    if (index !== -1)
      this.list[index].isOpened = false;
  }
}

export default new SwipActionStore();