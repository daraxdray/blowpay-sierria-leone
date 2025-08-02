import { Platform } from "react-native";


const AppConstant = {
    isAmazonStore: true,
    name: Platform.OS == 'ios' || this.isAmazonStore ? "BlowPay" : "BillsByBlowMoney",
    packageName:"com.rdx.BillsByBlowmoney",
    blowmoneyPackageName:"com.blowmoney",
};

export default AppConstant;