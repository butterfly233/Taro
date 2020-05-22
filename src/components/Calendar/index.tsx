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
  date: moment().format("YYYY-MM-DD"),
  time: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
  text: "今天",
};
const tomorrow = {
  date: moment().add(1, "days").format("YYYY-MM-DD"),
  time: Date.parse(moment().add(1, "days").format("L")),
  text: "明天",
}
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
  defaultDate?: string[] | string,
  formate?: string,
  type?: string,
  minDate?: string, // 最小可选择日期
  maxDate?: string, // 最大可选择日期
  onDateClick?: Function,
}

class Index extends Taro.Component<IProps> {
  static defaultProps = {
    defaultDate: today.date,
    formate: 'YYYY-MM-DD',
    type: 'date',
    minDate: '',
    maxDate: '',
    onDateClick: () => { }
  }

  state = {
    date: [today.date], // 当前日期
    listDate: [], // 当月所有天数
    selectTime: [today.time], // 选中日期
    _minDate: NaN,
    _maxDate: NaN,
  };

  componentWillMount() {
    // 初始化处理用户传入的默认值
    const { defaultDate, type, minDate = '', maxDate = '' } = this.props;
    let selectTimes: number[] = [], dates: string[] = [];
    // 日期范围：数组值处理
    if (type === 'dateRange') {
      if ((defaultDate as string[]).length) {
        (defaultDate as string[]).forEach((item => {
          (dates as string[]).push(moment(item).format("YYYY-MM-DD"));
          (selectTimes as number[]).push(Date.parse(moment(item).format('L')));
        })); // 修订defaultDate的格式
      }
      else {
        dates = [today.date, tomorrow.date];
        selectTimes = [today.time, tomorrow.time]
      }
    }
    if (type === 'date') {
      if (defaultDate) {
        // 单选日期处理
        dates.push(moment(defaultDate as string).format("YYYY-MM-DD")); // 修订defaultDate的格式
        selectTimes.push(Date.parse(moment(defaultDate as string).format('L')));
      }
      else {
        dates = [today.date];
        selectTimes = [today.time]
      }
    }
    const _minDate = minDate ? Date.parse(moment(minDate).format('L')) : NaN;
    const _maxDate = maxDate ? Date.parse(moment(maxDate).format('L')) : NaN;
    this.setState({ date: dates, selectTime: selectTimes, _minDate, _maxDate }, () => {
      this.getData();
    });
  }

  // 每个日历排版显示6行，共42天
  getData = () => {
    const { _minDate, _maxDate } = this.state;
    const currentDate: any[] = [];
    // 获取date的month
    const date: string[] = this.state.date;
    const d = new Date(date[0].replace(/-/g, "/"));
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
          disabled: time < _minDate || time > _maxDate,
        });
      }
      currentDate.push(col);
    }
    this.setState({ listDate: currentDate });
  };

  changeDate = (num: number, type: any) => {
    let date: string[] = this.state.date;
    date[0] = moment(date[0]).add(num, type).format("YYYY-MM-DD");
    this.setState({ date }, () => {
      this.getData();
    });
  };

  clickDate = (data: any) => {
    const { time, date, disabled } = data;
    if (disabled) return;
    const { type, formate } = this.props;
    let selectTime: number[] = this.state.selectTime;
    // 日期单选
    if (type === 'date') {
      selectTime = [time];
    }
    else {  // 日历范围选择： 小的为开始日期，大的为结束日期
      if (selectTime.length === 2) {
        selectTime = [];
        selectTime[0] = time;
      }
      else if (selectTime.length === 1) {
        selectTime[1] = time > selectTime[0] ? time : selectTime[0]; // 先赋值selectTime[1],防止值被覆盖
        selectTime[0] = time < selectTime[0] ? time : selectTime[0];
      }
    }
    this.setState({ selectTime });
    const dates = selectTime.map((item => moment(item).format(formate)))
    if (this.props.onDateClick) {
      this.props.onDateClick(type === 'date' ? date : dates);
    }
  };

  render() {
    const { date, listDate } = this.state;
    const selectTime: number[] = this.state.selectTime;
    const month = moment(date[0]).format("YYYY-MM");

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
                    } ${idate.disabled ? "disabled" : ""}
                    ${selectTime.includes(idate.time) ? "current" : ""}
                    ${selectTime[1] && idate.time > selectTime[0] && idate.time < selectTime[1] ? 'between' : ''}`}
                  key={index}
                  onClick={this.clickDate.bind(this, idate)}
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
