import Taro from "@tarojs/taro";
import { observer } from "@tarojs/mobx";
import { View, ScrollView } from "@tarojs/components";
import "./index.less";

const IStateData = {
  /* 渲染数据 */
  current: 0, // 当前激活的tabItem的索引
  scrolling: true, // 控制 scroll-view 滚动以在异步加载数据的时候能正确获得 dom 信息
  needTransition: false, // 下划线是否需要过渡动画
  translateX: 0, // 下划 line 的左边距离
  lineWidth: 0, // 下划 line 宽度
  scrollLeft: 0, // scroll-view 左边滚动距离
};

interface IProps {
  // 数据源
  tabData: any[];
  // 当前激活的tabItem的索引
  tabCur: number;
  // 是否可以超出滚动
  scroll: boolean;
  // tab高度
  size: number;
  // 颜色
  color: string;
  change: Function;
}

@observer
class Index extends Taro.Component<IProps> {
  staticProps = {
    tabData: [],
    tabCur: 0,
    scroll: false,
    size: 90,
    color: "",
    change: () => {},
  };
  state = IStateData;

  /* 未渲染数据 */
  windowWidth: number = 0; // 屏幕宽度
  tabItems: any[] = []; // 所有 tab 节点信息

  componentWillMount() {
    this.windowWidth = Taro.getSystemInfoSync().windowWidth || 375;
    const { tabCur } = this.props;
    this.setState({
      scrolling: true,
      current: tabCur,
    });
  }

  componentWillReceiveProps(nextProps) {
    const that = this;
    const { tabData, tabCur } = nextProps;
    if (!tabData) return;
    if (this.props.tabData.length !== tabData.length)
      setTimeout(() => {
        Taro.createSelectorQuery()
          .in(this.$scope)
          .selectAll(".tabs__item-child")
          .boundingClientRect((res: any) => {
            that.tabItems = res;
            that.scrollByIndex(tabCur, false);
          })
          .exec();
      }, 200);
  }

  clearData = () => {
    this.state = IStateData;
  };

  /**
   * 切换菜单
   */
  toggleTab = (e: any) => {
    this.props.change({ index: e.currentTarget.dataset.index });
    this.scrollByIndex(e.currentTarget.dataset.index);
  };
  /**
   * 滑动到指定位置
   * @param tabCur: 当前激活的tabItem的索引
   * @param needTransition: 下划线是否需要过渡动画, 第一次进来应设置为false
   */
  scrollByIndex = (index: number, needTransition: boolean = true) => {
    const { scroll } = this.props;
    let item = this.tabItems[index];
    if (!item) return;
    let itemWidth = item.width || 0,
      itemLeft = item.left || 0;
    this.setState({ needTransition });
    if (scroll) {
      // 超出滚动的情况
      // 保持滚动后当前 item '尽可能' 在屏幕中间
      let scrollLeft = itemLeft - (this.windowWidth - itemWidth) / 2;
      this.setState({
        current: index,
        scrollLeft,
        translateX: itemLeft,
        lineWidth: itemWidth,
      });
    } else {
      this.setState({
        current: index,
        translateX: itemLeft,
        lineWidth: itemWidth,
      });
    }
  };

  render() {
    const { tabData = [], scroll = false, size = 90, color = "" } = this.props;
    const {
      current,
      scrolling,
      needTransition,
      translateX,
      lineWidth,
      scrollLeft,
    } = this.state;

    return (
      <ScrollView
        className="scroll-view"
        style={{ height: `${size}rpx` }}
        scrollX={scrolling}
        scrollWithAnimation={scrolling}
        scrollLeft={scrollLeft}
      >
        <View className="tabs-wrap">
          <View
            className={`tabs ${scroll ? "tabs--scroll" : ""}`}
            style={{ height: `${size}rpx` }}
          >
            {tabData.map((item: any, index: number) => (
              <View
                className={`tabs__item ${
                  index === current ? "tabs__item--cur" : ""
                }`}
                style={{ height: `${size}rpx`, lineHeight: `${size}rpx` }}
                key={index}
                onClick={this.toggleTab}
                data-index={index}
              >
                <View
                  className="tabs__item-child"
                  style={{ display: `${scroll ? "block" : "inline-block"}` }}
                >
                  {item}
                </View>
              </View>
            ))}

            <View
              className={`tabs__line ${needTransition ? "transition" : ""}`}
              style={{
                background: color,
                width: `${lineWidth}px`,
                transform: `translateX(${translateX}px)`,
              }}
            ></View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default Index;
