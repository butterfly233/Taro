import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import img_error from '@/assets/image/asyncImage/error.png';
import './index.less';

interface IProps {
  src: string,
  width?: string,
  height?: string,
}

class Index extends Taro.Component<IProps> {
  static defaultProps = {
    src: '',
    width: '100%',
    height: '100%',
  }

  state = {
    _src: this.props.src,
    _loading: true,
    _width: '100%',
    _height: '100%',
  }

  loaded = () => {
    this.setState({ _loading: false })
  }

  loadError = () => {
    this.setState({ _loading: false, _src: img_error })
  }

  render() {
    const { _src, _width, _height, _loading } = this.state;
    return <View className='img_wrapper'>
      <View className={_loading ? 'spinner--active' : 'spinner'}>
        <View className="rect rect1"></View>
        <View className="rect rect2"></View>
        <View className="rect rect3"></View>
        <View className="rect rect4"></View>
        <View className="rect rect5"></View>
      </View>
      <Image className={_loading ? 'img' : 'img--active'} mode='aspectFill' lazyLoad src={_src} style={{ width: _width, height: _height }} onLoad={this.loaded} onError={this.loadError} />
    </View>
  }
}

export default Index;