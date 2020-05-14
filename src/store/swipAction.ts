import { observable, action } from "mobx";
import { testData } from "@/assets/common/data";
import Taro from "@tarojs/taro";

class SwipActionStore {
  @observable list: any[] = [];

  @action
  getList = () => {
    this.list = testData.map((item) => Object.assign(item, { isOpened: false }));
  }

  @action
  deleteList = (id: any) => {
    const index: number = this.list.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.list.splice(index, 1);
      return;
    }
    Taro.showToast({ title: "操作失败", icon: 'none', duration: 200 })
  }
}

export default new SwipActionStore();