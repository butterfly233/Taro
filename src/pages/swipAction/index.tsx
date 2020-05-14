import Taro from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import SwipAction from "@/components/SwipAction";
import { observer } from "@tarojs/mobx";
import Model from "@/store/swipAction";
import { toJS } from "mobx";
import "./index.less";

@observer
class Index extends Taro.Component {

  componentWillMount(){
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

  singleSelect = (e) => {
    console.log(e);
    // let { data } = this.state;
    // data.map((item: any, key: number) => {
    //   if (index === key) {
    //     item.isOpened = true;
    //   }
    //   else item.isOpened = false;
    //   return item;
    // })
    // this.setState({ data });
  }

  cancleSelect = (e) => {
    console.log(e);
  }


  delete = (id: any) => {
    Model.deleteList(id);
  };

  render() {
    const data = toJS(Model.list);
    
    return (
      <ScrollView scrollY className="cells">
        {data.map((item: any, index: number) =>
          <View
            className="container"
            key='id'
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
    );
  }
}

export default Index;
