import Taro from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import SwipAction from "@/components/SwipAction";
import NavBar from "@/components/navbar";
import { observer, inject } from "@tarojs/mobx";
import Model from "@/store/swipAction";
import { toJS } from "mobx";
import "./index.less";

@inject('globalStore')
@observer
class Index extends Taro.Component<any> {

  componentWillMount() {
    Model.getList();
  }

  config: Taro.Config = {
    disableScroll: true,
  };

  cellClick = (e) => {
    e.stopPropagation();
    const { index } = e.currentTarget.dataset;

    Taro.showToast({
      title: `点击了第${index + 1}个cell`,
      icon: "none",
    });
  };

  singleSelect = (id: any) => {
    Model.selectItem(id)
  }

  cancleSelect = (id: any) => {
    Model.cancelSelect(id)
  }

  delete = (id: any) => {
    Model.deleteList(id);
  };

  scroll = () => {
    Model.resetList()
  }

  render() {
    const data = toJS(Model.list);
    const { navHeight } = this.props.globalStore;

    return (
      <View className="container" style={{ paddingTop: `${navHeight}px` }}>
        <NavBar title='侧滑删除' showBack={true} showSearch={false} />
        <ScrollView scrollY className="cells" onScroll={this.scroll} >
          {data.map((item: any, index: number) =>
            <View
              className="container"
              key='id'
              style={{ display: item.display }}
            >
              <SwipAction
                swipid={item.id}
                delete={this.delete}
                isOpened={item.isOpened}
                onOpened={this.singleSelect}
                onClosed={this.cancleSelect}
              >
                <View
                  className="cell"
                  onClick={this.cellClick}
                  data-index={index}
                >
                  <View className="cell__hd">
                    <Image className="img" mode="aspectFill" src={item.images} />
                  </View>
                  <View className="cell__bd">
                    <View className="name">{item.title}</View>
                    <View className="des">{item.description}</View>
                  </View>
                </View>
              </SwipAction>
            </View>)}
        </ScrollView>
      </View>

    );
  }
}

export default Index;
