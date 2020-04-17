import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import Calendar from "@/components/Calendar";
import moment from "moment";

import "./index.less";

class Index extends Taro.Component {
  state = {
    defaultDate: moment(new Date()).format("YYYY-MM-DD"),
  };
  render() {
    const { defaultDate } = this.state;
    return (
      <View className="container">
        <Calendar />
      </View>
    );
  }
}

export default Index;
