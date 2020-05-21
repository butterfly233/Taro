import Taro from "@tarojs/taro";
import {
  View,
  MovableArea,
  MovableView,
  ScrollView,
  Image,
} from "@tarojs/components";
import { observer } from "@tarojs/mobx";
import emptyImageUrl from "@/assets/image/empty/empty.png";

import "./index.less";

interface IProps {
  // 加载中
  requesting: boolean;
  // 加载完毕
  end: boolean;
  // 控制空状态的显示
  emptyShow: boolean;
  // 当前列表长度
  listCount: number;
  // 空状态的图片
  emptyUrl?: string;
  // 空状态的文字提示
  emptyText?: string;
  // 是否有header
  hasTop: boolean;
  // 下拉刷新的高度
  refreshSize: number;
  // 底部高度
  bottomSize: number;
  // 颜色
  color: string;
  // iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向
  enableBackToTop: boolean;
  // 下拉刷新
  refresh: Function;
  // 上拉加載更多
  more: Function;
}

@observer
class Index extends Taro.Component<IProps> {
  static defaultProps = {
    requesting: false,
    end: false,
    emptyShow: false,
    listCount: 0,
    emptyUrl: emptyImageUrl,
    emptyText: "未找到数据",
    hasTop: false,
    refreshSize: 90,
    bottomSize: 0,
    color: "",
    enableBackToTop: false,
    refresh: () => { },
    more: () => { },
  };

  state = {
    mode: "refresh", // refresh 和 more 两种模式
    successShow: false, // 显示success
    successTran: false, // 过度success
    refreshStatus: 1, // 1: 下拉刷新, 2: 松开更新, 3: 加载中, 4: 加载完成
    move: -45, // movable-view 偏移量
    scrollTop: 0,
    overOnePage: false,
  };

  isTouching: boolean = false; // refresh 用户拉动高度
  diff: number = 0; // refresh 用户拉动高度
  scrollHeight1: number = 0; // refresh view 高度负值
  scrollHeight2: number = 0; // refresh view - success view 高度负值
  timer: any = null;

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { requesting, refreshSize } = nextProps;
    if (this.props.requesting !== requesting) {
      this.requestingEnd(this.props.requesting, requesting);
    }
    if (this.props.refreshSize !== refreshSize) {
      this.refreshChange();
    }
  }

  /**
   * 处理 bindscrolltolower 失效情况
   */
  scroll = (e) => {
    // 可以触发滚动表示超过一屏
    this.setState({
      overOnePage: true,
    });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({
        scrollTop: e.detail.scrollTop,
      });
    }, 100);
  };

  touchstart = () => {
    this.isTouching = true;
  }

  /**
   * movable-view 滚动监听
   */
  change = (e) => {
    let refreshStatus = this.state.refreshStatus;
    if (refreshStatus >= 3) return;
    if (this.isTouching) {
      this.diff = e.detail.y;
      this.setState({
        refreshStatus: this.diff > -10 ? 2 : 1,
      });
    }
  };

  itemClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e);
  };
  /**
   * movable-view 触摸结束事件
   */
  touchend = () => {
    const { refreshStatus } = this.state;
    this.isTouching = false;
    if (refreshStatus >= 3) return;
    if (refreshStatus === 2) {
      Taro.vibrateShort();
      this.setState({
        refreshStatus: 3,
        move: 0,
        mode: "refresh",
      });
      this.props.refresh();
    } else if (refreshStatus === 1) {
      this.setState({
        move: -50 + this.diff, // 动态值，触发渲染
      });
    }
  };
  /**
   * 加载更多
   */
  loadMore = () => {
    if (!this.props.end) {
      this.setState({ mode: "more" });
      this.props.more();
    }
  };
  /**
   * 监听 requesting 字段变化, 来处理下拉刷新对应的状态变化
   */
  requestingEnd = (oldVal: boolean, newVal: boolean) => {
    const that = this;
    const { scrollHeight2, scrollHeight1 } = this;
    const { mode, refreshStatus } = that.state;
    if (mode === "more") return;
    if (oldVal === true && newVal === false) {
      setTimeout(() => {
        that.setState({
          successShow: true,
          refreshStatus: 4,
          move: scrollHeight2,
        });
        setTimeout(() => {
          that.setState({ successTran: true, move: scrollHeight1 });
          setTimeout(() => {
            that.setState({
              refreshStatus: 1,
              successShow: false,
              successTran: false,
              move: scrollHeight1,
            });
          }, 350);
        }, 1500);
      }, 600);
    } else {
      if (refreshStatus !== 3) {
        this.setState({
          refreshStatus: 3,
          move: 0,
        });
      }
    }
  };
  /**
   * 监听下拉刷新高度变化, 如果改变重新初始化参数, 最小高度80rpx
   */
  refreshChange = () => {
    // 异步加载数据时候, 延迟执行 init 方法, 防止基础库 2.7.1 版本及以下无法正确获取 dom 信息
    setTimeout(() => this.init(), 10);
  };
  /**
   * 初始化scroll组件参数, 动态获取下拉刷新区域 和 success 的高度
   */
  init = () => {
    let { windowWidth } = Taro.getSystemInfoSync();
    let successHeight = ((windowWidth || 375) / 750) * 70;

    Taro.createSelectorQuery()
      .in(this.$scope)
      .select("#refresh")
      .boundingClientRect((res: any) => {
        this.scrollHeight1 = -res.height;
        this.scrollHeight2 = successHeight - res.height;
      })
      .exec();
  };

  render() {
    const { } = this;
    const {
      hasTop,
      color,
      refreshSize,
      bottomSize,
      enableBackToTop,
      emptyShow,
      listCount,
      emptyUrl = emptyImageUrl,
      emptyText = "未找到数据",
      end,
    } = this.props;
    const {
      successShow,
      successTran,
      refreshStatus,
      move,
      scrollTop,
      overOnePage,
    } = this.state;

    return (
      <View>
        <View
          id="success"
          className={`success ${successShow ? "success--show" : ""} ${
            successTran ? "success--tran" : ""
            }`}
          style={{ top: `${hasTop ? refreshSize : 0}rpx`, color: color }}
        >
          <View className="info">刷新成功</View>
        </View>
        <MovableArea className="movable-area">
          <MovableView
            className="scroll"
            style={{ height: `calc(100vh + 40rpx + ${refreshSize}rpx)` }}
            onChange={this.change}
            onVTouchMove={this.touchstart}
            onTouchEnd={this.touchend}
            direction="vertical"
            disabled={refreshStatus >= 3}
            y={move}
            animation
          >
            <ScrollView
              className="scroll__view"
              style={{
                paddingBottom: `${bottomSize}rpx`,
                paddingTop: `${hasTop ? refreshSize : 0}rpx`,
              }}
              scrollY={refreshStatus == 1}
              onScroll={this.scroll}
              scrollTop={scrollTop}
              enableBackToTop={enableBackToTop}
              lowerThreshold={80}
              onScrollToLower={this.loadMore}
            >
              <View
                id="refresh"
                className={`scroll__refresh ${
                  successShow ? "scroll__refresh--hidden" : ""
                  }`}
                style={{ height: `${refreshSize}rpx`, padding: "20rpx 0" }}
              >
                <View className="scroll__loading">
                  {refreshStatus == 1 || refreshStatus == 2 ? (
                    <View
                      className={`${refreshStatus == 2 ? "rotate" : ""} arrow`}
                    ></View>
                  ) : null}
                  {refreshStatus == 3 ? (
                    <View className="loading">
                      <View className="loading__item"></View>
                      <View className="loading__item"></View>
                      <View className="loading__item"></View>
                      <View className="loading__item"></View>
                      <View className="loading__item"></View>
                      <View className="loading__item"></View>
                      <View className="loading__item"></View>
                      <View className="loading__item"></View>
                      <View className="loading__item"></View>
                      <View className="loading__item"></View>
                      <View className="loading__item"></View>
                      <View className="loading__item"></View>
                    </View>
                  ) : null}
                  {refreshStatus == 1 ? (
                    <View className="text">下拉刷新</View>
                  ) : null}
                  {refreshStatus == 2 ? (
                    <View className="text">松开更新</View>
                  ) : null}
                  {refreshStatus == 3 ? (
                    <View className="text">加载中...</View>
                  ) : null}
                </View>
              </View>
              {this.props.children}
              {listCount === 0 && emptyShow ? (
                <View className="empty">
                  <Image className="empty__image" src={emptyUrl}></Image>
                  <View className="empty__text">{emptyText}</View>
                </View>
              ) : null}
              {listCount !== 0 && overOnePage ? (
                <View className="scroll__bottom">
                  {end ? (
                    <View className="scroll__loading">已全部加载</View>
                  ) : (
                      <View className="scroll__loading">
                        <View className="loading">
                          <View className="loading__item"></View>
                          <View className="loading__item"></View>
                          <View className="loading__item"></View>
                          <View className="loading__item"></View>
                          <View className="loading__item"></View>
                          <View className="loading__item"></View>
                          <View className="loading__item"></View>
                          <View className="loading__item"></View>
                          <View className="loading__item"></View>
                          <View className="loading__item"></View>
                          <View className="loading__item"></View>
                          <View className="loading__item"></View>
                        </View>
                        <View className="text">加载中...</View>
                      </View>
                    )}
                </View>
              ) : null}
            </ScrollView>
          </MovableView>
        </MovableArea>
      </View>
    );
  }
}

export default Index;
