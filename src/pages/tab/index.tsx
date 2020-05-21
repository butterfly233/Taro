import Taro from "@tarojs/taro";
import { View, Slider, Label, Radio, RadioGroup } from "@tarojs/components";
import Tab from "@/components/tab";
import NavBar from "@/components/navbar";
import { inject } from "@tarojs/mobx";
import "./index.less"


@inject('globalStore')
class Index extends Taro.Component<any> {
  state = {
    isIphoneX: false,
    tabCur1: 3,
    tabData1: [],
    tabCur2: 2,
    tabData2: [],
    size: 90,
    color: "#3F82FD",
    items: [
      { name: "蓝", value: "#3F82FD", checked: "true" },
      { name: "红", value: "#ff4158" },
    ],
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
    // 模拟异步获取数据场景
    setTimeout(() => {
      this.setState({
        tabData1: [
          "推荐",
          "精选集锦",
          "最新体验",
          "资料",
          "版本",
          "攻略",
          "排行",
          "热门",
        ],
        tabData2: ["推荐", "精选", "最新", "资料", "版本"],
      });
    }, 100);
  }

  radioChange = (e) => {
    this.setState({
      color: e.detail.value,
    });
  };
  sizeChange = (e) => {
    this.setState({
      size: e.detail.value,
    });
  };
  tabChange = (e) => {
    console.log(e);
  };

  render() {
    const {
      isIphoneX,
      tabCur1,
      tabCur2,
      tabData1,
      tabData2,
      size,
      color,
      items,
    } = this.state;
    const { navHeight } = this.props.globalStore;
    return (
      <View className="container" style={{ paddingTop: `${navHeight}px` }}>
        <NavBar title='tab标签页' showSearch={false} showBack={true} />
        <View className="tab-wrap">
          <Tab
            tabCur={tabCur1}
            tabData={tabData1}
            color={color}
            size={size}
            scroll={true}
            change={this.tabChange}
          ></Tab>
        </View>

        <View className="tab-wrap">
          <Tab
            tabCur={tabCur2}
            tabData={tabData2}
            color={color}
            size={size}
            scroll={false}
            change={this.tabChange}
          ></Tab>
        </View>

        <View className={`control-panel ${isIphoneX ? "isX" : ""}`}>
          <View className="panel-item">
            <View className="panel-item__hd">size:</View>
            <View className="panel-item__bd">
              <Slider
                onChanging={this.sizeChange}
                value={size}
                showValue
                min={80}
                max={200}
                step={10}
              />
            </View>
          </View>
          <View className="panel-item">
            <View className="panel-item__hd">color:</View>
            <View className="panel-item__bd">
              <RadioGroup className="radio-group" onChange={this.radioChange}>
                {items.map((item: any, index: number) => (
                  <Label className="radio" key={index}>
                    <Radio value="{{item.value}}" checked={item.checked} />
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
