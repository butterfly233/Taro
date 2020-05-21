import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import yearRightArrow from "@/assets/image/calendar/calendarright.png";
import monthRightArrow from "@/assets/image/calendar/calendarright_1.png";
import yearLeftArrow from "@/assets/image/calendar/calendarleft.png";
import monthLeftArrow from "@/assets/image/calendar/calendarleft_1.png";
import "./index.less";
import moment from "moment";
import { calendar } from "@/utils/lunar";

const now = new Date();
const today = {
  date: moment(new Date()).format("YYYY-MM-DD"),
  time: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
  text: "今天",
};
const weekMap: string[] = ["日", "一", "二", "三", "四", "五", "六"];
const monthsMap: string[] = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

interface IProps {
  defaultDate?: string;
  formate?: string,
  onDateClick?: Function;
}

class Index extends Taro.Component<IProps> {
  static defaultProps = {
    defaultDate: today.date,
    formate: 'YYYY-MM-DD',
    onDateClick: () => { }
  }

  state = {
    date: "", // 当前日期
    listDate: [], // 当月所有天数
    selectTime: 0, // 选中日期
  };
  componentWillMount() {
    let { defaultDate = today.date } = this.props;
    defaultDate = moment(defaultDate).format("YYYY-MM-DD"); // 修订defaultDate的格式
    const date = new Date(defaultDate.replace(/-/g, "/"));
    const selectTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
    console.log(selectTime)
    this.setState({ date: defaultDate, selectTime }, () => {
      this.getData();
    });
  }

  // 每个日历排版显示6行，共42天
  getData = () => {
    const currentDate: any[] = [];
    // 获取date的month
    const { date } = this.state;
    const d = new Date(date.replace(/-/g, "/"));
    const y = d.getFullYear();
    const m = d.getMonth();
    const firstDayWeek = new Date(y, m, 1).getDay(); // 第一天的week
    const totalDay = new Date(y, m, 0).getDate(); // 该月总天数
    for (let i = 0; i < 6; i++) {
      let col: any[] = [];
      for (let j = i * 7; j < i * 7 + 7; j++) {
        const tempIndex: number = -firstDayWeek + 1 + j;
        let date = new Date(y, m, tempIndex);
        const day = date.getDate();
        const time = date.getTime();
        const lunarObj: any = calendar.solar2lunar(
          date.getFullYear(),
          date.getMonth() + 1,
          day
        );
        const formateDate = moment(date).format(this.props.formate)
        col.push({
          date: formateDate,
          time: date.getTime(),
          day,
          lunar: lunarObj.IDayCn,
          currentMonth: !(tempIndex <= 0 || tempIndex > totalDay),
          isToday: time === today.time,
        });
      }
      currentDate.push(col);
    }
    this.setState({ listDate: currentDate });
  };

  changeDate = (num: number, type: any) => {
    let { date } = this.state;
    date = moment(date).add(num, type).format("YYYY-MM-DD");
    this.setState({ date }, () => {
      this.getData();
    });
  };

  clickDate = (e) => {
    const { time } = e.currentTarget.dataset;
    this.setState({ selectTime: time });
    if (this.props.onDateClick) {
      this.props.onDateClick(e)
    }
  };

  render() {
    const { date, listDate, selectTime } = this.state;
    const month = moment(date).format("YYYY-MM");
    return (
      <View className="container">
        <View className="control-panel">
          <Image
            mode="aspectFill"
            src={yearLeftArrow}
            onClick={this.changeDate.bind(this, -1, "year")}
          />
          <Image
            mode="aspectFill"
            src={monthLeftArrow}
            onClick={this.changeDate.bind(this, -1, "month")}
          />
          <Text className="date">{month}</Text>
          <Image
            mode="aspectFill"
            src={monthRightArrow}
            onClick={this.changeDate.bind(this, 1, "month")}
          />
          <Image
            mode="aspectFill"
            src={yearRightArrow}
            onClick={this.changeDate.bind(this, 1, "year")}
          />
        </View>
        <View className="body">
          <View className="row week">
            {weekMap.map((iweek, index) => (
              <View className="item bold" key={index}>
                {iweek}
              </View>
            ))}
          </View>
          {listDate.map((item: any, index: number) => (
            <View className="row" key={index}>
              {item.map((idate: any, index) => (
                <View
                  className={`item ${idate.currentMonth ? "" : "gray"} ${
                    idate.isToday ? "today" : ""
                    } ${selectTime === idate.time ? "current" : ""}`}
                  key={index}
                  data-time={idate.time}
                  data-date={idate.date}
                  onClick={this.clickDate}
                >
                  <Text className="date">{idate.day}</Text>
                  <Text className="lunar">{idate.lunar}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }
}
export default Index;
