import React from 'react';
import {View, Text} from 'react-native';
import tw from 'twrnc';
import Plan from './Plan';

const PlansList = ({plans, onPlanSelect}) => {
  return (
    <View style={tw`flex flex-wrap flex-row items-center justify-center`}>
      {plans.length > 0 ? (
        plans.map((plan, index) => {
          const rawText = plan?.desc || plan?.biller_name || '';
          const dataMatch = rawText.match(/(\d+(\.\d+)?\s*(GB|MB|TB))/i);
          const dataSize = dataMatch ? dataMatch[0] : rawText;

          return (
            <View key={index} style={tw`m-1 w-[28%]`}>
              <Plan
                amount={plan?.validity}
                dataSize={dataSize}
                duration={`₦${plan?.price
                  ?.toFixed(2)
                  .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
                onPress={() => onPlanSelect(plan)}
              />
            </View>
          );
        })
      ) : (
        <Text style={tw`text-center mt-5 text-gray-600`}>
          No Plans Available
        </Text>
      )}
    </View>
  );
};

export default PlansList;
