import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import NavBar from "../../components/navbar";
import PageWrapper from "../../components/PageWrapper";
import './index.less'

const translate = require('google-translate-api')


class Index extends Taro.Component {

  translateText = (e: any) => {
    const { value } = e.detail
    if (!value) return;
    // translate(value, { to: 'en' }).then(res => {
    //   console.log(res.text);
    //   //=> I speak English
    //   console.log(res.from.language.iso);
    //   //=> nl
    // }).catch(err => {
    //   console.error(err);
    // });
  }

  render() {
    return <PageWrapper>
    <NavBar showBack showSearch={false} title='瀑布流布局' />
      <Input onConfirm={this.translateText.bind(this)} placeholder="请输入关键字" />
    </PageWrapper>
  }
}

export default Index;
