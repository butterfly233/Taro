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
import { observer } from "@tarojs/mobx";
import swipe1 from "@/assets/image/swipe/1.png";
import swipe2 from "@/assets/image/swipe/2.png";
import swipe3 from "@/assets/image/swipe/3.png";
import swipe4 from "@/assets/image/swipe/4.png";
import swipe5 from "@/assets/image/swipe/5.png";
import swipe6 from "@/assets/image/swipe/6.png";
import swipe7 from "@/assets/image/swipe/7.png";
import swipe8 from "@/assets/image/swipe/8.png";
import swipe9 from "@/assets/image/swipe/9.png";
import swipe10 from "@/assets/image/swipe/10.png";
import Scroll from "@/components/scroll";

import "./index.less";

let testData = [
  {
    title: "这个绝望的世界没有存在的价值，所剩的只有痛楚",
    description:
      "思念、愿望什么的都是一场空，被这种虚幻的东西绊住脚，什么都做不到",
    images: swipe1,
  },
  {
    title: "我早已闭上了双眼，我的目的，只有在黑暗中才能实现",
    description:
      "有太多的羁绊只会让自己迷惘，强烈的想法和珍惜的思念，只会让自己变弱",
    images: swipe2,
  },
  {
    title:
      "感受痛苦吧，体验痛苦吧，接受痛苦吧，了解痛苦吧。不知道痛苦的人是不会知道什么是和平",
    description:
      "但我已经在无限存在的痛苦之中，有了超越凡人的成长。从凡人化为神",
    images: swipe3,
  },
  {
    title:
      "我决定了 从今天起 我要选择一条不会让自己后悔的路 我要创造出属于自己的忍道 ",
    description:
      "我才不要在这种时候放弃,即使当不成中忍,我也会通过其他的途径成为火影的,这就是我的忍道",
    images: swipe4,
  },
  {
    title: "为什么你会这么弱？就是因为你对我的仇恨...还不够深...",
    description:
      "你没有杀的价值...愚蠢的弟弟啊...想要杀死我的话...仇恨吧！憎恨吧！然后丑陋地活下去吧！逃吧 逃吧...然后苟且偷生下去吧！",
    images: swipe5,
  },
  {
    title: "对于忍者而言怎样活着无所谓，怎样死去才是最重要的...",
    description:
      "所谓的忍者就是忍人所不能忍，忍受不了饿肚子，而沦落为盗贼的人，根本不能称之为忍者",
    images: swipe6,
  },
  {
    title: "在这世上，有光的地方就必定有黑暗，所谓的胜者，也就是相对败者而言",
    description:
      "若以一己之思念要维持和平，必会招致战争，为了守护爱，变回孕育出恨。此间因果，是无法斩断的。现实就是如此",
    images: swipe7,
  },
  {
    title: "世界上...只有没有实力的人,才整天希望别人赞赏...",
    description:
      "很不巧的是我只有一个人，你说的那些家伙们已经一个都没有了，已经??全部被杀死了",
    images: swipe8,
  },
  {
    title: "千代婆婆，父亲大人和母亲大人回来了吗？？？",
    description:
      "明明剩下的只有痛苦了，既然你这么想活命，我就方你一条生路好了。不过，你中的毒不出三日就会要了你的命",
    images: swipe9,
  },
  {
    title: "艺术就是爆炸！！~~ 嗯 ~~ 芸术は爆発します！",
    description:
      "我的艺术就是爆炸那一瞬，和蝎那种让人吃惊的人偶喜剧从根本上就是不同的！",
    images: swipe10,
  },
];

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
    this.getList("refresh", pageStart);
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
    this.setState(
      {
        requesting: true,
      },
      () => {
        Taro.showNavigationBarLoading();
        // 模拟异步获取数据场景
        setTimeout(() => {
          this.setState({
            requesting: false,
          });
          Taro.hideNavigationBarLoading();
          if (type === "refresh") {
            this.setState({
              listData: testData,
              page: currentPage + 1,
            });
          } else {
            const data = listData.concat(testData);
            this.setState({
              listData: data,
              page: currentPage + 1,
              end: false,
            });
          }
        }, 2000);
      }
    );
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
