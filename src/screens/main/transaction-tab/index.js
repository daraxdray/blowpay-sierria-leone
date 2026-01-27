import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {WHITE} from '../../../global/theme';
import Header from '../../../global/components/Header';
import tw from 'twrnc';
import SpendingsSVG from '../../../../assets/svgs/Spendings.svg';
import IncomeSVG from '../../../../assets/svgs/Income.svg';
// import {transactionst} from '../../../constants/data/Transaction';
import AddfundSVG from '../../../../assets/svgs/Addfund.svg';
import TransactionItem from '../../../components/wallet/TransactionItem';
import {useGetTransactions} from '../../../hooks/transactions.hook';
import {formatTime} from '../../../constants/data/Transaction';
const TransactionTab = props => {
  const navigation = props.navigation;
  const {data, isLoading, error} = useGetTransactions();
  const transactions = data?.data;
  

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../assets/icons/filter.png')}
          title="Transaction History"
          showIcon={true}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
        />
      </View>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <View style={tw`flex flex-row justify-between w-full`}>
            <View style={tw`flex flex-row items-center gap-2`}>
              <IncomeSVG />
              <View>
                <Text style={tw`text-[#4ADE80] font-medium text-[16px]`}>
                  +$0.00
                </Text>
                <Text style={tw`text-[#9CA3AF] font-normal text-[12px]`}>
                  Monthly Income
                </Text>
              </View>
            </View>
            <View style={tw`flex flex-row items-center gap-2`}>
              <SpendingsSVG />
              <View>
                <Text style={tw`text-[#F87171] font-medium text-[16px]`}>
                  -$0.00
                </Text>
                <Text style={tw`text-[#9CA3AF] font-normal text-[12px]`}>
                  Monthly Spending
                </Text>
              </View>
            </View>
          </View>
          <View style={tw`flex flex-row justify-between w-full `}>
            <Text style={tw`text-[#374151] font-medium text-[17px]`}>
              Transactions
            </Text>
            <TouchableOpacity>
              <Text style={tw`text-[#3B82F6] font-bold text-[16px]`}>
                See all.
              </Text>
            </TouchableOpacity>
          </View>
          <View style={tw`flex justify-center items-center h-full w-full`}>
            {transactions && transactions.length > 0 ? (
              <View>
                <FlatList
                  data={transactions}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => (
                    <TransactionItem
                      Icon={AddfundSVG}
                      time={formatTime(item.createdAt)}
                      description={item.description}
                      amount={parseFloat(item.amount / 100)
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                      amountColor={
                        item.type === 'debit' ? '#F04343' : '#10B981'
                      }
                    />
                  )}
                />
              </View>
            ) : (
              <View style={tw`flex justify-center items-center gap-2`}>
                <View
                  style={tw` p-2 rounded-lg flex-none items-center justify-center`}>
                  <Image
                    source={require('../../../../assets/icons/smiley-down.png')}
                    style={{width: 60, height: 60}}
                  />
                </View>
                <View style={tw`flex justify-center items-center`}>
                  <Text style={tw`text-[18px] font-bold text-[#374151]`}>
                    No activity to show !
                  </Text>
                  <Text
                    style={tw`text-[12px] font-normal text-center text-[#4B5563]`}>
                    You don’t have any transactions done. Once you make any
                    transactions it will show here.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default TransactionTab;
