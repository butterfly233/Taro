import Taro from '@tarojs/taro';
import { WebView } from '@tarojs/components';
import './index.less';

class Index extends Taro.Component {


  render() {
    return <WebView src={'http://10.39.1.121:8080/index.html#wechat_redirect'} className='container' />
  }
}

export default Index;