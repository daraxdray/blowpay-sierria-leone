/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import tw from 'twrnc';
import {useBpPerfomanceMetrics} from '../../hooks/billing.hook';
import {detectNetwork, getPerformanceStatus} from '../../utils/format';

const NetworkPerformance = ({phoneNumber, country, onStatusChange}) => {
  const {data: performanceData} = useBpPerfomanceMetrics();
  const [providerStatus, setProviderStatus] = useState(null);

  useEffect(() => {
    if (phoneNumber?.length >= 2 && performanceData?.length) {
      const detected = detectNetwork(phoneNumber, country || 'Nigeria');
      if (detected) {
        const status = performanceData.find(item => {
          const code = item?.disco_code?.toLowerCase().replace(/[^a-z]/g, '');
          const network = detected.toLowerCase().replace(/[^a-z]/g, '');
          return item.vertical === 'VTU' && code.includes(network);
        });

        if (status) {
          const newStatus = {name: detected, ...status};
          setProviderStatus(newStatus);
          onStatusChange?.(newStatus);
        } else {
          setProviderStatus(null);
          onStatusChange?.(null);
        }
      } else {
        setProviderStatus(null);
        onStatusChange?.(null);
      }
    }
  }, [phoneNumber, performanceData, country]);

  if (!providerStatus) {
    return null;
  }

  const perf = getPerformanceStatus(
    providerStatus.success_percentage,
    providerStatus.provider_online,
  );

  return (
    <View style={tw`p-2 rounded ${perf.bg} mx-3 my-2`}>
      <Text style={tw`${perf.text}`}>
        {providerStatus.name} network performance is {perf.label} (
        {Math.round(providerStatus.success_percentage)}% success)
      </Text>
    </View>
  );
};

export default NetworkPerformance;
