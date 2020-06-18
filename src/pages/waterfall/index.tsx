import { View } from "@tarojs/components";
import PageWrapper from "../../components/PageWrapper";
import NavBar from "../../components/navbar";
import WaterFall from "../../components/WaterFall";
import { waterFallTestData } from "../../assets/common/data";
import Taro from "@tarojs/taro";

import './index.less';

class Index extends Taro.Component {
  state = {
    loading: true,
    dataSource: [],
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({ loading: false, dataSource: waterFallTestData })
    }, 2000)
  }

  render() {
    const { loading, dataSource } = this.state;
    return <PageWrapper>
      <NavBar showBack showSearch={false} title='瀑布流布局' />
      <WaterFall loading={loading} dataSource={dataSource} />
    </PageWrapper>
  }
}

export default Index;