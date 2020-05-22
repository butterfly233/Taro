import Taro from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import Modal from "@/components/modal";
import NavBar from "@/components/navbar";
import { inject } from "@tarojs/mobx";
import './index.less';

@inject('globalStore')
class Index extends Taro.Component<any>{

  state = {
    visible: false,
  }

  openModal = () => {
    this.setState({ visible: true })
  }

  closeModal = () => {
    this.setState({ visible: false })
  }

  render() {
    const { navHeight } = this.props.globalStore;
    const { visible } = this.state;

    return <View className="container" style={{ paddingTop: `${navHeight + 20}px` }} >
      <NavBar showSearch={false} showBack={true} title='模态框' />
      <Button onClick={this.openModal}>打开基础模态框</Button>
      <Modal visible={visible} title='基础模态框' onClose={this.closeModal} onCancel={this.closeModal} onConfirm={this.closeModal}>
        这里是正文内容，欢迎加入京东凹凸实验室
        这里是正文内容，欢迎加入京东凹凸实验室
        这里是正文内容，欢迎加入京东凹凸实验室
      </Modal>
    </View>
  }

}
export default Index;