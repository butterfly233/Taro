import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import moment from "moment";

import yearRightArrow from "@/assets/image/calendar/calendarright.png";
import monthRightArrow from "@/assets/image/calendar/calendarright_1.png";
import yearLeftArrow from "@/assets/image/calendar/calendarleft.png";
import monthLeftArrow from "@/assets/image/calendar/calendarleft_1.png";
import "./index.less";

const today = {
  date: moment(new Date()).format("YYYY-MM-DD"),
  time: Date.parse(moment(new Date()).format("YYYY-MM-DD")),
  text: "今天",
};

interface IProps {
  defaultDate?: string;
}

class Index extends Taro.Component<IProps> {
  state = {
    date: "", // 当前日期
    listDate: [], // 当月所有天数
  };
  componentWillMount() {
    const { defaultDate = today.date } = this.props;
    this.setState({ date: defaultDate });
    this.getData(defaultDate);
  }

  getData = (date:string) => {
    // 获取date的month
    const d = new Date(date.replace(/-/g,"/"));
    const m = d.getMonth() + 1;
    
  };

  render() {
    const { date } = this.state;
    return (
      <View className="control-panel">
        <Image mode="aspectFill" src={yearLeftArrow} />
        <Image mode="aspectFill" src={monthLeftArrow} />
        <Text className="date">{date}</Text>
        <Image mode="aspectFill" src={monthRightArrow} />
        <Image mode="aspectFill" src={yearRightArrow} />
      </View>
    );
  }
}
export default Index;
