/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Share,
  PermissionsAndroid,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../global/components';
import {BLACK, WHITE} from '../../global/theme';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useGetTransaction, useGetTxToken} from '../../hooks/transactions.hook';
import Clipboard from '@react-native-clipboard/clipboard';
import Loader from './Loader';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import AppConstant from '../../constants/data/appConstant';
import Appicon from '../../../assets/svgs/logo_ios.svg';
import Appicon2 from '../../../assets/svgs/logo.svg';
import {generateReceiptHTML} from '../wallet/generateRecept';

const TransactionDetails = ({closeModal, transactionId}) => {
  const {data, status} = useGetTransaction(transactionId);
  const {mutate, status: gettingToken} = useGetTxToken();
  const userData = data?.data || {};
  const message = data?.message;
  const [token, setToken] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareFormat, setShareFormat] = useState('pdf'); // 'pdf' or 'text'
  const [tokenFetchTime, setTokenFetchTime] = useState(null);
  const [savedFilePath, setSavedFilePath] = useState(null); // Track saved file
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false); // Show download feedback

  // Update token fetch time when token changes
  useEffect(() => {
    if (token && !tokenFetchTime) {
      setTokenFetchTime(new Date().toLocaleString());
    }
  }, [token]);

  useEffect(() => {
    console.log(data?.data);
  }, [data?.data]);

  const copyToClipboard = text => {
    Clipboard.setString(text);
    Toast.show({
      text1: 'Copied',
      text2: text + ' has been copied to clipboard',
    });
  };

  const done = () => {
    closeModal();
  };

  const handleSwipeDown = ({nativeEvent}) => {
    if (nativeEvent.translationY > 50) {
      closeModal();
    }
  };

  const requestNewToken = () => {
    mutate(transactionId, {
      onSuccess: suc => {
        if (suc?.data) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Token fetched.',
          });
          setToken(suc?.data?.token);
        } else {
          setToken(null);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'No token available for this transaction.',
          });
        }
      },
      onError: err => {
        console.error('Token fetch error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch token.',
        });
      },
    });
  };

  // Request storage permissions (only for very old Android versions)
  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const apiLevel = Platform.Version;

      // Android 10+ doesn't need permission for Downloads folder
      if (apiLevel >= 29) {
        return true;
      }

      // Android 9 and below
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to save receipts',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  };

  // Create and save PDF receipt - Banking app style
  const createAndSharePDF = async () => {
    try {
      const htmlContent = generateReceiptHTML(userData, formatTime, token);
      const timestamp = new Date().getTime();
      const id = userData?.id || userData?.transaction?.id || 'unknown';
      const prefix =
        Platform.OS === 'ios' || AppConstant.isAmazonStore ? 'BP' : 'BM';
      const fileName = `${prefix}_Receipt_${id.slice(-4)}_${timestamp}`;

      console.log('Generating PDF:', fileName);

      // Generate PDF directly in Downloads
      const pdfOptions = {
        html: htmlContent,
        fileName: fileName,
        directory: 'Downloads',
        base64: false,
      };

      const file = await RNHTMLtoPDF.convert(pdfOptions);

      if (!file.filePath) {
        throw new Error('PDF generation failed');
      }

      // Verify file exists and has content
      const fileExists = await RNFS.exists(file.filePath);
      if (!fileExists) {
        throw new Error('PDF file was not created');
      }

      const fileStats = await RNFS.stat(file.filePath);
      console.log('PDF size:', fileStats.size, 'bytes');

      if (fileStats.size === 0) {
        throw new Error('PDF file is empty');
      }

      // Ensure file is in public Downloads folder
      let finalPath = file.filePath;

      if (Platform.OS === 'android') {
        const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}.pdf`;

        // Copy to Downloads if not already there
        if (!file.filePath.includes(RNFS.DownloadDirectoryPath)) {
          console.log('Copying to Downloads...');
          await RNFS.copyFile(file.filePath, downloadPath);

          const copyExists = await RNFS.exists(downloadPath);
          if (!copyExists) {
            throw new Error('Failed to copy to Downloads');
          }

          // Clean up temp file
          try {
            await RNFS.unlink(file.filePath);
          } catch (e) {
            console.log('Could not delete temp file:', e.message);
          }

          finalPath = downloadPath;
        }

        console.log('File saved at:', finalPath);
      }

      // Show success message with action buttons
      Toast.show({
        type: 'success',
        text1: '✓ Receipt Saved Successfully',
        text2: `Saved to Downloads/${fileName}.pdf`,
        visibilityTime: 5000,
      });

      // Store the path for later sharing
      setSavedFilePath(finalPath);
      setShowDownloadSuccess(true);

      // Hide success indicator after 3 seconds
      setTimeout(() => setShowDownloadSuccess(false), 3000);

      return finalPath;
    } catch (error) {
      console.error('PDF creation error:', error);

      Toast.show({
        type: 'error',
        text1: 'Failed to Create PDF',
        text2: error.message || 'Could not generate receipt',
        visibilityTime: 5000,
      });

      throw error;
    }
  };

  // Create and share text receipt
  const createAndShareTextFile = async () => {
    try {
      const transactionDate = userData?.updatedAt
        ? formatTime(userData?.updatedAt)
        : formatTime(userData?.flutterwaveResponse?.transaction_date);

      const amount = userData?.amount
        ? `₦${parseFloat(userData?.amount / 100)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
        : `₦${parseFloat(userData?.flutterwaveResponse?.amount)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

      const description =
        userData?.description ||
        userData?.flutterwaveResponse?.product ||
        'Transaction';

      const status =
        userData?.status || userData?.transaction?.status || 'Unknown';
      const id = userData?.id || userData?.transaction?.id || 'Unknown';

      const appName =
        Platform.OS === 'ios' || AppConstant.isAmazonStore
          ? 'BlowPay'
          : 'BillsByBlowMoney';

      const textReceipt = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${appName.toUpperCase()}
TRANSACTION RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AMOUNT: ${amount}
STATUS: ${status}
DESCRIPTION: ${description}

TRANSACTION ID: ${id}
DATE & TIME: ${transactionDate}
${
  userData?.metadata?.meterno
    ? `\nMETER NUMBER: ${userData?.metadata?.meterno}`
    : ''
}
${
  userData?.metadata?.token || token
    ? `\nTOKEN: ${userData?.metadata?.token || token?.replace('/PIN', '')}`
    : ''
}
${
  userData?.flutterwaveResponse?.extra
    ? `\nRECHARGE TOKEN: ${userData?.flutterwaveResponse?.extra}`
    : ''
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated from ${appName}
Keep this receipt for your records
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `.trim();

      const timestamp = new Date().getTime();
      const prefix =
        Platform.OS === 'ios' || AppConstant.isAmazonStore ? 'BP' : 'BM';
      const fileName = `${prefix}_Receipt_${id.slice(-4)}_${timestamp}.txt`;

      // Save to Downloads
      const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      await RNFS.writeFile(filePath, textReceipt, 'utf8');

      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        throw new Error('Text file was not created');
      }

      Toast.show({
        type: 'success',
        text1: '✓ Receipt Saved',
        text2: `Downloads/${fileName}`,
        visibilityTime: 5000,
      });

      // Store the path for later sharing
      setSavedFilePath(filePath);
      setShowDownloadSuccess(true);

      // Hide success indicator after 3 seconds
      setTimeout(() => setShowDownloadSuccess(false), 3000);

      return filePath;
    } catch (error) {
      console.error('Text file error:', error);

      Toast.show({
        type: 'error',
        text1: 'Failed to Create Receipt',
        text2: error.message || 'Could not generate text receipt',
        visibilityTime: 5000,
      });

      throw error;
    }
  };

  // Main share function
  const shareTransaction = async () => {
    if (isSharing) return;

    setIsSharing(true);

    try {
      // Check permissions for old Android versions
      if (Platform.OS === 'android' && Platform.Version < 29) {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
          Toast.show({
            type: 'error',
            text1: 'Permission Denied',
            text2: 'Storage permission required',
          });
          setIsSharing(false);
          return;
        }
      }

      // Create and save based on format
      if (shareFormat === 'pdf') {
        await createAndSharePDF();
      } else {
        await createAndShareTextFile();
      }
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Manual share function - user clicks to share after file is saved
  const manualShareFile = async () => {
    if (!savedFilePath) {
      Toast.show({
        type: 'error',
        text1: 'No File to Share',
        text2: 'Please download the receipt first',
      });
      return;
    }

    try {
      // Verify file still exists
      const fileExists = await RNFS.exists(savedFilePath);
      if (!fileExists) {
        Toast.show({
          type: 'error',
          text1: 'File Not Found',
          text2: 'Please download the receipt again',
        });
        setSavedFilePath(null);
        return;
      }

      // Open share sheet
      await Share.share({
        title: 'Transaction Receipt',
        message: 'Transaction Receipt',
        url: `file://${savedFilePath}`,
      });
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Share error:', error);
        Toast.show({
          type: 'error',
          text1: 'Share Failed',
          text2: 'Could not open share menu',
        });
      }
    }
  };

  // Toggle between PDF and text format
  const toggleShareFormat = () => {
    setShareFormat(shareFormat === 'pdf' ? 'text' : 'pdf');
    Toast.show({
      type: 'info',
      text1: `Format: ${shareFormat === 'pdf' ? 'Text' : 'PDF'}`,
      text2: `Receipt will be saved as ${
        shareFormat === 'pdf' ? 'text' : 'PDF'
      }`,
    });
  };

  // Helper: Get status color
  const getStatusColor = status => {
    if (!status) return 'bg-gray-400';

    const statusLower = status.toLowerCase();
    if (statusLower.includes('success') || statusLower === 'completed') {
      return 'bg-green-500';
    } else if (statusLower.includes('pend') || statusLower === 'processing') {
      return 'bg-yellow-500';
    } else if (
      statusLower.includes('fail') ||
      statusLower === 'declined' ||
      statusLower === 'cancelled'
    ) {
      return 'bg-red-500';
    }
    return 'bg-gray-400';
  };

  // Helper: Format timestamp
  const formatTime = timestamp => {
    if (!timestamp) return 'N/A';

    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return timestamp.toString();
    }
  };

  return (
    <PanGestureHandler onGestureEvent={handleSwipeDown}>
      <View
        style={tw`bg-white p-5 rounded-t-[20px] w-19/20 self-center rounded-b-10 gap-3 justify-between h-[85%]`}>
        {/* Header with buttons */}
        <View style={tw`flex flex-row items-center justify-between`}>
          <TouchableOpacity
            style={tw`p-1 bg-black items-center justify-center rounded-full w-[30px] h-[30px]`}
            activeOpacity={0.65}
            onPress={closeModal}>
            <Ionicons name="chevron-back" size={13} color={WHITE} />
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-1 bg-gray-200 items-center justify-center rounded-full px-3 h-[30px] flex-row`}
            activeOpacity={0.65}
            onPress={toggleShareFormat}>
            <Text style={tw`text-[10px] text-black mr-1`}>
              {shareFormat.toUpperCase()}
            </Text>
            <Ionicons name="swap-horizontal" size={13} color={BLACK} />
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-1 ${
              showDownloadSuccess ? 'bg-green-500' : 'bg-black'
            } items-center justify-center rounded-full w-[30px] h-[30px]`}
            activeOpacity={0.65}
            disabled={isSharing}
            onPress={shareTransaction}>
            <Ionicons
              name={
                showDownloadSuccess
                  ? 'checkmark'
                  : isSharing
                  ? 'cloud-download-outline'
                  : 'download-outline'
              }
              size={13}
              color={WHITE}
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={tw`mt-4 gap-3`}>
          <View style={tw`flex items-center flex-row justify-center`}>
            <View style={tw`mr-2`}>
              {Platform.OS === 'ios' || AppConstant.isAmazonStore ? (
                <Appicon width={24} height={24} />
              ) : (
                <Appicon2 width={24} height={24} />
              )}
            </View>
            <Text style={tw`text-[#101828] font-medium text-[19px]`}>
              Transaction Details
            </Text>
          </View>
        </View>

        {/* Scrollable content */}
        <View style={tw`mt-2 gap-2 h-[90%]`}>
          <ScrollView
            style={tw`border-[0.5px] border-[#D0D5DD] p-2 rounded-[8px] gap-3 mb-30 bg-white`}>
            {message === 'FAILED' ? (
              <View
                style={tw`p-4 bg-[#FEF2F2] border-l-4 border-[#EF4444] rounded-[8px]`}>
                <Text style={tw`text-[#B91C1C] font-medium text-[14px]`}>
                  Oops! Something went wrong. Please try again in a moment. If
                  the issue persists, contact support.
                </Text>
              </View>
            ) : (
              <View
                style={tw`border-[0.5px] bg-[#F8F8FA] border-[#D0D5DD] p-3 py-6 rounded-[8px] gap-6`}>
                {/* Amount */}
                <View style={tw`flex flex-row items-center justify-between`}>
                  <View>
                    <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                      Amount
                    </Text>
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      ₦
                      {parseFloat(
                        userData?.amount
                          ? userData?.amount / 100
                          : userData?.flutterwaveResponse?.amount,
                      )
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(
                        parseFloat(
                          userData?.amount
                            ? userData?.amount / 100
                            : userData?.flutterwaveResponse?.amount,
                        )
                          .toFixed(2)
                          .replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                      )
                    }>
                    <Image
                      source={require('../../../assets/icons/copy.png')}
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </View>

                {/* Description */}
                <View style={tw`flex flex-row items-center justify-between`}>
                  <View>
                    <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                      Description
                    </Text>
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      {userData?.description ||
                        userData?.flutterwaveResponse?.product ||
                        'N/A'}
                    </Text>
                  </View>
                </View>

                {/* Status */}
                <View style={tw`flex flex-row items-center justify-between`}>
                  <View>
                    <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                      Status
                    </Text>
                    <View style={tw`flex flex-row items-center`}>
                      <View
                        style={tw`h-2 w-2 rounded-full mr-2 ${getStatusColor(
                          userData?.status || userData?.transaction?.status,
                        )}`}
                      />
                      <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                        {userData?.status ||
                          userData?.transaction?.status ||
                          'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Transaction ID */}
                <View style={tw`flex flex-row items-center justify-between`}>
                  <View>
                    <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                      Transaction ID
                    </Text>
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      {userData?.id || userData?.transaction?.id || 'N/A'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(userData?.id || userData?.transaction?.id)
                    }>
                    <Image
                      source={require('../../../assets/icons/copy.png')}
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </View>

                {/* Time */}
                <View style={tw`flex flex-row items-center justify-between`}>
                  <View>
                    <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                      Time
                    </Text>
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      {formatTime(
                        userData?.updatedAt ||
                          userData?.flutterwaveResponse?.transaction_date,
                      )}
                    </Text>
                  </View>
                </View>

                {/* Recharge Token (if available) */}
                {userData?.flutterwaveResponse?.extra && (
                  <View style={tw`flex flex-row items-center justify-between`}>
                    <View>
                      <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                        Recharge Token
                      </Text>
                      <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                        {userData?.flutterwaveResponse?.extra}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        copyToClipboard(userData?.flutterwaveResponse?.extra)
                      }>
                      <Image
                        source={require('../../../assets/icons/copy.png')}
                        style={{width: 20, height: 20}}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Electricity Token Section */}
                {userData?.description === 'Electricity' && (
                  <View style={tw`mt-2 border-t border-[#E5E7EB] pt-4`}>
                    <View
                      style={tw`flex flex-row items-center justify-between mb-2`}>
                      <Text
                        style={tw`text-[#4B5563] font-semibold text-[14px]`}>
                        Token Information
                      </Text>
                    </View>

                    {/* Meter Number */}
                    <View
                      style={tw`flex flex-row items-center justify-between mb-2`}>
                      <View>
                        <Text
                          style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                          Meter Number
                        </Text>
                        <Text
                          style={tw`text-[#000000] font-medium text-[15px]`}>
                          {userData?.metadata?.meterno || 'N/A'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          copyToClipboard(userData?.metadata?.meterno)
                        }>
                        <Image
                          source={require('../../../assets/icons/copy.png')}
                          style={{width: 20, height: 20}}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Token Display or Fetch */}
                    {userData?.metadata?.token || token ? (
                      <View
                        style={tw`bg-[#FEF3C7] border-l-4 border-[#F59E0B] p-4 rounded-[8px] mb-2`}>
                        <View
                          style={tw`flex flex-row items-center justify-between`}>
                          <View style={tw`flex-1`}>
                            <Text
                              style={tw`text-[#78350F] font-normal text-[12px] mb-1`}>
                              Generated Token
                            </Text>
                            <Text
                              style={tw`text-[#000000] font-bold text-[13px]`}>
                              {userData?.metadata?.token ||
                                token?.replace('/PIN', '')}
                            </Text>
                            {tokenFetchTime && (
                              <Text
                                style={tw`text-[#78350F] font-normal text-[10px] mt-1`}>
                                Generated at: {tokenFetchTime}
                              </Text>
                            )}
                          </View>
                          <TouchableOpacity
                            style={tw`ml-2`}
                            onPress={() =>
                              copyToClipboard(
                                userData?.metadata?.token ||
                                  token?.replace('/PIN', ''),
                              )
                            }>
                            <Image
                              source={require('../../../assets/icons/copy.png')}
                              style={{width: 24, height: 24}}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      userData?.status?.toLowerCase() !== 'failed' && (
                        <View
                          style={tw`border border-[#D1D5DB] rounded-[8px] p-4 mb-2`}>
                          <View
                            style={tw`flex flex-row items-center justify-between`}>
                            <View style={tw`flex-1`}>
                              <Text
                                style={tw`text-[#4B5563] font-medium text-[14px]`}>
                                No token available
                              </Text>
                              <Text style={tw`text-[#6B7280] text-[12px] mt-1`}>
                                Click the button to fetch your token
                              </Text>
                            </View>

                            <TouchableOpacity
                              style={tw`ml-2 bg-[#10B981] px-3 py-2 rounded-[6px] ${
                                gettingToken === 'pending' ? 'opacity-70' : ''
                              }`}
                              disabled={gettingToken === 'pending'}
                              onPress={requestNewToken}>
                              {gettingToken === 'pending' ? (
                                <View style={tw`flex flex-row items-center`}>
                                  <ActivityIndicator
                                    size="small"
                                    color="#ffffff"
                                    style={tw`mr-1`}
                                  />
                                  <Text
                                    style={tw`text-white font-medium text-[12px]`}>
                                    Fetching...
                                  </Text>
                                </View>
                              ) : (
                                <Text
                                  style={tw`text-white font-medium text-[12px]`}>
                                  Fetch Token
                                </Text>
                              )}
                            </TouchableOpacity>
                          </View>

                          {gettingToken === 'error' && (
                            <Text style={tw`text-[#EF4444] text-[12px] mt-2`}>
                              Failed to fetch token. Please try again.
                            </Text>
                          )}
                        </View>
                      )
                    )}
                  </View>
                )}

                {/* Additional Metadata */}
                {userData?.metadata &&
                  Object.keys(userData.metadata).length > 0 && (
                    <View style={tw`mt-2 border-t border-[#E5E7EB] pt-4`}>
                      <Text
                        style={tw`text-[#4B5563] font-semibold text-[14px] mb-3`}>
                        Additional Information
                      </Text>

                      {Object.entries(userData.metadata).map(([key, value]) => {
                        // Skip already displayed fields
                        if (
                          key === 'walletbalance' ||
                          !value ||
                          key === 'meterno' ||
                          key === 'token'
                        ) {
                          return null;
                        }

                        // Format key
                        const formattedKey = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase())
                          .replace(/([a-z])([A-Z])/g, '$1 $2')
                          .replace(/[-_]/g, ' ');

                        // Format value
                        let displayValue = value;
                        if (typeof value === 'object' && value !== null) {
                          displayValue = JSON.stringify(value);
                        } else if (typeof value === 'boolean') {
                          displayValue = value ? 'Yes' : 'No';
                        }

                        return (
                          <View
                            key={key}
                            style={tw`flex flex-row items-center justify-between mb-3`}>
                            <View style={tw`flex-1`}>
                              <Text
                                style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                                {formattedKey}
                              </Text>
                              <Text
                                style={tw`text-[#000000] font-medium text-[15px]`}>
                                {displayValue.toString()}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() =>
                                copyToClipboard(displayValue.toString())
                              }>
                              <Image
                                source={require('../../../assets/icons/copy.png')}
                                style={{width: 20, height: 20}}
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  )}
              </View>
            )}
          </ScrollView>
        </View>

        {/* Footer */}
        <View style={tw`pb-5`}>
          {savedFilePath && (
            <View style={tw`mb-3 flex-row gap-2`}>
              <TouchableOpacity
                style={tw`flex-1 bg-blue-500 py-3 rounded-lg flex-row items-center justify-center`}
                activeOpacity={0.7}
                onPress={manualShareFile}>
                <Ionicons name="share-social" size={16} color={WHITE} />
                <Text style={tw`text-white font-medium text-[13px] ml-2`}>
                  Share
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-1 bg-green-500 py-3 rounded-lg flex-row items-center justify-center`}
                activeOpacity={0.7}
                onPress={() => {
                  Toast.show({
                    type: 'success',
                    text1: 'Receipt Saved',
                    text2: 'Check your Downloads folder',
                    visibilityTime: 3000,
                  });
                }}>
                <Ionicons name="folder-open" size={16} color={WHITE} />
                <Text style={tw`text-white font-medium text-[13px] ml-2`}>
                  View in Files
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <CustomButton onPress={done} text={'Done'} style={tw`bg-[#FF114A]`} />
          {isSharing && (
            <Text style={tw`text-center text-xs text-gray-500 mt-2`}>
              {shareFormat === 'pdf'
                ? 'Saving PDF to Downloads...'
                : 'Saving text file to Downloads...'}
            </Text>
          )}
        </View>

        {status === 'pending' && <Loader />}
      </View>
    </PanGestureHandler>
  );
};

export default TransactionDetails;
