import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import img_error1 from '@/assets/image/asyncImage/error@1x.png';
import img_error2 from '@/assets/image/asyncImage/error@2x.png';
import img_error3 from '@/assets/image/asyncImage/error@75x.png';
import './index.less';

interface IProps {
  src: string,
  width?: number,
  height?: number,
}

class Index extends Taro.Component<IProps> {
  static defaultProps = {
    src: '',
    width: 0,
    height: 0,
  }

  state = {
    _src: this.props.src,
    _loading: true,
    _width: '100%',
    _height: '100%',
    _isError: false,
  }

  componentWillMount() {
    const { width, height } = this.props;
    const _width = width ? `${width}rpx` : '100%';
    const _height = height ? `${height}rpx` : '100%';
    this.setState({ _width, _height });
  }

  loaded = () => {
    this.setState({ _loading: false })
  }

  loadError = () => {
    const { width = 0, height = 0 } = this.props;
    const aspect = width / height;
    let _src = img_error3;
    if (aspect === 1) {
      _src = img_error1;
    }
    else if (aspect === 2) {
      _src = img_error2;
    }
    this.setState({ _loading: false, _src })
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