import Taro from "@tarojs/taro";
import { View, Map, Text } from "@tarojs/components";
import PageWrapper from "../../../components/PageWrapper";
import amap from "../../../utils/amap-wx.js";

import './index.less';

const AMap: any = new amap.AMapWX({ key: '7c4d63d978df18ad3888740c90c13f6a' });
class Index extends Taro.Component {
  state = {
    latitude: 0,
    longitude: 0,
    markers: [],
    address: '',
    nearHospital: {
      name: '',
      tel: '120'
    },
    nearPoliceStation: {
      name: '',
      tel: '110'
    },
  }
  componentWillMount() {
    this.getLocationInfo();
  }

  componentDidShow() {
    if (this.shouldUpdate) {
      this.getLocationInfo();
    }
  }

  shouldUpdate: boolean = false;


  config = {
    navigationBarTitleText: '一键救援',
    disableScroll: true
  }

  getLocationInfo = () => {
    const that = this;
    this.shouldUpdate = false;
    // 获取用户当前定位
    Taro.getLocation({
      type: 'gcj02',
      success: function (res) {
        const { latitude, longitude } = res;
        const location = `${longitude},${latitude}`;
        that.setState({ latitude, longitude });
        AMap.getRegeo({
          location,
          success(res) {
            that.setState({ address: res[0].desc });
          }
        })
        AMap.getPoiAround({
          querykeywords: '医院',
          location,
          success(res) {
            that.setState({ nearHospital: res.poisData[0] });
          }
        });
        AMap.getPoiAround({
          querykeywords: '派出所',
          location,
          success(res) {
            that.setState({ nearPoliceStation: res.poisData[0] })
          }
        })
      },
      fail: function (res) {
        // 用户未授权
        Taro.showModal({
          content: "请在打开定位的情况下使用",
          confirmText: "打开设置",
        }).then((res) => {
          // 提示在设置面板中打开
          if (res.confirm) {
            this.shouldUpdate = true;
            // 打开位置面板进行设置
            Taro.openSetting();
          } else {
            Taro.navigateBack();
          }
        });
      }
    })
  }

  openLocation = (data: any) => {
    console.log(data)
    const { pname, cityname, adname, address, name } = data;
    const location = data.location.split(',');
    const longitude = Number(location[0]);
    const latitude = Number(location[1]);
    Taro.openLocation({ latitude, longitude, name, address: `${pname}${cityname}${adname}${address}` });
  }

  callPhone = (phoneNumber: string) => {
    Taro.makePhoneCall({ phoneNumber })
  }

  render() {
    const { latitude, longitude, markers, address, nearHospital, nearPoliceStation } = this.state;

    return <PageWrapper>
      <View className="container">
        <View className='content'>
          <Map className="map" id="map" longitude={longitude} latitude={latitude} showLocation markers={markers} />
          <View>
            <View>当前位置(仅供参考)</View>
            <View>{address}</View>
          </View>
          <View>
            <View>离我最近</View>
            <View className="flex">
              <View>
                <Text className='label'>医院：</Text>
                <Text className='name'>{nearHospital.name}</Text>
              </View>
              <Text className='right' onClick={this.openLocation.bind(this, nearHospital)}>到这去 ></Text>
            </View>
            <View className="flex">
              <View>
                <Text className='label'>派出所：</Text>
                <Text className='name'>{nearPoliceStation.name}</Text>
              </View>
              <Text className='right' onClick={this.openLocation.bind(this, nearPoliceStation)}>到这去 ></Text>
            </View>
          </View>
        </View>
        <View className='flex'>
          <View onClick={this.callPhone.bind(this, nearHospital.tel)}>一键救援</View>
          <View onClick={this.callPhone.bind(this, nearPoliceStation.tel)}>一键报警</View>
        </View>
      </View>
    </PageWrapper>
  }

}

export default Index;
