import Taro from "@tarojs/taro";
import { View, MovableArea, MovableView, Text } from "@tarojs/components";
import { CommonEventFunction } from '@tarojs/components/types/common';
import { uuid } from '@/assets/common/data'

import "./index.less";

interface IProps {
  swipid: any;
  isOpened: boolean;
  delete: CommonEventFunction;
  onOpened: CommonEventFunction;
  onClosed: CommonEventFunction;
}

class Index extends Taro.Component<IProps> {
  deleteBtnWidth: number = 0;
  open: boolean = this.props.isOpened;
  diff: number = 0;
  isTouching: boolean = false;

  static props = {
    swipid: '',
    isOpened: false,
    autoClose: true,
    index: 0,
  };

  state = {
    componentId: uuid(),
    move: 0, // 手动设置位移值
  }

  componentWillMount() {
    let { windowWidth } = Taro.getSystemInfoSync();
    this.deleteBtnWidth = ((windowWidth || 375) / 375) * 80;
    this.setState({ componentId: uuid() })
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { isOpened } = nextProps;
    if (!isOpened) {
      this._reset();
      this.props.onClosed(this.props.swipid);
    }
  }

  componentWillUnmount() {
    this.open = false;
    this.deleteBtnWidth = 0;
    this.diff = 0;
    this.setState({ move: 0 });
  }

  _reset(isOpened: boolean = false) {
    this.isTouching = false;
    if (isOpened) {
      this.open = true;
      this.setState({
        move: -this.deleteBtnWidth
      })
    } else {
      this.open = false;
      this.diff = 0;
      this.setState({ move: 0 })
    }
  }

  /**
   * 删除事件
   */
  deleteItem = (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    this.props.delete(this.props.swipid);
    this._reset();
    this.handleClosed(e);
  };

  touchstart = (e) => {
    this.isTouching = true;
  }

  /**
   * movable-view 滚动监听
   */
  change = (e) => {
    if (this.isTouching) {
      this.diff = e.detail.x;
    }
  };

  handleOpened = (e) => {
    if (this.open) {
      this.props.onOpened(this.props.swipid);
    }
  }

  handleClosed = (e) => {
    if (!this.open) {
      this.props.onClosed(this.props.swipid);
    }
  }

  /**
   * movable-view 触摸结束事件
   */
  touchend = (e) => {
    if(!this.isTouching) return;
    let { diff, deleteBtnWidth, open } = this;
    this.isTouching = false;
    if ((!open && diff < -15) || (open && diff <= -deleteBtnWidth + 10)) {
      this._reset(true);
      return this.handleOpened(e)
    }
    this._reset();
    setTimeout(() => {
      this.handleClosed(e)
    }, 500)
  };

  handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    const { move, componentId } = this.state;

    return (
      <MovableArea className="side" id={`swipeAction-${componentId}`}>
        <MovableView
          className="side__view"
          onChange={this.change}
          onTouchEnd={this.touchend}
          onTouchStart={this.touchstart}
          direction="horizontal"
          inertia={true}
          damping={30}
          friction={20}
          x={move}
          animation
          onClick={this.handleClick}
        >
          <View className="side__con">{this.props.children}</View>
          <View
            id="movable_delete"
            className="side__del"
            onClick={this.deleteItem.bind(this)}
          >
            <Text>删除</Text>
          </View>
        </MovableView>
      </MovableArea>
    );
  }
}

export default Index;
