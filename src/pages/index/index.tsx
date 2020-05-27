import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import NavBar from '@/components/navbar/index';
import listIcon from "@/assets/image/main/list.png";
import indexListIcon from "@/assets/image/main/index-list.png";
import TabIcon from "@/assets/image/main/drag.png";
import slipIcon from "@/assets/image/main/side-slip.png";
import calendar1Icon from "@/assets/image/main/date.png";
import calendar2Icon from "@/assets/image/main/rili.png";
import modalIcon from "@/assets/image/main/modal.png";
import imgIcon from "@/assets/image/main/img.png";
import { inject } from "@tarojs/mobx";
import "./index.less";


const UrlMap: any[] = [
  { name: "下拉刷新", "page": "/pages/scroll/index", icon: listIcon },
  { name: "城市索引", "page": "/pages/indexList/index", icon: indexListIcon },
  { name: "Tab标签页", "page": "/pages/tab/index", icon: TabIcon },
  { name: "侧滑", "page": "/pages/swipAction/index", icon: slipIcon },
  { name: "列表日历", "page": "/pages/listCalendar/index", icon: calendar1Icon },
  { name: "横向日历", "page": "/pages/calendar/index", icon: calendar2Icon },
  { name: "模态框", "page": "/pages/modal/index", icon: modalIcon },
  { name: "异步加载图片", "page": "/pages/asyncImage/index", icon: imgIcon },
]

@inject('globalStore')
class Index extends Component<any> {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "Taro组件"
  };

  componentWillMount() { }

  componentWillReact() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  jumpPage = (url: string) => {
    if (!url) return;
    Taro.navigateTo({ url });
  };

  render() {
    const { navHeight } = this.props.globalStore;
    return (
      <View className="container" style={{ paddingTop: `${navHeight}px` }}>
        <NavBar showBack={false} showSearch={true} />
        {UrlMap.map((item: any) => <View className="panel" key="name" onClick={this.jumpPage.bind(this, item.page)}>
          <Image src={item.icon} mode="aspectFit" className="img" />
          {item.name}
        </View>)}
      </View>
    );
  }
}

export default Index;
