import Taro from "@tarojs/taro";
import { ScrollView, View } from "@tarojs/components";

import './index.less';

class Index extends Taro.Component {

  state = {
    scorllX: 0,
  }

  render() {
    return <ScrollView className="container" scrollX>
      <View></View>
    </ScrollView>
  }

}

export default Index;