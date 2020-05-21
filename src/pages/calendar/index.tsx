import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import Calendar from "@/components/Calendar";
import NavBar from "@/components/navbar";
import moment from "moment";

import "./index.less";
import { inject } from "@tarojs/mobx";

@inject('globalStore')
class Index extends Taro.Component<any> {
  state = {
    defaultDate: moment(new Date()).format("YYYY-MM-DD"),
  };

  selectDate = (e) => {
    console.log(e)
  }

  render() {
    const { navHeight } = this.props.globalStore;
    const { defaultDate } = this.state;
    return (
      <View className="container" style={{ paddingTop: `${navHeight}px` }}>
        <NavBar showBack={true} showSearch={false} title='日历选择' />
        <View className='modal'>
          <Calendar defaultDate={defaultDate} onDateClick={this.selectDate.bind(this)} />
        </View>
      </View>
    );
  }
}

export default Index;
