import Taro from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import SwipAction from "@/components/SwipAction";
import { testData } from "@/assets/common/data";

import "./index.less";

class Index extends Taro.Component {
  config: Taro.Config = {
    disableScroll: true,
  };

  state = {
    current: 0,
    single: true, // 每次只能滑动删除一个
  };

  cellClick = (e) => {
    const { index } = e.currentTarget.dataset;

    Taro.showToast({
      title: `点击了第${index}个cell`,
      icon: "none",
    });
  };
  touchStart = (e) => {
    const { index } = e.currentTarget.dataset;
    this.setState({ current: index });
  };
  delete = (e) => {
    const { index } = e.currentTarget.dataset;

    Taro.showToast({
      title: `删除了第${index}个cell`,
      icon: "none",
    });
  };

  render() {
    const { current, single } = this.state;
    return (
      <ScrollView scrollY className="cells">
        {testData.map((item: any, index: number) => (
          <View
            className="container"
            key="id"
            onTouchStart={this.touchStart}
            data-index={index}
          >
            <SwipAction
              delete={this.delete}
              single={single}
              isCurrent={current === index}
              data-index={index}
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
          </View>
        ))}
      </ScrollView>
    );
  }
}

export default Index;
