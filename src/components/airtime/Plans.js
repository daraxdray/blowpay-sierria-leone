import React from 'react';
import {View, Text} from 'react-native';
import tw from 'twrnc';
import Plan from './Plan';

const PlansList = ({plans, onPlanSelect}) => {
  return (
    <View style={tw`flex flex-wrap flex-row items-center justify-center`}>
      {plans.length > 0 ? (
        plans.map((plan, index) => {
          const dataMatch = plan?.biller_name.match(/(\d+[A-Za-z]+)/);
          const durationMatch = plan?.validity_period;

          const dataSize = dataMatch ? dataMatch[0] : '';
          const duration = durationMatch
            ? `${durationMatch[1]} ${durationMatch[2]}`
            : '';
          return (
            <View key={index} style={[tw`m-1 w-[28%]`,]}>
              <Plan
                amount={durationMatch}
                dataSize={dataSize}
                duration={`Pay ₦${plan?.amount
                  .toFixed(2)
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
