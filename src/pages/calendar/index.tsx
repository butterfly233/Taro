import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import Calendar from "@/components/Calendar";
import NavBar from "@/components/navbar";
import Modal from "@/components/modal";
import calendar1Icon from "@/assets/image/main/date.png";
import calendar2Icon from "@/assets/image/main/rili.png";
import moment from "moment";

import "./index.less";
import { inject } from "@tarojs/mobx";

@inject('globalStore')
class Index extends Taro.Component<any> {
  now: string = moment().format("YYYY-MM-DD");

  state = {
    defaultDate: this.now,
    defaultDateRange: [moment().format("YYYY-MM-DD"), moment().add(1, 'days').format("YYYY-MM-DD")],
    calendar1Visible: false,
    calendar2Visible: false,
  };

  selectDate = (date: string) => {
    this.setState({ defaultDate: date });
  }

  selectDateRange = (dates: string[]) => {
    this.setState({ defaultDateRange: dates });
  }

  openCalender1Modal = () => {
    this.setState({ calendar1Visible: true })
  }

  openCalender2Modal = () => {
    this.setState({ calendar2Visible: true })
  }

  closeCalender1Modal = () => {
    this.setState({ calendar1Visible: false })
  }

  closeCalender2Modal = () => {
    this.setState({ calendar2Visible: false })
  }

  render() {
    const { navHeight } = this.props.globalStore;
    const { defaultDate, defaultDateRange, calendar1Visible, calendar2Visible } = this.state;
    return (
      <View className="container" style={{ paddingTop: `${navHeight}px` }}>
        <NavBar showBack={true} showSearch={false} title='日历选择' />
        <View className='input-data' onClick={this.openCalender1Modal}><Image className='icon' src={calendar1Icon} mode="aspectFill" /><Text>{defaultDate}</Text></View>
        <View className='input-data' onClick={this.openCalender2Modal}><Image className='icon' src={calendar2Icon} mode="aspectFill" />{defaultDateRange.join(' ~ ')}</View>
        <Modal visible={calendar1Visible} onClose={this.closeCalender1Modal} onCancel={this.closeCalender1Modal} onConfirm={this.closeCalender1Modal} >
          <Calendar type='date' defaultDate={defaultDate} onDateClick={this.selectDate.bind(this)} minDate={this.now} />
        </Modal>
        <Modal visible={calendar2Visible} onClose={this.closeCalender2Modal} onCancel={this.closeCalender2Modal} onConfirm={this.closeCalender2Modal} >
          <Calendar type='dateRange' defaultDate={defaultDateRange} onDateClick={this.selectDateRange.bind(this)} />
        </Modal>
      </View>
    );
  }
}

export default Index;
