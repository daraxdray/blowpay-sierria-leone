import {Text, View} from 'react-native';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ServiceUnavailable = () => {
  return (
    <View style={tw`flex-1 justify-center items-center px-6 py-12`}>
      <View style={tw`mb-8 relative`}>
        <View
          style={tw`w-24 h-24 rounded-full bg-red-50 justify-center items-center`}>
          <Ionicons name="lock-closed" size={48} color="#ef4444" />
        </View>
        <View style={tw`absolute -top-2 -right-2 bg-red-500 rounded-full p-1`}>
          <Ionicons name="close" size={14} color="white" />
        </View>
      </View>
      <Text style={tw`text-center text-[16px] font-bold text-gray-900 mb-3`}>
        Service Unavailable
      </Text>

      <Text
        style={tw`text-center text-gray-600 text-[14px]  leading-6 mb-6 px-2`}>
        Service is currently not available in your region. We're working to
        expand our services soon.
      </Text>
    </View>
  );
};

export default ServiceUnavailable;
