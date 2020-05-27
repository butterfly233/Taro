import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { inject } from "@tarojs/mobx";
import './index.less';

@inject('globalStore')
class Index extends Taro.Component<any> {

  render() {
    const { navHeight } = this.props.globalStore;

    return <View className="container" style={{ paddingTop: `${navHeight}px` }}>
      {this.props.children}
    </View>
  }
}

export default Index