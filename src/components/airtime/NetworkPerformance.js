/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import tw from 'twrnc';
import {useBpPerfomanceMetrics} from '../../hooks/billing.hook';
import {detectNetwork, getPerformanceStatus} from '../../utils/format';

const NetworkPerformance = ({
  phoneNumber,
  country,
  onStatusChange,
  selectedProvider,
}) => {
  const {data: performanceData} = useBpPerfomanceMetrics();
  const [providerStatus, setProviderStatus] = useState(null);

  useEffect(() => {
    if (!performanceData || performanceData.length === 0) {
      setProviderStatus(null);
      onStatusChange?.(null);
      return;
    }

    let matchedStatus = null;

    // 🧩 Case 1: Service provider (Electricity/Data vendor etc.)
    if (
      selectedProvider?.biller_code ||
      selectedProvider?.ID ||
      selectedProvider?.NAME
    ) {
      const providerCode =
        selectedProvider?.biller_code ||
        selectedProvider?.ID ||
        selectedProvider?.NAME;

      const filtered = performanceData.find(
        item =>
          item.vertical !== 'VTU' &&
          item.disco_code?.toLowerCase()?.replace(/[^a-z]/g, '') ===
            providerCode?.toLowerCase()?.replace(/[^a-z]/g, ''),
      );

      if (filtered) matchedStatus = {name: providerCode, ...filtered};
    }

    // 🧩 Case 2: Phone number (VTU)
    if (!matchedStatus && phoneNumber?.length >= 4) {
      const detected = detectNetwork(phoneNumber, country || 'Nigeria');
      if (detected) {
        const status = performanceData.find(item => {
          const code = item?.disco_code?.toLowerCase().replace(/[^a-z]/g, '');
          const network = detected.toLowerCase().replace(/[^a-z]/g, '');
          return item.vertical === 'VTU' && code.includes(network);
        });
        if (status) matchedStatus = {name: detected, ...status};
      }
    }

    // ✅ Update state
    setProviderStatus(matchedStatus);
    onStatusChange?.(matchedStatus || null);
  }, [performanceData, selectedProvider, phoneNumber, country]);

  // 🚫 don’t return before all hooks are called (we’re done with hooks now)
  if (!providerStatus) return null;

  const perf = getPerformanceStatus(
    providerStatus.success_percentage,
    providerStatus.provider_online,
  );

  return (
    <View style={tw`p-2 rounded ${perf.bg} mx-3 my-2`}>
      <Text style={tw`${perf.text}`}>
        {providerStatus.name} performance is {perf.label} (
        {Math.round(providerStatus.success_percentage)}% success)
      </Text>
    </View>
  );
};

export default NetworkPerformance;
