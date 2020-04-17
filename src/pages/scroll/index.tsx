import Taro from "@tarojs/taro";
import {
  View,
  Slider,
  Switch,
  RadioGroup,
  Label,
  Radio,
  Image,
} from "@tarojs/components";
import Scroll from "@/components/scroll";
import {testData} from "@/assets/common/data";
import { observer } from "@tarojs/mobx";

import "./index.less";

let pageStart = 0;

type TState = {
  isIphoneX: boolean;
  requesting: boolean;
  end: boolean;
  emptyShow: boolean;
  page: number;
  listData: any[];
  hasTop: boolean;
  enableBackToTop: boolean;
  refreshSize: number;
  bottomSize: number;
  color: string;
  items: any[];
  empty: boolean;
};

@observer
class Index extends Taro.Component {
  state: TState = {
    isIphoneX: false,
    requesting: false,
    end: false,
    emptyShow: false,
    page: pageStart,
    listData: [],
    hasTop: true,
    enableBackToTop: false,
    refreshSize: 90,
    bottomSize: 350,
    color: "#3F82FD",
    items: [
      { name: "蓝", value: "#3F82FD", checked: "true" },
      { name: "红", value: "#ff4158" },
    ],
    empty: false,
  };

  config: Taro.Config = {
    disableScroll: true,
  };

  componentWillMount() {
    //判断机型(适配iphoneX)
    Taro.getSystemInfo().then((res) => {
      if (res.model.search("iPhone X") !== -1) {
        this.setState({ isIphoneX: true });
      }
    });
  }

  componentDidMount() {
    this.setState({ requesting: false }, () => {
      setTimeout(() => {
        this.getList("refresh", pageStart);
      }, 100);
    });
  }

  itemClick = (e) => {
    console.log(e);
  };

  hasTopChange = (e) => {
    this.setState({
      hasTop: e.detail.value,
    });
  };
  enableBackToTopChange = (e) => {
    this.setState({
      enableBackToTop: e.detail.value,
    });
  };
  refreshChange = (e) => {
    this.setState({
      refreshSize: e.detail.value,
    });
  };
  bottomChange = (e) => {
    this.setState({
      bottomSize: e.detail.value,
    });
  };
  radioChange = (e) => {
    this.setState({
      color: e.detail.value,
    });
  };
  emptyChange = (e) => {
    if (e.detail.value) {
      this.setState({
        listData: [],
        emptyShow: true,
        end: true,
      });
    } else {
      this.setState({
        listData: testData,
        emptyShow: false,
        end: false,
      });
    }
  };
  getList = (type, currentPage) => {
    const { listData } = this.state;
    this.setState({
      requesting: true,
    });
    Taro.showNavigationBarLoading();
    // 模拟异步获取数据场景
    setTimeout(() => {
      Taro.hideNavigationBarLoading();
      if (type === "refresh") {
        this.setState({
          requesting: false,
          listData: testData,
          page: currentPage + 1,
        });
      } else {
        const data = listData.concat(testData);
        this.setState({
          requesting: false,
          listData: data,
          page: currentPage + 1,
          end: false,
        });
      }
    }, 1000);
  };

  // 刷新数据
  refresh = () => {
    this.getList("refresh", pageStart);
    this.setState({
      empty: false,
    });
  };

  // 加载更多
  more = () => {
    this.getList("more", this.state.page);
  };

  render() {
    const {
      isIphoneX,
      requesting,
      emptyShow,
      listData,
      enableBackToTop,
      refreshSize,
      bottomSize,
      hasTop,
      end,
      empty,
      items,
      color,
    } = this.state;
    return (
      <View className="container">
        {hasTop && (
          <View
            className="title"
            style={{ lineHeight: `${refreshSize < 80 ? 80 : refreshSize}rpx` }}
          >
            标题
          </View>
        )}

        <Scroll
          requesting={requesting}
          emptyShow={emptyShow}
          end={end}
          listCount={listData.length}
          hasTop={hasTop}
          enableBackToTop={enableBackToTop}
          refreshSize={refreshSize}
          bottomSize={bottomSize}
          color={color}
          refresh={this.refresh}
          more={this.more}
        >
          <View className="cells">
            {listData.map((item: any, index: number) => (
              <View className="cell" key={index} onClick={this.itemClick}>
                <View className="cell__hd">
                  <Image mode="aspectFill" src={item.images} />
                </View>
                <View className="cell__bd">
                  <View className="name">{item.title}</View>
                  <View className="des">{item.description}</View>
                </View>
              </View>
            ))}
          </View>
        </Scroll>
        <View
          className={`control-panel ${isIphoneX ? "isX" : ""}`}
          style={{ height: `${bottomSize}rpx` }}
        >
          <View className="panel-item">
            <View className="panel-item__hd">refresh-size:</View>
            <View className="panel-item__bd">
              <Slider
                onChanging={this.refreshChange}
                value={refreshSize}
                showValue={true}
                min={80}
                max={200}
                step={10}
              />
            </View>
          </View>
          <View className="panel-item">
            <View className="panel-item__hd">bottom-size:</View>
            <View className="panel-item__bd">
              <Slider
                onChanging={this.bottomChange}
                value={bottomSize}
                showValue
                min={250}
                max={400}
                step={10}
              />
            </View>
          </View>
          <View className="panel-item">
            <View className="panel-item__hd">has-top:</View>
            <View className="panel-item__bd">
              <Switch checked={hasTop} onChange={this.hasTopChange} />
            </View>
            <View className="panel-item__hd">空列表:</View>
            <View className="panel-item__bd">
              <Switch checked={empty} onChange={this.emptyChange} />
            </View>
            <View className="panel-item__hd">双击回顶部:</View>
            <View className="panel-item__bd">
              <Switch
                checked={enableBackToTop}
                onChange={this.enableBackToTopChange}
              />
            </View>
          </View>
          <View className="panel-item">
            <View className="panel-item__hd">color:</View>
            <View className="panel-item__bd">
              <RadioGroup className="radio-group" onChange={this.radioChange}>
                {items.map((item: any, index: number) => (
                  <Label className="radio" key={index}>
                    <Radio value={item.value} checked={item.checked} />
                    {item.name}
                  </Label>
                ))}
              </RadioGroup>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
