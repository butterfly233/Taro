import Taro from "@tarojs/taro";
import { View, ScrollView, Image } from "@tarojs/components";

import './index.less';

interface IProps {
  dataSource: any[],
  loading: boolean
}

class Index extends Taro.Component<IProps> {
  static defaultProps = {
    dataSource: [],
    loading: false,
  }

  state = {
    //  每张图片的高度
    listItems: []
  }

  componentWillReceiveProps(nextProps: IProps) {
    const that = this;
    const { dataSource } = nextProps;
    if (dataSource && dataSource.length !== that.props.dataSource.length) {
      const query = Taro.createSelectorQuery().in(that.$scope);
      setTimeout(() => {
        query.selectAll(".item")
          .boundingClientRect((res: any) => {
            const listItems = res.map((item) => Object.assign(item, { zIndex: -1 }))
            that.setState({ listItems: res })
          })
          .exec();
      }, 10);
    }
  }
  // 图片宽度
  imgWidth: number = 357; // width + margin
  //  存放每一列的高度的数组
  colHeightArray: number[] = [0, 0];

  loadedImage = (index: number, e: any) => {
    let { listItems } = this.state;
    // 最小的高度的下标
    const minIndex = this.colHeightArray[0] <= this.colHeightArray[1] ? 0 : 1;
    const itemData = listItems[index];
    // 给先加载出来的图片设置定位，摆放图片
    listItems[index].left = minIndex * this.imgWidth;
    listItems[index].top = this.colHeightArray[minIndex] + 10;
    listItems[index].zIndex = 1;
    this.setState({ listItems });
    //将图片放入高度小的那一组
    this.colHeightArray[minIndex] += itemData.height + 10;
  }

  render() {
    const { loading, dataSource } = this.props;
    const { listItems } = this.state;
    return <ScrollView scrollY className="container">
      {loading ? <View>加载中</View> : <View className='list'>
        {dataSource.map((item, index) => <View className='item' key='id' style={{ opacity: listItems[index] ? 1 : 1, top: listItems[index] ? `${listItems[index].top}px` : 0, left: listItems[index] ? `${listItems[index].left}rpx` : 0, zIndex: listItems[index] ? listItems[index].zIndex : -1 }}>
          <Image className='img' src={item.image} mode='aspectFill' lazyLoad onLoad={this.loadedImage.bind(this, index)} />
          <View className='title'>{item.title}</View>
        </View>)}
      </View>}
    </ScrollView>
  }

}

export default Index;