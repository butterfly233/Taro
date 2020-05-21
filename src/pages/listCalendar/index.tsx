import Taro from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import Calendar from "@/components/ListCalendar";
import NavBar from "@/components/navbar";

import "./index.less";
import { inject } from "@tarojs/mobx";

@inject('globalStore')
class Index extends Taro.Component<any> {
  state = {
    type: "date-range", // 选择日期或日期范围
    months: 7, // 要显示的months,默认为1
    defaultDate: "", // 默认选择的日期
  };

  dateClick = (date: string) => {
    console.log("click", date);
  };

  render() {
    const { navHeight } = this.props.globalStore;
    const { defaultDate, type, months } = this.state;
    return (
      <View className="container" style={{ paddingTop: `${navHeight}px` }}>
        <NavBar showBack={true} title='选择范围日历' showSearch={false} />
        <ScrollView scrollY className="scroll_view" >
          <Calendar
            months={months}
            defaultDate={defaultDate}
            type={type}
            onClick={this.dateClick}
          />
        </ScrollView>
      </View>
    );
  }
}

export default Index;
