import Taro from "@tarojs/taro";
import { View, MovableArea, MovableView, Text } from "@tarojs/components";

import "./index.less";

interface IProps {
  single?: boolean; // 是否是单选模式
  isCurrent?: boolean; // 是否是当前滑动操作板块
  delete: Function;
}

class Index extends Taro.Component<IProps> {
  staticProps = {
    single: false,
    isCurrent: true,
    delete: () => {},
  };

  state = {
    /* 渲染数据 */
    move: 0, // 手动设置位移值
  };
  /* 未渲染数据 */
  open: boolean = false; // 是否是侧滑状态
  deleteBtnWidth: number = 0; // 删除按钮宽度
  diff: number = 0; // x轴 偏移距离

  componentWillMount() {
    let { windowWidth } = Taro.getSystemInfoSync();
    this.deleteBtnWidth = ((windowWidth || 375) / 375) * 80;
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { single, isCurrent } = nextProps;
    if (single && this.props.isCurrent !== isCurrent) {
      this.open = false;
      this.setState({ move: 0 });
    }
  }

  /**
   * 删除事件
   */
  deleteItem = () => {
    this.props.delete();
  };
  /**
   * movable-view 滚动监听
   */
  change = (e) => {
    this.diff = e.detail.x;
  };
  /**
   * movable-view 触摸结束事件
   */
  touchend = (e) => {
    let { diff, deleteBtnWidth, open } = this;
    if (!open) {
      if (diff < -15) {
        this.open = true;
        this.setState({
          move: -deleteBtnWidth,
        });
      } else {
        this.open = false;
        this.setState({
          move: 0,
        });
      }
    } else {
      if (diff > -deleteBtnWidth + 10) {
        this.open = false;
        this.setState({
          move: 0,
        });
      } else {
        this.open = true;
        this.setState({
          move: -deleteBtnWidth,
        });
      }
    }
  };

  render() {
    const { move } = this.state;
    return (
      <MovableArea className="side">
        <MovableView
          className="side__view"
          onChange={this.change}
          onTouchEnd={this.touchend}
          direction="horizontal"
          inertia={true}
          damping={30}
          friction={20}
          x={move}
        >
          <View className="side__con">{this.props.children}</View>
          <View
            id="movable_delete"
            className="side__del"
            onClick={this.deleteItem}
          >
            <Text>删除</Text>
          </View>
        </MovableView>
      </MovableArea>
    );
  }
}

export default Index;
