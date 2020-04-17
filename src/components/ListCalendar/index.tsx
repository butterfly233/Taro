import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import moment from "moment";
import "./index.less";

const weekMap: string[] = ["日", "一", "二", "三", "四", "五", "六"];
const today = moment(new Date()).format("YYYY-MM-DD");
const tomorrow = moment(today).add(1, "day").format("YYYY-MM-DD");
const recentDays = ["今天", "明天", "后天"];

type TMonth = {
  year: number;
  month: number;
  days: TDate[];
};

type TDate = {
  date: number;
  time: number;
  dateText?: string;
  disabled?: boolean;
  class?: string;
};

interface IProps {
  type: string;
  months?: number;
  defaultDate?: string | string[]; // 默认选中的日期 如：2020-02-01
  onClick?: Function; // 选择日期后的跳转行为
}

interface IState {
  dateList: TMonth[];
  selectTime: number[] | number;
}

export default class Index extends Component<IProps, any> {
  staticProps = {
    type: "date",
    months: 1,
    defaultDate: today,
    onClick: () => {},
  };

  state: IState = {
    dateList: [], // 日期列表
    selectTime: 0, // 选中日期time
  };

  componentWillMount() {
    const { type = "date" } = this.props;
    // 默认选择日期
    let defaultDate: string[] | string;
    if (type === "date") {
      defaultDate = this.props.defaultDate || today;
      this.defaultTime = this.parseToTime(defaultDate as string);
    } else {
      defaultDate = this.props.defaultDate || [today, tomorrow];
      this.defaultTime = [
        this.parseToTime(defaultDate[0]),
        this.parseToTime(defaultDate[1]),
      ];
    }
    recentDays.forEach((item: string, index: number) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      const key = Date.parse(
        `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      );
      this.recentTimes[key] = item;
    });
    this.todayTime = this.parseToTime(today);
    this.setState({ selectTime: this.defaultTime });
    this.createDateList();
  }

  componentWillUnmount() {}

  /** 日期变量 */
  defaultTime: number[] | number;
  recentTimes: any = {};
  todayTime: number;

  /**
   *  创建日期列表数据
   */
  createDateList() {
    const { months = 1 } = this.props;
    let dateList: TMonth[] = [];
    for (let i = 0; i < months; i++) {
      let date = new Date(); // 当前可变日期
      date = new Date(date.getFullYear(), date.getMonth(), 1); // 获取当月的第一天
      date.setMonth(date.getMonth() + i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const totalDay = new Date(year, month, 0).getDate(); // 该月总天数
      const week = new Date(year, month - 1, 1).getDay();
      const item: TMonth = {
        year,
        month,
        days: [],
      };
      for (let j = 0; j < totalDay + week; j++) {
        const tempIndex: number = -week + 1 + j;
        const time =
          tempIndex > 0 ? Date.parse(`${year}/${month}/${tempIndex}`) : 0;
        item.days.push({
          date: tempIndex,
          time,
          dateText: this.recentTimes[time],
          class: this.dateClass(time, this.defaultTime),
          disabled: time < this.todayTime,
        });
      }
      dateList[i] = item;
    }
    this.setState({ dateList });
  }

  /** 日期的样式控制 */
  dateClass = (time: any, compareTime: number[] | number): string => {
    const { type = "date" } = this.props;
    let name: string = "date";
    if (time === this.todayTime) name = "date green"; // 当前日期
    if (type !== "date") {
      const selectTime = compareTime as number[];
      if (selectTime[0] && time === selectTime[0]) {
        // 范围开始日期
        name = "active-start";
      }
      if (selectTime[1] && time === selectTime[1]) {
        // 范围结束日期
        name = "active-end";
      }
      if (
        selectTime[0] &&
        selectTime[1] &&
        time > selectTime[0] &&
        time < selectTime[1]
      ) {
        name = "bg-item";
      }
    } else {
      if (time == compareTime) {
        Object.assign(name, {
          class: "active",
        });
      }
    }
    return name;
  };

  /** 点击日期事件 */
  onPressDate = (e: any) => {
    const { onClick, type = "date" } = this.props;
    const { time } = e.currentTarget.dataset;
    let { dateList, selectTime } = this.state;
    //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
    if (time < this.todayTime || !time) return;
    if (type !== "date") {
      // 范围选择
      if (selectTime[1]) selectTime = []; // 清空之前的选择范围
      if (time == selectTime[0]) return;
      else if (!selectTime[0] || (selectTime[0] && time < selectTime[0]))
        selectTime[0] = time;
      // 未选择开始日期或者选择结束日期小于开始日期
      else selectTime[1] = time;
    } else {
      selectTime = time;
    }
    dateList.map((mItem: TMonth) => {
      mItem.days.map((dItem: TDate) => {
        dItem.class = this.dateClass(dItem.time, selectTime);
        return dItem;
      });
    });
    this.setState(
      {
        dateList,
        selectTime,
      },
      () => {
        onClick ? onClick(moment(new Date(time)).format("YYYY-MM-DD")) : null;
      }
    );
  };

  parseToTime = (date: string): number => {
    return Date.parse(date.replace(/-/g, "/"));
  };

  render() {
    const { dateList } = this.state;
    return (
      <View className="container">
        <View className="weeks">
          {weekMap.map((item: string) => (
            <View className="item" key={item}>
              {item}
            </View>
          ))}
        </View>
        <View className="days">
          {dateList.map((item: TMonth) => (
            <View className="panel" key="month">
              <View className="header">{`${item.year}年${item.month}月`}</View>
              <View className="body">
                {item.days.map((idate: TDate) => (
                  <View
                    className={idate.class}
                    data-disabled={idate.disabled}
                    key="date"
                    data-time={idate.time}
                    onClick={this.onPressDate}
                  >
                    <Text>
                      {Number(idate.date) > 0
                        ? idate.dateText
                          ? idate.dateText
                          : idate.date
                        : ""}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
}
