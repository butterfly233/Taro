import Taro from "@tarojs/taro";
import { ScrollView } from "@tarojs/components";
import Calendar from "@/components/ListCalendar";

import "./index.less";

class Index extends Taro.Component {
  state = {
    type: "date-range", // 选择日期或日期范围
    months: 7, // 要显示的months,默认为1
    defaultDate: "", // 默认选择的日期
  };

  dateClick = (date:string) => {
    console.log("click",date);
  };

  render() {
    const { defaultDate, type, months } = this.state;
    return (
      <ScrollView scrollY className="container">
        <Calendar
          months={months}
          defaultDate={defaultDate}
          type={type}
          onClick={this.dateClick}
        />
      </ScrollView>
    );
  }
}

export default Index;
