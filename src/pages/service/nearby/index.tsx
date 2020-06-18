import Taro from "@tarojs/taro";
import { View, Map, Text, MovableArea, MovableView, Image, ScrollView } from "@tarojs/components";
import PageWrapper from "../../../components/PageWrapper";
import NavBar from "../../../components/navbar";
import amap from "../../../utils/amap-wx.js";
import image1 from "../../../assets/image/waterfall/2.jpg";

import './index.less';

const AMap: any = new amap.AMapWX({ key: '7c4d63d978df18ad3888740c90c13f6a' });
class Index extends Taro.Component {
  state = {
    latitude: 39.993015,
    longitude: 116.473168,
    markers: [],
    poisData: [],
    _height: '50vh',
  }

  componentWillMount() {
    this.getUserLocation().then((res: any) => {
      this.setState({ latitude: res.latitude, longitude: res.longitude });
      this.poiSearch(res.latitude, res.longitude);
    });
  }

  config: Taro.Config = {
    disableScroll: true,
  }

  startY: number = 0;
  scrollTop: number = 0;

  /* 获取用户定位 */
  getUserLocation = () => {
    return new Promise((resolve) => {
      Taro.getLocation({
        type: 'gcj02',
        success: function (res) {
          resolve(res)
        }
      })
    })
  }

  /* 周边搜索 */
  poiSearch = (latitude: number, longitude: number) => {
    const that = this;
    return new Promise((resolve) => {
      AMap.getPoiAround({
        location: `${longitude},${latitude}`,
        querytypes: '080000',
        success: function (res) {
          console.log(res);
          const { markers, poisData } = res;
          that.setState({ markers, poisData })
          resolve(res);
        }
      })
    })
  }

  /* formate Mile */
  formateMile = (data: string): string => {
    const mile = Number(data);
    if (mile < 100) { return '100m以内' }
    else if (mile > 100 && mile < 1000) { return `${mile}m` }
    else if (mile >= 1000) { return `${(mile / 1000).toFixed(1)}km` }
    else if (mile >= 100000) { return '>100km' }
    else return '';
  }

  touchStart = (e) => {
    this.startY = e.changedTouches[0].pageY;
  }

  touchEnd = (e) => {
    const diff = e.changedTouches[0].pageY - this.startY;
    console.log(diff, this.scrollTop)
    if (diff < -20) {
      this.setState({ _height: '80vh' })
    }
    else if (diff > 20 && this.scrollTop === 0) {
      this.setState({ _height: '50vh' })
    }
  }

  listScroll = (e) => {
    this.scrollTop = e.detail.scrollTop;
  }

  scrollToTop = (e) => {
    console.log(e);
    this.scrollTop = 0;
  }

  render() {
    const { latitude, longitude, markers, poisData, _height } = this.state;
    return <PageWrapper>
      <NavBar showSearch showBack />
      <View className='container'>
        <Map className='map' latitude={latitude} longitude={longitude} markers={markers} />
        <View className='panel' onTouchStart={this.touchStart} onTouchEnd={this.touchEnd}>
          <View className='panel_header'>地区</View>
          <ScrollView scrollY className='panel_body' upperThreshold={30} style={{ height: _height }} onScroll={this.listScroll} onScrollToUpper={this.scrollToTop}>
            {poisData.map(item => <View className='card'>
              <View className='right'>
                <Image className='img' mode="aspectFill" src={item.photos.length ? item.photos[0].url : image1} />
              </View>
              <View className='left'>
                <View className='name'>{item.name}</View>
                <View className='position'>{this.formateMile(item.distance)} | {item.address}</View>
                <View className='time'>营业时间：9:00 ~ 17:30</View>
              </View>
            </View>)}
          </ScrollView>
        </View>
      </View>
    </PageWrapper>
  }
}

export default Index;