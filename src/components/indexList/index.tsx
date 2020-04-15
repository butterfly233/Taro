import Taro from "@tarojs/taro";
import { View, ScrollView, Image } from "@tarojs/components";
import { observer } from "@tarojs/mobx";
import { ColorUtil } from "@/utils/util";
import emptyImg from "@/assets/image/empty/empty.png";

import "./index.less";

interface IProps {
  // 数据源
  listData: any[];
  list: any[];
  // 顶部高度
  topSize: number;
  // 底部高度
  bottomSize?: number;
  // 颜色
  color: string;
  // 空状态的图片
  emptyUrl?: string;
  // 空状态的文字提示
  emptyText?: string;
  // 控制空状态的显示
  emptyShow?: boolean;
  click: Function;
}

@observer
class Index extends Taro.Component<IProps> {
  staticProps = {
    listData: [],
    list: [],
    topSize: 0,
    bottomSize: 0,
    color: "",
    emptyUrl: emptyImg,
    emptyText: "未找到数据",
    emptyShow: false,
    click: () => {},
  };
  state = {
    /* 渲染数据 */
    treeItemCur: 0, // 索引树的聚焦项
    listItemCur: 0, // 节点树的聚焦项
    touching: false, // 是否在触摸索引树中
    scrollTop: 0, // 节点树滚动高度
    indicatorTop: -1, // 指示器顶部距离
    treeKeyTran: false,
    style1: "",
    style2: "",
  };

  /* 未渲染数据 */
  platform: any = ""; // 平台信息
  remScale: number = 1; // 缩放比例
  realTopSize: number = 0; // 计算后顶部高度实际值
  realBottomSize: number = 0; // 计算后底部高度实际值
  colors: any[] = []; // 色值数组
  treeInfo: any = {
    // 索引树节点信息
    treeTop: 0,
    treeBottom: 0,
    itemHeight: 0,
    itemMount: 0,
  };
  indicatorTopList: any[] = []; // 指示器节点信息列表
  maxScrollTop: number = 0; // 最大滚动高度
  blocks: any[] = []; // 节点组信息

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.clearData();
    const { topSize, bottomSize = 0, color, listData = [] } = nextProps;
    if (!listData.length) {
      return;
    }
    let { windowHeight, windowWidth, platform } = Taro.getSystemInfoSync();
    const that = this;
    let remScale = (windowWidth || 375) / 375,
      realTopSize = (topSize * remScale) / 2,
      realBottomSize = (bottomSize * remScale) / 2,
      colors = ColorUtil.gradient(color, "#767676", 100);
    this.platform = platform;
    this.remScale = remScale;
    this.realTopSize = realTopSize;
    this.realBottomSize = realBottomSize;
    this.colors = colors;
    setTimeout(() => {
      Taro.createSelectorQuery()
        .in(that.$scope)
        .select("#tree")
        .boundingClientRect((res: any) => {
          let treeTop: number = res.top;
          let treeBottom: number = res.top + res.height;
          let itemHeight: number = res.height / listData.length;
          let itemMount: number = listData.length;
          let indicatorTopList: number[] = listData.map((_, index: number) => {
            return (
              itemHeight / 2 + index * itemHeight + treeTop - remScale * 25
            );
          });
          that.treeInfo = {
            treeTop,
            treeBottom,
            itemHeight,
            itemMount,
          };
          that.indicatorTopList = indicatorTopList;
        })
        .exec();
      Taro.createSelectorQuery()
        .in(that.$scope)
        .select("#blocks")
        .boundingClientRect((res: any) => {
          let maxScrollTop: number =
            res.height - (windowHeight - realTopSize - realBottomSize);
          that.maxScrollTop = maxScrollTop;
          Taro.createSelectorQuery()
            .in(that.$scope)
            .selectAll(".block")
            .boundingClientRect((res: any) => {
              let maxScrollIndex = -1;
              let blocks: any[] = res.map((item, index) => {
                // Math.ceil 向上取整, 防止索引树切换列表时候造成真机固定头部上边线显示过粗问题
                let itemTop = Math.ceil(item.top - realTopSize),
                  itemBottom = Math.ceil(itemTop + item.height);
                if (maxScrollTop >= itemTop && maxScrollTop < itemBottom)
                  maxScrollIndex = index;
                return {
                  itemTop: itemTop,
                  itemBottom: itemBottom,
                  scrollTop: itemTop >= maxScrollTop ? maxScrollTop : itemTop,
                  scrollIndex: maxScrollIndex === -1 ? index : maxScrollIndex,
                };
              });

              that.blocks = blocks;
            })
            .exec();
        })
        .exec();
    }, 200);
  }

  /**
   * 点击每一项后触发事件
   */
  itemClick = (e: any) => {
    const list: any[] = this.props.list;
    let { i, j } = e.currentTarget.dataset;
    let data = list[i].data[j];
    this.props.click(data);
  };
  /**
   * scroll-view 滚动监听
   */
  scroll = (e: any) => {
    const { touching } = this.state;
    const { maxScrollTop, remScale, colors } = this;
    if (touching) return;

    let scrollTop = e.detail.scrollTop;
    if (scrollTop > maxScrollTop) return;
    let blocks: any[] = this.blocks,
      stickyTitleHeight = remScale * 30;

    for (let i = blocks.length - 1; i >= 0; i--) {
      let block = blocks[i];

      // 判断当前滚动值 scrollTop 所在区间, 以得到当前聚焦项
      if (scrollTop >= block.itemTop && scrollTop < block.itemBottom) {
        // 判断当前滚动值 scrollTop 是否在当前聚焦项底一个 .block__title 高度范围内, 如果是则开启过度色值计算
        if (scrollTop > block.itemBottom - stickyTitleHeight) {
          let percent = Math.floor(
            ((scrollTop - (block.itemBottom - stickyTitleHeight)) /
              stickyTitleHeight) *
              100
          );
          let style1 = `background: rgba(237, 237, 237, ${percent}%);color: ${colors[percent]}`;
          let style2 = `background: rgba(237, 237, 237, ${
            100 - percent
          }%);color: ${colors[100 - percent]}`;
          this.setState({
            style1: style1,
            style2: style2,
            treeItemCur: i,
            listItemCur: i,
          });
        } else if (scrollTop <= block.itemBottom - stickyTitleHeight) {
          this.setState({
            style1: "",
            style2: "",
            treeItemCur: i,
            listItemCur: i,
          });
        }
        break;
      }
    }
  };

  /**
   * tree 触摸开始
   */
  clickTree = (e: any) => {
    const { blocks, indicatorTopList, platform } = this;
    const { treeItemCur } = this.state;
    // 获取触摸点信息
    let startTouch = e.changedTouches[0];
    if (!startTouch) return;
    const treeItemCurrent = this.getCurrentTreeItem(startTouch.pageY);

    if (treeItemCurrent === treeItemCur) return;
    let block = blocks[treeItemCurrent];
    if (!block) return;

    let { scrollTop, scrollIndex } = block,
      indicatorTop = indicatorTopList[treeItemCurrent];

    this.setState(
      {
        touching: true,
        style1: "",
        style2: "",
        treeItemCur: treeItemCurrent,
        scrollTop,
        listItemCur: scrollIndex,
        indicatorTop,
      },
      () => {
        setTimeout(() => {
          this.setState(
            {
              treeKeyTran: true,
            },
            () => {
              setTimeout(() => {
                this.setState({
                  treeKeyTran: false,
                  touching: false,
                });
              }, 150);
            }
          );
        }, 100);
      }
    );

    if (platform !== "devtools") Taro.vibrateShort();
  };

  /**
   * tree 触摸结束
   */
  touchEnd = () => {};
  /**
   * 获取当前触摸的 tree-item
   * @param pageY: 当前触摸点pageY
   */
  getCurrentTreeItem = (pageY: number) => {
    let { treeTop, treeBottom, itemHeight, itemMount } = this.treeInfo;
    if (pageY < treeTop) {
      return 0;
    } else if (pageY >= treeBottom) {
      return itemMount - 1;
    } else {
      return Math.floor((pageY - treeTop) / itemHeight);
    }
  };

  /**
   * 清除参数
   */
  clearData = () => {
    this.setState({
      treeItemCur: 0, // 索引树的聚焦项
      listItemCur: 0, // 节点树的聚焦项
      touching: false, // 是否在触摸索引树中
      scrollTop: 0, // 节点树滚动高度
      indicatorTop: -1, // 指示器顶部距离
      treeKeyTran: false,
      style1: "",
      style2: "",
    });
  };

  render() {
    const {
      topSize,
      bottomSize = 0,
      listData = [],
      list = [],
      emptyUrl,
      emptyText,
      emptyShow,
      color,
    } = this.props;
    const {
      scrollTop,
      treeItemCur,
      listItemCur,
      touching,
      treeKeyTran,
      indicatorTop,
      style1,
      style2,
    } = this.state;

    return (
      <View>
        <View className="view-wrap">
          <ScrollView
            className="scroll-view"
            style={{ height: `calc(100vh - ${topSize + bottomSize}rpx)` }}
            scrollY
            scrollTop={scrollTop}
            onScroll={this.scroll}
          >
            <View className="block-wrap" id="blocks">
              {list.map((item: any, index: number) => (
                <View className="block" key={index}>
                  {index == listItemCur ? (
                    <View
                      className="block__title block__title--cur"
                      style={{ color: color }}
                    >
                      <View className="title-item" style={style1}>
                        {item.key}
                      </View>
                    </View>
                  ) : index == listItemCur + 1 ? (
                    <View className="block__title">
                      <View className="title-item" style={style2}>
                        {item.key}
                      </View>
                    </View>
                  ) : (
                    <View className="block__title">
                      <View className="title-item">{item.key}</View>
                    </View>
                  )}
                  {item.data.map((idata, j) => (
                    <View
                      className="block__item"
                      key={j}
                      onClick={this.itemClick}
                      data-i={index}
                      data-j={j}
                    >
                      <View className="item">
                        <View
                          className="item__hd"
                          style={{ background: idata.color }}
                        >
                          {idata.firstChar}
                        </View>
                        <View className="item__bd">
                          <View className="info__name">
                            {idata.name}-{idata.short}
                          </View>
                          <View className="info__title">{idata.code}</View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
            <View
              className={`indicator ${
                touching && indicatorTop != -1 ? "indicator--show" : ""
              } ${treeKeyTran ? "indicator--tran" : ""}`}
              style={{ top: `${indicatorTop}px` }}
            >
              {listData[treeItemCur].key}
            </View>
            <View id="tree" className="tree" onClick={this.clickTree}>
              {listData.map((item, index) => (
                <View
                  className={`tree__item ${
                    index === treeItemCur ? "tree__item--cur" : ""
                  }`}
                  key={index}
                >
                  <View
                    className="key"
                    style={{
                      background: `${
                        index === treeItemCur ? color : "initial"
                      }`,
                    }}
                  >
                    {item.key}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          {list.length === 0 && emptyShow ? (
            <View className="empty">
              <Image className="empty-Image" src={emptyUrl || emptyImg}></Image>
              <View className="empty-text">{emptyText}</View>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

export default Index;
